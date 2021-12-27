<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style lang="scss">
@import "./src/assets/scss/app";
</style>

<script>
import shareEvent from "./shareEvent";
export default {
  name: "App",
  data: () => ({}),
  created() {
    window.getApp = this;

    // 공유용 이벤트 로드
    shareEvent.forEach((item) => {
      this.$on(item.name, item.callback);
    });

    // 맨 마지막 글자에 받침이 있는지 찾아서 있다면 true, 없다면 false 를 반환
    const isEndWithConsonant = (korStr) => {
      const finalChrCode = korStr.charCodeAt(korStr.length - 1);
      // 0 = 받침 없음, 그 외 = 받침 있음
      const finalConsonantCode = (finalChrCode - 44032) % 28;
      return finalConsonantCode !== 0;
    };
    // 을/를 덧붙히기
    String.prototype.appendEulReul = function () {
      return this + (isEndWithConsonant(this) ? "을" : "를");
    };
  },
  mounted() {
    document.querySelector("#vuetify-theme-stylesheet").remove();
  },
};
</script>
