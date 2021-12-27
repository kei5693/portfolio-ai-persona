<template>
  <div id="wrap" class="reserveSchedule">
    <commonHeaderFcFeedPsn></commonHeaderFcFeedPsn>

    <v-container>
      <div class="rsvTab">
        <button
          type="button"
          :class="{ on: openedContent === 1 }"
          @click="onClickTab(1)"
        >
          예약 현황
        </button>
        <button
          type="button"
          :class="{ on: openedContent === 2 }"
          @click="onClickTab(2)"
        >
          지난 예약
        </button>
      </div>

      <ScheduleStatusTab01 v-if="openedContent === 1" />
      <ScheduleStatusTab02 v-if="openedContent === 2" />

      <div class="floatingBtnBox">
        <div class="btnBox">
          <button type="button" @click="onClickMoveToScheduleSetting">
            상담 가능 일정 관리
          </button>
        </div>
      </div>
    </v-container>

    <fcCommonFooter crtPage="rsv"></fcCommonFooter>
  </div>
</template>

<script>
import commonHeaderFcFeedPsn from '@/components/include/FcAgentHeader'
import fcCommonFooter from '@/components/include/FcCommonFooter'
import ScheduleStatusTab01 from '@/components/fc/schedule/ScheduleStatusTab01'
import ScheduleStatusTab02 from '@/components/fc/schedule/ScheduleStatusTab02'
export default {
  components: {
    commonHeaderFcFeedPsn,
    fcCommonFooter,
    ScheduleStatusTab01,
    ScheduleStatusTab02,
  },
  data () {
    return {
      openedContent: 1,
    };
  },
  methods: {
    /**
     * 탭 클릭
     * 
     * @method onClickTab
     * @param {Number} index Tab 인덱스
     */
    onClickTab (index) {
      this.openedContent = index
    },

    /**
     * 상담 가능 일정 관리 페이지 이동 클릭
     * 
     * @method onClickMoveToScheduleSetting
     */
    onClickMoveToScheduleSetting () {
      this.$router.push({ path: '/fc/scheduleSetting' })
    },

    /**
     * 금일 예약 대기 및 확정 갯수 가져오기
     * 
     * @method onGetConsultingBadgeTodaycount
     */
    async onGetConsultingBadgeTodaycount () {
      const response = await this.$connect('/consultation/meeting/badge/today/count', 'GET')

      this.$store.commit('setFcConsultingBadgeTodayCount', response.body.info.badgeCount)
    }
  },
};
</script>