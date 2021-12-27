<template>
  <div class="contentBox">
    <p>
      최종 예약 정보를 확인하시고<br />
      예약 신청을 확정하세요.
    </p>
    <ScheduleContentConfirm
      :reserveType="reserveType"
      :selectedConsultData="selectedConsultData"
    />

    <!-- S: 레이어 -->
    <div class="layerBox dark" v-if="reserveConfirmLayer">
      <div class="layerContent reserveConfirmLayer">
        <!--div class="visual">
          <img src="~@/assets/img/reserveConfirm01.png" alt="" />
        </div-->

        <div class="title">
          <h2>예약이 완료되었습니다.</h2>
          <p>예약 일정에 늦지않게 접속해주세요.</p>
        </div>

        <div class="infoBox">
          <h3>🗓 예약 정보</h3>
          <ScheduleContentConfirm
            :reserveType="reserveType"
            :selectedConsultData="selectedConsultData"
          />

          <h4>📌 참고</h4>
          <ul class="bullList">
            <li>- 예약일 도래 시 알림 문자를 보내드립니다.</li>
            <li>- 상담 전, 상황에 따라 설계사가 연락을 드릴 수 있습니다.</li>
          </ul>
        </div>

        <div class="btnBox half">
          <router-link to="/user/scheduleInquiry">예약내역 확인</router-link>
          <router-link to="/user/feedMain">홈으로 이동</router-link>
        </div>
      </div>
    </div>
    <!-- E: 레이어 -->
  </div>
</template> 
<script>
import ScheduleContentConfirm from "@/components/user/schedule/ScheduleContentConfirm.vue";
export default {
  components: {
    ScheduleContentConfirm,
  },
  props: {
    reserveType: String,
    selectedConsultData: Object,
    reserveConfirmLayer: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.scrollTop();
  },
};
</script>