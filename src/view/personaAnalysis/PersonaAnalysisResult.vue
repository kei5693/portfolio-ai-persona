<template>
  <div id="wrap" class="diagnosisResult">
    <!-- S: 앱 헤더 -->
    <commonHeader title="성향 페르소나 결과"></commonHeader>
    <!-- E: 앱 헤더 -->

    <!-- S: 콘텐츠 -->
    <v-container>
      <PsnResult type="diagnosis"></PsnResult>

      <div class="confirmBox on">
        <router-link to="/user/matchingFC"><p>설계사 추천 받기</p></router-link>
      </div>
    </v-container>
    <!-- E: 콘텐츠 -->
  </div>
</template>

<script>
import commonHeader from "@/components/include/HeaderWithBack";
import PsnResult from "@/components/user/myPage/PrnResult";

export default {
  data() {
    return {
      drawer: null,
    };
  },
  mounted() {
    var noScrollTarget = document.querySelector("html");
    if (noScrollTarget.classList.contains("noScroll")) {
      noScrollTarget.classList.remove("noScroll");
    }
  },
  components: {
    commonHeader,
    PsnResult,
  },
};
</script>