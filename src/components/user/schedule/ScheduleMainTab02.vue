<template>
  <div class="contentBox dateBox">
    <p>
      설계사가 상담 가능한 일정을 확인하시고,<br />
      원하는 날짜와 시간을 선택하세요.
    </p>

    <div class="toggleBox">
      <div class="toggleTitle">
        <button type="button" @click="toggleContent($event)">날짜 선택</button>
      </div>
      <div class="calendar toggleContent">
        <vc-date-picker
          mode="date"
          trim-weeks
          :first-day-of-week="2"
          :masks="{ title: 'YYYY.M' }"
          :min-date="today"
          :disabled-dates="disableDateList"
          v-model="selectedCalendarDate"
          @dayclick="clickCalendarDay"
        />
      </div>

      <div class="help">❌ 선택이 안되는 날짜는 예약이 모두 찼거나 불가한 경우입니다.</div>
    </div>
    <div class="toggleBox">
      <div class="toggleTitle">
        <button type="button" @click="toggleContent($event)">시간 선택</button>
      </div>

      <div class="timeTable toggleContent">
        <div class="timeSort">
          <button
            type="button"
            v-for="(type, idx) in timeTypeList"
            :key="`time-type-` + idx"
            :class="{ on: type.isShow }"
            @click="changeTimeType(idx)"
          >
            <span>{{ type.name }}</span>
          </button>
        </div>
        <div class="timeList">
          <ul>
            <li
              v-for="(time, index) in showTimeList"
              :key="`timeList+${index}`"
            >
              <label>
                <input
                  type="checkbox"
                  :id="`is-select-time-` + index"
                  :key="`select-time-${index}`"
                  v-model="consultDataDateTimeCodes"
                  :value="time.timeCode"
                  :disabled="
                    !time.notTimePermission ||
                    time.notTodayTime ||
                    todayTimeDisable
                  "
                  @change="onChangeReservationTime(time.timeCode)"
                />
                <span>{{ time.timeCode | showTimeString }}</span>
              </label>
            </li>
          </ul>
          <div class="infoTxt">
            <span>선택가능</span>
            <span>선택불가</span>
          </div>
        </div>
      </div>

      <div class="help">✔ 최대 2시간(4칸)까지만 연속 선택 가능합니다.</div>
      <div class="help">❌ 선택이 안되는 시간은 예약이 모두 찼거나 불가한 경우입니다.</div>
    </div>
    <div class="toggleBox">
      <div class="toggleTitle">
        <button type="button" @click="toggleContent($event)">
          예약자 정보
        </button>
      </div>
      <div class="toggleContent">
        <ScheduleContentForm
          :selectedMeetingInfo="selectedMeetingInfo"
          @changeMeeting="changeMeeting"
        />
      </div>
    </div>

    <!-- 시간 선택 불가 -->
    <popup-alert
      v-if="isShowPopup"
      :title="popupTitle"
      :desc="popupDesc"
      @closeAlert="alertLayerClose"
    />
  </div>
</template> 
<script>
import ScheduleContentForm from "@/components/user/schedule/ScheduleContentForm.vue";
import popupAlert from "@/components/include/PopupAlert";
import { mapGetters } from "vuex";
import dayjs from "dayjs";

export default {
  components: {
    ScheduleContentForm,
    popupAlert,
  },
  props: {
    selectedConsultData: { type: Object, require: true },
  },
  data() {
    return {
      isShowPopup: false,
      fcKey: 0,

      popupTitle: "",
      popupDesc: "",

      today: dayjs().format(),
      todayTimeDisable: false,
      selectedCalendarDate: dayjs().format(),

      disableDateList: [],
      impossibleDateList: [],
      reservationConfirmList: [],
      weekList: [],
      timeList: [],
      timeTypeList: [
        { name: "전체", isShow: true },
        { name: "오전", isShow: false },
        { name: "오후", isShow: false },
      ],
    };
  },
  filters: {
    /**
     * UI 로 보여줄 시간 범위 세팅
     */
    showTimeString(timeCode) {
      var intHH = parseInt(timeCode.slice(0, 2));
      var intMM = parseInt(timeCode.slice(2, 4));

      var stringHH = String(intHH).length <= 1 ? `0${intHH}` : `${intHH}`;
      var stringHHPlus =
        String(intHH + 1).length <= 1 ? `0${intHH + 1}` : `${intHH + 1}`;
      var stringMM = String(intMM).length <= 1 ? `0${intMM}` : `${intMM}`;

      var timeString = "";
      if (intMM == 30) {
        timeString = `${stringHH}:${stringMM}~${stringHHPlus}:00`;
      } else {
        timeString = `${stringHH}:${stringMM}~${stringHH}:30`;
      }
      return timeString;
    },
  },
  computed: {
    consultDataDateCode: {
      get: function () {
        return this.selectedConsultData.dateCode;
      },
      set: function (data) {
        this.$emit("changeSelectedConsultData", {
          key: "dateCode",
          value: data,
        });
      },
    },
    consultDataTimeCode: {
      get: function () {
        return this.selectedConsultData.timeCode;
      },
      set: function (data) {
        this.$emit("changeSelectedConsultData", {
          key: "timeCode",
          value: data,
        });
      },
    },
    consultDataTimeRange: {
      get: function () {
        return this.selectedConsultData.timeRange;
      },
      set: function (data) {
        this.$emit("changeSelectedConsultData", {
          key: "timeRange",
          value: data,
        });
      },
    },
    consultDataWeekDayCode: {
      get: function () {
        return this.selectedConsultData.weekDayCode;
      },
      set: function (data) {
        this.$emit("changeSelectedConsultData", {
          key: "weekDayCode",
          value: data,
        });
      },
    },
    consultDataEmail: {
      get: function () {
        return this.selectedConsultData.email;
      },
      set: function (data) {
        this.$emit("changeSelectedConsultData", { key: "email", value: data });
      },
    },
    consultDataPhoneNumber: {
      get: function () {
        return this.selectedConsultData.phoneNumber;
      },
      set: function (data) {
        this.$emit("changeSelectedConsultData", {
          key: "phoneNumber",
          value: data,
        });
      },
    },
    consultDataSubject: {
      get: function () {
        return this.selectedConsultData.subject;
      },
      set: function (data) {
        this.$emit("changeSelectedConsultData", {
          key: "subject",
          value: data,
        });
      },
    },
    consultDataDescription: {
      get: function () {
        return this.selectedConsultData.description;
      },
      set: function (data) {
        this.$emit("changeSelectedConsultData", {
          key: "description",
          value: data,
        });
      },
    },
    consultDataDateTimeCodes: {
      get: function () {
        return this.selectedConsultData.timeCodes;
      },
      set: function (data) {
        this.$emit("changeSelectedConsultData", {
          key: "timeCodes",
          value: data,
        });
      },
    },
    selectedMeetingInfo() {
      return {
        phoneNumber: this.selectedConsultData.phoneNumber,
        email: this.selectedConsultData.email,
        subject: this.selectedConsultData.subject,
        subjectDetail: this.selectedConsultData.description,
      };
    },

    ...mapGetters({
      storeUserInfo: "getUserInfo",
    }),

    /**
     * 시간 선택 유형에 따라서 시간 목록 불러오기
     */
    showTimeList() {
      var arr = [];
      if (this.timeTypeList[1].isShow) {
        arr = this.timeList.filter((o) => Number(o.timeCode.slice(0, 2)) < 12);
      } else if (this.timeTypeList[2].isShow) {
        arr = this.timeList.filter((o) => Number(o.timeCode.slice(0, 2)) >= 12);
      } else {
        arr = this.timeList;
      }
      return arr;
    },
  },
  created() {
    if(this.selectedConsultData.dateCode === undefined){
      this.$set(this.selectedConsultData, 'dateCode', '')
    }
    if(this.selectedConsultData.timeCodes === undefined){
      this.$set(this.selectedConsultData, 'timeCodes', [])
    }

    this.fcKey = this.$route.query.fcKey;

    this.$connect(
      `/consultation/meeting/reservation/${this.fcKey}/${this.storeUserInfo.userKey}`,
      "GET",
      {},
      {}
    ).then((res) => {
      var info = res.body.info;
      this.$set(this.selectedConsultData, 'toUserName', info.plannerUserName)

      // 주간 목록
      this._.chain(info.weekList)
        .filter((o) => o.weekDayPermission === false)
        .flatMap((o) => o.weekDayCode)
        .forEach((week) => {
          this.weekList.push(week);
        })
        .value();

      // 예약 불가능한 일자 목록
      this.impossibleDateList = info.impossibleDateList;
      this._.chain(info.impossibleDateList)
        .flatMap((o) => o.dateCode)
        .forEach((date) => {
          this.disableDateList.push(
            dayjs(`${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`).format()
          );
        })
        .value();

      // 예약 불가능한 요일
      var disableList = this._.reduce(
        this.weekList,
        (result, data) => {
          result.push(Number(data) + 1);
          return result;
        },
        []
      );
      this.disableDateList.push({ weekdays: disableList });

      // 시간 목록
      this.timeList = this._.reduce(
        info.timeList,
        (result, data) => {
          result.push({
            timeCode: data.timeCode,
            notTimePermission: data.timePermission,
          });
          return result;
        },
        []
      );

      // 예약 확정된 시간 목록
      this.reservationConfirmList = this._.chain(
        info.reservationConfirmedDateList
      )
        .groupBy("dateCode")
        .reduce((result, data, idx) => {
          result.push({
            dateCode: idx,
            reservationTimeList: data.flatMap((o) => o.timeCode),
          });
          return result;
        }, [])
        .value();      

      this.getStartDate();
      this.changeDayTimeList();
    });
  },
  mounted() {
    this.scrollTop();
  },
  methods: {
    toggleContent(event) {
      var toggleBox = event.currentTarget.closest(".toggleBox");
      toggleBox.classList.toggle("on");
    },
    /**
     * 캘린더 날짜에 표시될 선택된 날짜
     */
    getStartDate() {
      const dateCode = this.selectedConsultData.dateCode;
      
      if(dateCode === ''){
        this.todayTimeDisable = this.disableDateList.filter(d => {
          if(d.weekdays !== undefined){
            return;
          }
          return this.getDateFormat(d) === this.getDateFormat(this.today)
        }).length === 0 ? false : true;

        this.todayTimeDisable = this.weekList.filter(d => d === dayjs(this.today).format('d')).length === 0 ? false : true;

        this.selectedCalendarDate = this.today;
        this.consultDataDateCode = this.today;
      }
      else{
        this.selectedCalendarDate = dayjs(
          `${dateCode.slice(0, 4)}-${dateCode.slice(4, 6)}-${dateCode.slice(6, 8)}`
        ).format()
      }
    },
    /**
     * 예약이 완료된 시간은 disable 처리 해주기
     */
    changeDayTimeList() {
      var notTodayTimeList = this._.find(this.reservationConfirmList, {
        dateCode: this.consultDataDateCode,
      });

      this._.reduce(this.showTimeList,(result, data) => {
          var notTodayTime = false;
          if (notTodayTimeList) {
            notTodayTime = this._.includes(
              notTodayTimeList.reservationTimeList,
              data.timeCode
            );
          }
          data.notTodayTime = notTodayTime;
          result.push(data);
          return result;
        },
        []
      );
    },
    /**
     * 시간 선택 유형 변경
     * @param selectedIdx 선택된 idx 값
     */
    changeTimeType(selectedIdx) {
      this.allTypeOff();
      this.timeTypeList[selectedIdx].isShow = true;
    },
    /**
     * 모든 유형 isShow 속성 false 로 변경
     */
    allTypeOff() {
      this.timeTypeList.forEach((type) => {
        type.isShow = false;
      });
    },
    /**
     * 캘린더 날짜 클릭 시 동작하는 메소드
     */
    clickCalendarDay(selectedDate) {
      this.todayTimeDisable = false;

      var dateCode = selectedDate.id.replaceAll("-", "");
      var weekdayPosition = selectedDate.weekdayPosition;
      var isDisableDate = false;

      if (
        this._.filter(this.impossibleDateList, { dateCode: dateCode }).length >
        0
      ) {
        isDisableDate = true;
      }
      if (
        this._.chain(this.weekList)
          .map((d) => {
            return [7, 1, 2, 3, 4, 5, 6][parseInt(d)];
          })
          .filter((d) => {
            return d == weekdayPosition;
          })
          .value().length > 0
      ) {
        isDisableDate = true;
      }

      // 불가능한 요일 및 불가능한 날짜인지 확인
      if (isDisableDate || dateCode === this.consultDataDateCode) {
        this.consultDataDateCode = "";
        this.selectedCalendarDate = null;
        this.todayTimeDisable = true;
      } 
      else {
        this.consultDataDateCode = dateCode;
        this.todayTimeDisable = false;
      }

      this.changeDayTimeList();
      this.changeTimeType(0);
      this.consultDataDateTimeCodes = []; 
    },
    /**
     * 예약할 시간 클릭 시 동작하는 메소드
     */
    onChangeReservationTime(timeCode) {
      if (this.consultDataDateTimeCodes.length > 1) {
        const times = this._.sortBy(this.consultDataDateTimeCodes);

        for (
          let index = 0;
          index < this.consultDataDateTimeCodes.length - 1;
          index++
        ) {
          const time = parseInt(times[index], 10);
          const afterTime = parseInt(times[index + 1], 10);

          const diffTime = afterTime - time;
          if (diffTime >= 100) {
            this.removeSelectTime(timeCode);
            break;
          }
        }
      }
      if (this.consultDataDateTimeCodes.length > 4) {
        this.removeSelectTime(timeCode);
      }
    },
    /**
     * 선택된 시간 목록에서 특정 시간 삭제
     *
     * @method removeSelectTime
     * @param {String} timeCode 시간 값(예. 0700)
     */
    removeSelectTime(timeCode = "") {
      this.$nextTick(() => {
        this.alertLayerOpen(
          "2시간 이상 예약 불가",
          "30분 단위로 4칸까지만<br>연속 선택이 가능합니다."
        );

        const findIndex = this._.findIndex(
          this.consultDataDateTimeCodes,
          (v) => v === timeCode
        );

        if (findIndex > -1) {
          this.consultDataDateTimeCodes.splice(findIndex, 1);
        }
      });
    },
    /**
     * 팝업 열기
     */
    alertLayerOpen(title, desc) {
      this.isShowPopup = true;
      this.popupTitle = title;
      this.popupDesc = desc;
    },
    /**
     * 팝업 닫기
     */
    alertLayerClose() {
      this.isShowPopup = false;
      this.popupTitle = "";
      this.popupDesc = "";
    },
    /**
     * 예약자 정보 입력 값 갱신
     */
    changeMeeting(meetingInfo) {
      this.consultDataEmail = meetingInfo.email;
      this.consultDataPhoneNumber = meetingInfo.phoneNumber;
      this.consultDataSubject = meetingInfo.subject;
      this.consultDataDescription = meetingInfo.subjectDetail;
    },
    /**
     * DateFormat 형식 => yyyyMMdd 형식으로 리턴
     */
    getDateFormat (date) {
      if (date == null) {
        return;
      }
      return dayjs(date).format('YYYYMMDD')
    },

  },
};
</script>