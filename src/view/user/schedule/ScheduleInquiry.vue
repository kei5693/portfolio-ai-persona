<template>
  <div id="wrap" class="inquiry counseling">
    <!-- S: 앱 헤더 -->
    <commonHeader
      title="상담 관리"
      :router-path="'/user/feedMain'"
    ></commonHeader>
    <!-- E: 앱 헤더 -->

    <!-- S: 콘텐츠 -->
    <v-container>
      <div class="cntHeader">
        <div class="tabBox">
          <router-link to="/user/scheduleInquiry" class="on"
            >예약 내역</router-link
          >
          <router-link to="/user/matchingList">추천 설계사 내역</router-link>
        </div>
      </div>
      <div class="cntBody">
        <div class="reserveTab">
          <button
            type="button"
            class="rsvTabItem"
            :class="{ on: !isLastReservation }"
            @click="onClickScheduleTab(1)"
          >
            다가오는 예약
          </button>
          <button
            type="button"
            class="rsvTabItem"
            :class="{ on: isLastReservation }"
            @click="onClickScheduleTab(2)"
          >
            지난 예약
          </button>
        </div>

        <ScheduleList
          :is-last-reservation="isLastReservation"
          :consultationList="consultationList"
        />
      </div>
    </v-container>
    <!-- E: 콘텐츠 -->
  </div>
</template>
<script>
import commonHeader from "@/components/include/HeaderWithBack";
import ScheduleList from "@/components/user/schedule/ScheduleList";
import { mapGetters } from "vuex";
import dayjs from "dayjs";

export default {
  components: {
    commonHeader,
    ScheduleList,
  },
  data() {
    return {
      drawer: null,
      isLastReservation: false, // 다가오는 예약 false, 지난 예약 true
      consultationList: [],
      viewScheduleKey: 0,
    };
  },
  computed: {
    ...mapGetters({ storeUserInfo: "getUserInfo" }),
  },
  created() {
    this.onClickScheduleTab(1);
  },
  methods: {
    /**
     * 예약정보 전체 조회(고객)
     *
     * @method onClickScheduleTab
     * @param flag 다가오는 예약 (1) / 지난 예약 2
     */
    onClickScheduleTab(flag) {
      this.isLastReservation = flag != 1;

      this.$connect(
        `/consultation/meeting/client/${this.storeUserInfo.userKey}`,
        "GET",
        {},
        {
          dateWrite: `${dayjs().add(-3, "month").format("YYYYMMDDHHmmss")}`,
          flag: flag,
        }
      ).then((res) => {
        this.consultationList = this._.chain(
          res.body.info.consultationMeetingList
        )
          .groupBy((o) => o.dateWeekDay)
          .map((d, k) => {
            return {
              key: k,
              list: d,
            };
          })
          .value();
          
        console.log(">>>> 예약정보 전체", this.consultationList);
      });
    },
  },
  mounted() {
    this.scrollTop();
  },
};
</script>