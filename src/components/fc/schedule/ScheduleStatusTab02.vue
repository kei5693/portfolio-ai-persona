<template>
  <div class="rsvLatest">
    <template v-for="(dateCode, index) in consultingTitles">
      <section :key="`consulting-sectiong-${index}`">
        <div class="secTitle">
          <div class="date">{{ dateCode }}</div>
          <div class="t otal">
            <b>{{ consultings[dateCode].length }}</b
            >건
          </div>
        </div>

        <div class="customerList">
          <template v-for="(item, index2) in consultings[dateCode]">
            <div
              :class="['customerItem', consultingStates[item.state].class]"
              :key="`consulting-view-${index2}`"
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
                <div class="rsvState">
                  {{ consultingStates[item.state].state }}
                </div>
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
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import TokenUtils from '@/utils/token-utils'

export default {
  data () {
    return {
      search: {
        startDateTimeCode: `${new Date().getFullYear()}01010000`,
        endDateTimeCode: `${new Date().getFullYear()}12312359`
      }, // 1년치 정보
      consultings: {},
      consultingTitles: [],
      consultingStates: [
        { class: '', state: '' },
        { class: 'wait', state: '수락 대기', suffixStateChange: '' },
        { class: 'rsved', state: '상담예정', suffixStateChange: '' },
        { class: 'canceled', state: '취소된 예약', suffixStateChange: '예약 취소' },
        { class: 'modified', state: '변경된 예약', suffixStateChange: '예약 변경' },
        { class: 'done', state: '완료된 예약', suffixStateChange: '' },
      ],
    }
  },
  created () {
    this.onGetConsulting()
  },
  mounted () {
    this.scrollTop()
  },
  methods: {
    /**
     * 컨설팅 목록 가져오기
     * 
     * @method onGetConsulting
     */
    async onGetConsulting () {
      const response = await this.$connect(`/consultation/meeting/planner/${TokenUtils.getUserKey()}`, 'GET', {}, {
        startDateTimeCode: this.search.startDateTimeCode,
        endDateTimeCode: this.search.endDateTimeCode
      })

      console.log(response.body.info.consultationMeetingList)
      this.onSetConsulting(response.body.info.consultationMeetingList)
    },

    /**
     * 컨설팅 정보 셋팅
     * 
     * @method onSetConsulting
     * @param {Array} consultings 컨설팅 목록
     */
    onSetConsulting (consultings) {
      consultings.forEach(o => {
        const dateCode = o.dateCode.substring(0, 7)
        const datas = o.data

        console.log(dateCode, datas)

        if (this.consultings[dateCode] === undefined) {
          this.$set(this.consultings, dateCode, [])
          this.consultingTitles.push(dateCode)
        }

        datas.forEach(o2 => this.consultings[dateCode].push(o2))
      })

      this.consultingTitles.reverse()
    },

    /**
     * 스케쥴 상세 클릭
     * 
     * @method onClickScheduleDetail
     * @param {Number} consultingKey
     */
    onClickScheduleDetail (consultingKey) {
      this.$router.push({ path: `/fc/scheduleDetail/${consultingKey}` })
    },
  },
};
</script>