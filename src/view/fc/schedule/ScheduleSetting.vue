<template>
  <div id="wrap" class="fc csManagement">
    <!-- S: 앱 헤더 -->
    <commonHeader
      title="상담 가능 일정 관리"
      @clickGoBack="onClickGoBack"
    ></commonHeader>
    <!-- E: 앱 헤더 -->

    <!-- S: 콘텐츠 -->
    <v-container>
      <!-- scheduleBox -->
      <div class="scheduleSetBox">
        <div class="titleCont">
          <h2>기본 스케줄 세팅</h2>
          <p>
            상담 가능한 요일과 시간을 설정하세요.<br />선택되지 않은 요일은
            자동으로 상담 불가일로 설정됩니다.
          </p>
          <button type="button">필수 설정</button>
        </div>

        <div class="scheduleSort">
          <h2>① 요일</h2>
          <ul class="inputSortList">
            <li>
              <label
                ><input
                  type="radio"
                  name="rdo1"
                  id="rdo1-1"
                  value="0"
                  v-model="scheduleWeekRule"
                  @change="onChangeScheduleWeekRule"
                /><span>평일만</span></label
              >
            </li>
            <li>
              <label
                ><input
                  type="radio"
                  name="rdo1"
                  id="rdo1-2"
                  value="1"
                  v-model="scheduleWeekRule"
                  @change="onChangeScheduleWeekRule"
                /><span>주말만</span></label
              >
            </li>
            <li>
              <label
                ><input
                  type="radio"
                  name="rdo1"
                  id="rdo1-3"
                  value="2"
                  v-model="scheduleWeekRule"
                  @change="onChangeScheduleWeekRule"
                /><span>일주일 내내</span></label
              >
            </li>
            <li>
              <label
                ><input
                  type="radio"
                  name="rdo1"
                  id="rdo1-4"
                  value="3"
                  v-model="scheduleWeekRule"
                  @change="onChangeScheduleWeekRule"
                /><span>직접 설정</span></label
              >
            </li>
          </ul>
          <div>
            <label
              ><input
                type="checkbox"
                value="1"
                v-model="scheduleWeeks"
                :disabled="isScheduleWeekDisable"
              /><span>월</span></label
            >
            <label
              ><input
                type="checkbox"
                value="2"
                v-model="scheduleWeeks"
                :disabled="isScheduleWeekDisable"
              /><span>화</span></label
            >
            <label
              ><input
                type="checkbox"
                value="3"
                v-model="scheduleWeeks"
                :disabled="isScheduleWeekDisable"
              /><span>수</span></label
            >
            <label
              ><input
                type="checkbox"
                value="4"
                v-model="scheduleWeeks"
                :disabled="isScheduleWeekDisable"
              /><span>목</span></label
            >
            <label
              ><input
                type="checkbox"
                value="5"
                v-model="scheduleWeeks"
                :disabled="isScheduleWeekDisable"
              /><span>금</span></label
            >
            <label
              ><input
                type="checkbox"
                value="6"
                v-model="scheduleWeeks"
                :disabled="isScheduleWeekDisable"
              /><span>토</span></label
            >
            <label
              ><input
                type="checkbox"
                value="0"
                v-model="scheduleWeeks"
                :disabled="isScheduleWeekDisable"
              /><span>일</span></label
            >
          </div>
        </div>

        <div class="scheduleTime">
          <h2>② 시간</h2>
          <ul class="inputSortList">
            <li>
              <label
                ><input
                  type="radio"
                  name="rdo2"
                  id="rdo2-1"
                  v-model="scheduleTimeRule"
                  value="0"
                  @change="onChangeScheduleTimeRule"
                /><span>기본시간</span></label
              >
            </li>
            <li>
              <label
                ><input
                  type="radio"
                  name="rdo2"
                  id="rdo2-2"
                  v-model="scheduleTimeRule"
                  value="1"
                  @change="onChangeScheduleTimeRule"
                /><span>오전에만</span></label
              >
            </li>
            <li>
              <label
                ><input
                  type="radio"
                  name="rdo2"
                  id="rdo2-3"
                  v-model="scheduleTimeRule"
                  value="2"
                  @change="onChangeScheduleTimeRule"
                /><span>오후에만</span></label
              >
            </li>
            <li>
              <label
                ><input
                  type="radio"
                  name="rdo2"
                  id="rdo2-4"
                  v-model="scheduleTimeRule"
                  value="3"
                  @change="onChangeScheduleTimeRule"
                /><span>직접 설정</span></label
              >
            </li>
          </ul>

          <div class="timeList">
            <ul>
              <li v-for="item in timeTables" :key="`time-table+${item.key}`">
                <label
                  ><input
                    type="checkbox"
                    :value="item.value"
                    v-model="scheduleTimes"
                  /><span>{{ item.title }}</span></label
                >
              </li>
            </ul>
          </div>

          <!--div class="timePicker">
            <smooth-picker
              ref="smoothPicker1"
              :data="data1"
              :change="dataChange"
            />
            <span>~</span>
            <smooth-picker
              ref="smoothPicker2"
              :data="data2"
              :change="dataChange"
            />
          </div-->
        </div>
      </div>
      <!-- //scheduleBox -->
      <!-- scheduleTimeSetBox -->
      <div class="scheduleTimeSetBox">
        <div class="titleCont">
          <h2>상담 불가일</h2>
          <p></p>
        </div>

        <div class="calendar">
          <vc-date-picker
            mode="date"
            trim-weeks
            v-model="currentDate"
            :nav-visibility="'hidden'"
            :first-day-of-week="2"
            :masks="{ title: 'YYYY.M' }"
            :disabled-dates="disableDates"
            @dayclick="onClickDay"
            :attributes="datePickerAttributes"
            ref="datePicker"
          />
          <ul>
            <li>상담 가능일</li>
            <li>기본 상담 불가일</li>
            <li>특별 상담불가일</li>
          </ul>
        </div>
      </div>
      <!-- //scheduleTimeSetBox -->

      <div class="confirmBox on">
        <button type="button" @click="isPopupConfirmSave = true">
          <p>저장</p>
        </button>
      </div>
    </v-container>
    <!-- E: 콘텐츠 -->

    <commonFooter crtPage="rsv"></commonFooter>

    <popup-confirm
      v-if="isPopupConfirmSave"
      title="저장"
      desc="저장하시겠습니까?"
      @confirmBtn="onClickSaveConfirmOk"
    />

    <popup-alert
      v-if="isPopupAlert"
      :title="'상담 일정 설정 완료'"
      :desc="'상담 가능 일정 설정이 완료되었습니다.'"
      @closeAlert="onClickSaveComplete"
    />

    <popup-confirm
      v-if="isPopupConfirmBack"
      title="상담 일정 설정 취소"
      desc="일정 설정을 완료하지 않고 창을 닫으시겠습니까?"
      @confirmBtn="onClickConfirmBackOk"
    />
  </div>
</template> 
<script>
import commonHeader from '@/components/include/HeaderWithBack'
import commonFooter from '@/components/include/FcCommonFooter'
import PopupConfirm from '@/components/include/PopupConfirm'
import PopupAlert from '@/components/include/PopupAlert'
import dayjs from "dayjs";

export default {
  components: {
    commonHeader,
    commonFooter,
    PopupConfirm,
    PopupAlert
  },
  data () {
    return {
      isPopupConfirmBack: false,
      isPopupConfirmSave: false,
      isPopupAlert: false,
      scheduleWeekRule: '', // 요일 규칙
      scheduleWeeks: [], // 가능 요일
      scheduleTimeRule: '', // 가능 시간 규칙
      scheduleTimes: [], // 가능 시간
      drawer: null,
      currentDate: new Date(),
      todayValue: null,
      toastPopup: false, // 토스트 팝업
      alertLayer: false, // 레이어 팝업
      alertMgs: 1, // 단문 레이어 팝업
      disableDates: [], // 요일에 따른 상담 불가능일
      timeTables: [
        { key: 0, title: '08:00~08:30', value: '0800', type: ['am'] },
        { key: 1, title: '08:30~09:00', value: '0830', type: ['am'] },
        { key: 2, title: '09:00~09:30', value: '0900', type: ['am', 'default'] },
        { key: 3, title: '09:30~10:00', value: '0930', type: ['am', 'default'] },
        { key: 4, title: '10:00~10:30', value: '1000', type: ['am', 'default'] },
        { key: 5, title: '10:30~11:00', value: '1030', type: ['am', 'default'] },
        { key: 6, title: '11:00~11:30', value: '1100', type: ['am', 'default'] },
        { key: 7, title: '11:30~12:00', value: '1130', type: ['am', 'default'] },
        { key: 8, title: '12:00~12:30', value: '1200', type: ['pm', 'default'] },
        { key: 9, title: '12:30~13:00', value: '1230', type: ['pm', 'default'] },
        { key: 10, title: '13:00~13:30', value: '1300', type: ['pm', 'default'] },
        { key: 11, title: '13:30~14:00', value: '1330', type: ['pm', 'default'] },
        { key: 12, title: '14:00~14:30', value: '1400', type: ['pm', 'default'] },
        { key: 13, title: '14:30~15:00', value: '1430', type: ['pm', 'default'] },
        { key: 14, title: '15:00~15:30', value: '1500', type: ['pm', 'default'] },
        { key: 15, title: '15:30~16:00', value: '1530', type: ['pm', 'default'] },
        { key: 16, title: '16:00~16:30', value: '1600', type: ['pm', 'default'] },
        { key: 17, title: '16:30~17:00', value: '1630', type: ['pm', 'default'] },
        { key: 18, title: '17:00~17:30', value: '1700', type: ['pm', 'default'] },
        { key: 19, title: '17:30~18:00', value: '1730', type: ['pm', 'default'] },
        { key: 20, title: '18:00~18:30', value: '1800', type: ['pm'] },
        { key: 21, title: '18:30~19:00', value: '1830', type: ['pm'] },
        { key: 22, title: '19:00~19:30', value: '1900', type: ['pm'] },
        { key: 23, title: '19:30~20:00', value: '1930', type: ['pm'] },
        { key: 24, title: '20:00~20:30', value: '2000', type: ['pm'] },
        { key: 25, title: '20:30~21:00', value: '2030', type: ['pm'] },
        { key: 26, title: '21:00~21:30', value: '2100', type: ['pm'] },
        { key: 27, title: '21:30~22:00', value: '2130', type: ['pm'] },
        { key: 28, title: '22:00~22:30', value: '2200', type: ['pm'] },
      ],
      datePickerAttributes: [
        {
          dot: {
            style: { backgroundColor: 'black' },
          },
          dates: [],
        }, // 상담 가능일(데이터 예. "2021, 7, 26")
        {
          dot: 'red',
          dates: [],
        }, // 상담 불가능일(데이터 예. "2021, 7, 26")
      ],
      // 특별 상담불가일
      impossibleExceptionDates: [],
    }
  },
  watch: {
    scheduleWeeks () {
      this.$nextTick(() => {
        this.onSetDisableDate()
        this.onChangeScheduleWeeksToImpossibleDate()
      })
    }
  },
  computed: {
    isScheduleWeekDisable () {
      return this.scheduleWeekRule !== '3' && this.scheduleWeekRule !== ''
    }
  },
  created () {
    this.onGetScheduleRule()
  },
  methods: {
    /**
     * 달력의 날짜 클릭 이벤트
     * 
     * @method onClickDay
     * @param {Object} event 날짜 정보
     */
    onClickDay (event) {
      let year = event.year // 년
      let month = event.month // 월
      let day = event.day // 일
      let week = new Date(year, month - 1, day).getDay() // 요일

      this.onToggleImpossibleDate(`${year}, ${month}, ${day}`, week)
    },

    /**
     * 상담 불가 토글
     * 
     * @method onToggleImpossibleDate
     * @param {String} date 상담 불가 날짜(예. 2021, 7, 16)
     * @param {Number} week 요일(0 일, 1 월...)
     */
    onToggleImpossibleDate (date, week) {
      if (this.scheduleWeeks.indexOf(week.toString()) === -1) {
        return
      }

      const datePickerDate = this.onConvertImpossibleDateToDate(date)
      const findIndex = this.datePickerAttributes[1].dates.findIndex(v => {
        return date === dayjs(v).format('YYYY, M, D')
      })

      console.log(date, datePickerDate, findIndex, this.datePickerAttributes[1].dates)

      if (findIndex === -1) {
        this.datePickerAttributes[1].dates.push(datePickerDate)
      } else {
        this.datePickerAttributes[1].dates.splice(findIndex, 1)
      }
    },

    /**
     * 불가능한 날짜를 날짜 양식에 맞게 변경
     *
     * @method onConvertImpossibleDateToDate
     * @param {String} date 날짜(20210812)
     * @return {Object} result 날짜
     */
    onConvertImpossibleDateToDate (date) {
      const dates = date.replace(/ /gi, '').split(',')
      const year = parseInt(dates[0], 10)
      const month = parseInt(dates[1], 10) - 1
      const day = parseInt(dates[2], 10)

      return new Date(year, month, day)
    },

    /**
     * 요일 설정에 따른 상담 불가능한 날짜 조정
     * 
     * @method onChangeScheduleWeeksToImpossibleDate
     */
    onChangeScheduleWeeksToImpossibleDate () {
      let removeDates = []

      this.datePickerAttributes[1].dates.forEach(v => {
        const week = v.getDay()

        if (this.scheduleWeeks.filter(v => v === week.toString()).length === 0) {
          removeDates.push(v)
        }
      })

      removeDates.forEach(v => {
        const findIndex = this.datePickerAttributes[1].dates.indexOf(v)
        this.datePickerAttributes[1].dates.splice(findIndex, 1)
      })
    },

    /**
     * 예약 불가능한 기본 값 설정
     * 
     * @method onSetDisableDate
     */
    onSetDisableDate () {
      this.$set(this, 'disableDates', [])
      let disableWeeks = [0, 1, 2, 3, 4, 5, 6]

      // 서버에서 받은 가능한 일자에서 불가능한 일정만 남겨두기..(서버 API 수정이 필요)
      this.scheduleWeeks.map(v => parseInt(v, 10)).forEach(v => {
        const weekIndex = disableWeeks.indexOf(v)

        if (weekIndex !== -1) {
          disableWeeks.splice(weekIndex, 1)
        }
      })

      this.disableDates.push({ weekdays: disableWeeks.map(v => parseInt(v, 10) + 1) })
    },

    /**
     * 상담 날짜들 초기화
     * 
     * @method initScheduleRule
     */
    async onGetScheduleRule () {
      const response = await this.$connect('/consultation/role', 'GET')
      const responseBody = response.body.info

      this.$set(this, 'scheduleWeeks', responseBody.possibleWeekList)
      this.$set(this, 'scheduleTimes', responseBody.possibleTimeList)

      this.$nextTick(() => {
        this.onSetDisableDate()
      })

      responseBody.impossibleDateList.map(v => {
        const year = v.substring(0, 4)
        const month = v.substring(4, 6)
        const day = v.substring(6, 8)

        const intYear = parseInt(year, 10)
        const intMonth = parseInt(month, 10)
        const intDay = parseInt(day, 10)

        return {
          date: `${intYear}, ${intMonth}, ${intDay}`,
          week: new Date(intYear, intMonth - 1, intDay).getDay()
        }
      }).forEach(o => {
        this.onToggleImpossibleDate(o.date, o.week)
      })
    },

    /**
     * 요일 룰 선택 변경 이벤트
     * 
     * @method onChangeScheduleWeekRule
     */
    onChangeScheduleWeekRule () {
      if (this.scheduleWeekRule === '0') {
        this.$set(this, 'scheduleWeeks', this._.range(1, 6).map(v => v.toString()))
      } else if (this.scheduleWeekRule === '1') {
        this.$set(this, 'scheduleWeeks', ['0', '6'])
      } else if (this.scheduleWeekRule === '2') {
        this.$set(this, 'scheduleWeeks', this._.range(7).map(v => v.toString()))
      } else {
        this.$set(this, 'scheduleWeeks', [])
      }
    },

    /**
     * 시간 룰 선택 변경 이벤트
     * 
     * @method onChangeScheduleTimeRule
     */
    onChangeScheduleTimeRule () {
      if (this.scheduleTimeRule === '0') {
        this.$set(this, 'scheduleTimes', this.timeTables.filter(o => o.type.includes('default')).map(o => o.value))
      } else if (this.scheduleTimeRule === '1') {
        this.$set(this, 'scheduleTimes', this.timeTables.filter(o => o.type.includes('am')).map(o => o.value))
      } else if (this.scheduleTimeRule === '2') {
        this.$set(this, 'scheduleTimes', this.timeTables.filter(o => o.type.includes('pm')).map(o => o.value))
      } else {
        this.$set(this, 'scheduleTimes', [])
      }
      console.log('>>>> ', this.scheduleTimes)
    },

    /**
     * 예약 설정 저장 클릭 이벤트
     * 
     * @method onClickSaveConfirmOk
     * @param {Boolean} isOk 확인 true, 취소 false
     */
    async onClickSaveConfirmOk (isOk) {
      this.isPopupConfirmSave = false

      if (!isOk) {
        return
      }

      let requestBody = {}
      requestBody.consultationRoleWeekCodeList = []
      requestBody.consultationRoleTimeCodeList = []
      requestBody.consultationRoleImpossibleDateCodeList = []

      this.scheduleWeeks.forEach(v => {
        requestBody.consultationRoleWeekCodeList.push(v)
      })

      this.scheduleTimes.forEach(v => {
        requestBody.consultationRoleTimeCodeList.push(v)
      })

      this.datePickerAttributes[1].dates.map(v => {
        return dayjs(v).format('YYYYMMDD')
      }).forEach(v => {
        requestBody.consultationRoleImpossibleDateCodeList.push(v)
      })

      await this.$connect('/consultation/role', 'POST', JSON.stringify(requestBody), {}, {
        'Content-Type': 'application/json'
      })

      this.isPopupAlert = true
    },

    /**
     * 뒤로가기 클릭
     * 
     * @method onClickGoBack
     */
    onClickGoBack () {
      this.isPopupConfirmBack = true
    },

    /**
     * 뒤로가기 컨핌 창 OK 클릭
     * 
     * @method onClickConfirmBackOk
     * @param {Boolean} isOk 확인 true, 취소 false
     */
    onClickConfirmBackOk (isOk) {
      this.isPopupConfirmBack = false

      if (!isOk) {
        return
      }

      this.$router.push({ path: '/fc/scheduleMain' })
    },

    /**
     * 상담가능 일정 관리 완료 
     * 
     * @method onClickSaveComplete
     */
    onClickSaveComplete () {
      this.isPopupAlert = false

      this.$router.push({ path: '/fc/scheduleMain' })
    }
  },
};
</script>