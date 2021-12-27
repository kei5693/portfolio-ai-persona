<template>
  <div class="commonHeader">
    <v-app-bar app>
      <div class="routerBox">
        <a @click="onClickGoBack" class="goBack">뒤로가기</a>
        <button type="button" class="goBack layer" @click="onClickGoBack">
          예약 뒤로가기
        </button>
        <a @click="onClickHome" class="goHome">홈으로가기</a>
      </div>
      <v-toolbar-title class="textBlue">{{ title }}</v-toolbar-title>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon
      ><!-- 햄버거 메뉴 컨트롤러 -->
    </v-app-bar>

    <!-- S: LnB 메뉴 -->
    <v-navigation-drawer v-model="drawer" fixed temporary>
    </v-navigation-drawer>
    <!-- E: LnB 메뉴 -->
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    routerPath: {
      default: '',
      type: String,
      required: false,
    }
  },
  data () {
    return {
      drawer: null,
    };
  },
  methods: {
    /**
     * 홈으로 이동
     * 
     * @method
     */
    onClickHome () {
      let homeRouterPath = this.$route.path.startsWith('/fc') ? '/fc/feedMain' : '/user/feedMain'

      this.$router.push({ path: homeRouterPath })
    },

    /**
     * 뒤로가기 클릭
     * 
     * @method onClickGoBack
     */
    onClickGoBack () {
      if (this.title === '상담 예약' || this.title === '예약 취소' || this.title === '상담 가능 일정 관리') {
        this.$emit('clickGoBack')
      } else if (this.routerPath.length !== 0) {
        this.$router.push({ path: this.routerPath })
      } else {
        this.$router.go(-1)
      }
    }
  },
};
</script>