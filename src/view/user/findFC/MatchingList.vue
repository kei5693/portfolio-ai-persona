<template>
  <div id="wrap" class="inquiry matchingFC">
    <!-- S: 앱 헤더 -->
    <commonHeader title="상담 관리"></commonHeader>
    <!-- E: 앱 헤더 -->

    <!-- S: 콘텐츠 -->
    <v-container>
      <div class="cntHeader">
        <div class="tabBox">
          <router-link to="/user/scheduleInquiry">예약 내역</router-link>
          <router-link to="/user/matchingList" class="on"
            >추천 설계사 내역</router-link
          >
        </div>
      </div>

      <div class="cntBody">
        <div class="commentText">
          최근 30일내 매칭 내역만 확인할 수 있습니다.
        </div>

        <div
          class="dayGroup"
          v-for="(date, dateIdx) in recommendDateList"
          :key="`recommend-date-` + dateIdx"
        >
          <h4>
            <p>{{ date }}</p>
            <p
              class="off"
              ref="selectedDate"
              @click="clickToggle($event, date, dateIdx)"
            >
              <span class="on">접기</span>
              <span class="off">모두보기</span>
              <i><img src="@/assets/img/icon_arrow_down.svg" alt="" /></i>
            </p>
          </h4>

          <div
            class="listBox"
            v-show="isShowFCList[dateIdx]"
            v-for="(recommend, recommendIdx) in recommendList[dateIdx]"
            :key="`recommend-` + recommendIdx"
          >
            <FcInfoCard :matchFCInfo="recommend" />
          </div>
        </div>
      </div>
    </v-container>
    <!-- E: 콘텐츠 -->
  </div>
</template>

<script>
import StorageUtils from "@/utils/storage-utils";

import commonHeader from "@/components/include/HeaderWithBack";
import FcInfoCard from "@/components/user/findFC/FcInfoCard";

export default {
  components: {
    commonHeader,
    FcInfoCard,
  },
  data () {
    return {
      loader: true,
      recommendDateList: [],
      recommendList: [],
      isShowFCList: []
    };
  },
  created () {
    this.$connect('/user/match/recommend-fc/date', 'GET', {}, {}, { "x-token": StorageUtils.getToken() })
      .then((res => {
        this.recommendDateList = res.body.list
      }))
  },
  mounted () {
    var wrapper = document.querySelector("html");
    wrapper.classList.add("noScroll");

    setTimeout(() => {
      wrapper.classList.remove("noScroll");
      this.loader = false;
    }, 1500);
  },
  methods: {
    /**
     * 추천 설계사 토글 클릭 시 동작하는 메소드
     */
    clickToggle (event, date, dateIdx) {
      var target = event.currentTarget;
      target.classList.toggle("off");

      if (!target.classList.contains("off")) {
        this.$connect(`/user/match/recommend-fc/date/${date.replace(/\./gi, "")}`, 'GET', {}, {})
          .then((res => {
            this.$set(this.recommendList, dateIdx, res.body.list)
          }))
      }
      this.$set(this.isShowFCList, dateIdx, !target.classList.contains("off"))
    },
  },
};
</script>