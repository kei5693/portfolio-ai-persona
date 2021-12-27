<template>
  <div class="rsvManagement">
    <div class="calendar">
      <vc-date-picker
        v-if="isShowDatePicker"
        mode="date"
        trim-weeks
        v-model="currentDate"
        :nav-visibility="'hidden'"
        :first-day-of-week="2"
        :masks="{ title: 'YYYY.M' }"
        :disabled-dates="disableDates"
        @dayclick="onClickDay"
        @transition-start="onChangeMonth"
        :attributes="datePickerAttributes"
        ref="datePicker"
      />
      <ul>
        <li>상담 예약 있는 날</li>
        <li>특별 상담불가 시간 설정한 날</li>
      </ul>
    </div>

    <div class="customerList">
      <template v-for="(item, index) in consultingViews">
        <div
          :class="['customerItem', consultingStates[item.state].class]"
          :key="`consulting-view-${index}`"
        >
          <a @click="onClickScheduleDetail(item.key)">
            <div class="cstmName">
              <b>{{ item.fromUserName }}</b> 고객님
              <span v-if="item.state === 5">미녹화</span>
            </div>
            <div class="rsvInfo">
              <span class="rsvDate">{{ item.dateCode }}</span>
              <span class="rsvType">{{ item.consultationType }}</span>
              <span class="rsvTime"
                >{{ item.timeRange
                }}{{
                  item.state === 5
                    ? `(종료 시각 ${item.dateConsultingEnd}, ${item.consultingProgressMin}분)`
                    : ""
                }}</span
              >
            </div>
            <div class="rsvState">{{ consultingStates[item.state].state }}</div>
            <div class="rsvModify">
              <div class="rscModifyDate">
                {{
                  item.state === 3
                    ? item.dateCancel
                    : item.state === 4
                    ? item.dateUpdate
                    : ""
                }}
                {{ consultingStates[item.state].suffixStateChange }}
              </div>
            </div>
          </a>
        </div>
      </template>
      <template v-if="consultingViews.length == 0">
        <div class="noSchedule">예약 일정이 없습니다.</div>
      </template>
    </div>
  </div>
</template>

<script>
import TokenUtils from "@/utils/token-utils";
import StringUtils from "@/utils/string-utils";
import dayjs from "dayjs";

export default {
  data () {
    return {
      isShowDatePicker: false,
      currentDate: new Date(),
      disableDates: [], // 상담 불가능한 날짜
      consultings: {}, // 날짜에 따른 컨설팅 목록
      consultingViews: [], // 화면에 보여줄 컨설팅 목록
      consultingStates: [
        { class: "", state: "" },
        { class: "wait", state: "수락 대기", suffixStateChange: "" },
        { class: "rsved", state: "상담예정", suffixStateChange: "" },
        {
          class: "canceled",
          state: "취소된 예약",
          suffixStateChange: "예약 취소",
        },
        {
          class: "modified",
          state: "변경된 예약",
          suffixStateChange: "예약 변경",
        },
        { class: "done", state: "완료된 예약", suffixStateChange: "" },
      ],
      possibleWeeks: [], // 상담 불가능한 요일
      dateFormatYYYYMD: 'YYYY, M, D',
      datePickerAttributes: [
        {
          dot: {
            style: { backgroundColor: "black" },
          },
          dates: [],
        }, // 상담 가능일(데이터 예. "2021, 7, 26")
        {
          dot: {
            style: { backgroundColor: "red" },
          },
          dates: [],
        }, // 상담 불가능일(데이터 예. "2021, 7, 26")
      ],
    };
  },
  created () {
    this.onGetScheduleRule();
    this.onGetConsulting();
  },
  mounted () {
    this.scrollTop();
  },
  watch: {},
  methods: {
    /**
     * 컨설팅 목록 가져오기
     *
     * @method onGetConsulting
     * @param {String} paramStartDate 시작 날짜(20210730)
     */
    async onGetConsulting (paramStartDate) {
      let startDate = paramStartDate;
      let endDate = "";
      let year = 0;
      let month = 0;

      if (startDate === undefined) {
        year = this.currentDate.getFullYear();
        month = this.currentDate.getMonth();

        startDate = `${year}${StringUtils.fillZero(2, month + 1)}01`;
        endDate = `${year}${StringUtils.fillZero(
          2,
          month + 1
        )}${StringUtils.fillZero(2, new Date(year, month + 1, 0).getDate())}`;
      } else {
        year = parseInt(startDate.substring(0, 4), 10);
        month = parseInt(startDate.substring(4, 6), 10);

        startDate = `${year}${StringUtils.fillZero(2, month)}01`;
        endDate = `${year}${StringUtils.fillZero(
          2,
          month
        )}${StringUtils.fillZero(2, new Date(year, month, 0).getDate())}`;
      }

      startDate = `${startDate}0000`;
      endDate = `${endDate}2359`;

      const response = await this.$connect(
        `/consultation/meeting/planner/${TokenUtils.getUserKey()}`,
        "GET",
        {},
        {
          startDateTimeCode: startDate,
          endDateTimeCode: endDate,
        }
      );

      this.onSetConsulting(response.body.info.consultationMeetingList);

      if (paramStartDate === undefined) {
        // 최초 호출시에는 오늘 날짜 셋팅
        this.onSetConsultingView(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth() + 1,
          this.currentDate.getDate()
        );
      }
    },

    /**
     * 컨설팅 정보 셋팅
     *
     * @method onSetConsulting
     * @param {Array} consultings 컨설팅 목록
     */
    onSetConsulting (consultings) {
      consultings.forEach((o) => {
        const dateCode = o.dateCode; // 2021.07.16
        const datas = o.data;

        this.onSetCalendarExistConsulting(dateCode, datas)

        this.$set(this.consultings, dateCode, datas.map(o3 => {
          o3.dateCode = dateCode;
          return o3;
        })
        );
      });
    },

    /**
     * 달력에서 상담 예약 있는 날 셋팅
     * 
     * @method onSetCalendarExistConsulting
     * @param {String} dateCode 날짜 코드(2021.07.16)
     * @param {Array} datas 상담 정보
     */
    onSetCalendarExistConsulting (dateCode, datas) {
      console.log(dateCode, datas.filter(o2 => o2.state === 1 || o2.state === 2))

      // 상담 수락 및 대기 중인 예약 목록
      const consultingWaitAndAcceptState = datas.filter(o2 => o2.state === 1 || o2.state === 2)

      if (consultingWaitAndAcceptState.length === 0) {
        return
      }

      // XXX 아이폰에서는 2021.08.21 에 대한 format 을 할 수가 없음(PC, 안드로이드에서만 가능). 그래서 replace 를 사용
      const yyyymdDate = dayjs(dateCode.replace(/\./gi, '')).format(this.dateFormatYYYYMD)
      const datePickerDate = this.onConvertImpossibleDateToDate(yyyymdDate)
      const findIndex = this.datePickerAttributes[0].dates.findIndex(v => {
        return yyyymdDate === dayjs(v).format(this.dateFormatYYYYMD)
      })

      if (findIndex === -1) {
        this.datePickerAttributes[0].dates.push(datePickerDate)
      }
    },

    /**
     * 달력의 날짜 클릭 이벤트
     *
     * @method onClickDay
     * @param {Object} event 날짜 정보
     */
    onClickDay (event) {
      const diasbledDate = `${event.year}, ${event.month}, ${event.day}`;

      if (this.disableDates.filter((v) => v === diasbledDate).length !== 0) {
        return;
      }

      this.onSetConsultingView(event.year, event.month, event.day);
    },

    /**
     * 컨설팅 목록 뷰 셋팅
     */
    onSetConsultingView (year, month, date) {
      const dateCode = `${year}.${StringUtils.fillZero(
        2,
        month
      )}.${StringUtils.fillZero(2, date)}`;

      const result = this.consultings[dateCode];

      console.log("가져 올 컨설팅 데이트 코드: ", dateCode);
      console.log("컨설팅 뷰 정보 목록: ", result);

      this.$set(this, "consultingViews", result === undefined ? [] : result);
    },

    /**
     * 년/월 변경 이벤트
     *
     * @method onChangeMonth
     */
    onChangeMonth () {
      // TODO 문서 보다가 현재의 년/월을 가져오는것을 못찾았음..찾으면 제보좀 부탁드립니다.
      this.$nextTick(() => {
        window.setTimeout(() => {
          const calendarHeaderTitle =
            this.$refs.datePicker.$el.querySelector(".vc-title").textContent;
          const calendarHeaderTitles = calendarHeaderTitle.split(".");
          let year = calendarHeaderTitles[0];
          let month = StringUtils.fillZero(2, calendarHeaderTitles[1]);

          this.onGetConsulting(`${year}${month}`);
          // this.onChangeDiabledDate(year, month);
        }, 300);
      });
    },

    /**
     * 스케쥴 상세 클릭
     *
     * @method onClickScheduleDetail
     * @param {Number} consultingKey
     */
    onClickScheduleDetail (consultingKey) {
      this.$router.push({ path: `/fc/scheduleDetail/${consultingKey}` });
    },

    /**
     * 상담 날짜들 초기화
     *
     * @method initScheduleRule
     */
    async onGetScheduleRule () {
      const response = await this.$connect("/consultation/role", "GET");
      const responseBody = response.body.info;

      this.$set(this, "possibleWeeks", responseBody.possibleWeekList);

      responseBody.impossibleDateList.map(v => {
        const date = dayjs(v)

        return {
            date: date.format(this.dateFormatYYYYMD),
            week: date.day(),
          };
      }).forEach(o => {
          const datePickerDate = this.onConvertImpossibleDateToDate(o.date)
          const findIndex = this.datePickerAttributes[1].dates.findIndex(v => {
            return datePickerDate === dayjs(v).format(this.dateFormatYYYYMD)
          })

        if (findIndex === -1) {
          this.datePickerAttributes[1].dates.push(datePickerDate);
        }
      });

      this.onChangeDiabledDate();

      this.isShowDatePicker = true;
    },

    /**
     * 불가능한 날짜를 날짜 양식에 맞게 변경
     *
     * @method onConvertImpossibleDateToDate
     * @param {String} date 날짜(20210812)
     * @return {Object} result 날짜
     */
    onConvertImpossibleDateToDate(date) {
      const dates = date.replace(/ /gi, '').split(',')
      const year = parseInt(dates[0], 10)
      const month = parseInt(dates[1], 10) - 1
      const day = parseInt(dates[2], 10)

      return new Date(year, month, day)
    },

    /**
     * 요일 설정에 따른 상담 불가능한 날짜 조정
     *
     * @method onChangeDiabledDate
     */
    onChangeDiabledDate () {
      let disableWeeks = [0, 1, 2, 3, 4, 5, 6]

      // 서버에서 받은 가능한 일자에서 불가능한 일정만 남겨두기..(서버 API 수정이 필요)
      this.possibleWeeks.map(v=> parseInt(v, 10)).forEach(v => {
        const weekIndex = disableWeeks.indexOf(v)

        if (weekIndex !== -1) {
          disableWeeks.splice(weekIndex, 1)
        }
      })

      this.disableDates.push({ weekdays: disableWeeks.map(v => parseInt(v, 10) + 1) })
      /*
      year = parseInt(year, 10);
      month = parseInt(month, 10);

      const lastDate = new Date(year, month, 0).getDate(); // 마지막 일

      this._.range(1, lastDate + 1).forEach((value) => {
        const date = new Date(year, parseInt(month, 10) - 1, value);
        const week = date.getDay(); // 0 일, 1 월, 2 화, 3 수, 4 목, 5 금, 6 토

        if (
          this.possibleWeeks.filter((v) => v === week.toString()).length === 0
        ) {
          this.disableDates.push(`${year}, ${month}, ${value}`);
        }
      });
      */
    },
  },
};
</script>