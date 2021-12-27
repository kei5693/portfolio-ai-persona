<template>
  <div id="wrap" class="onboard">
    <!-- S: 앱 헤더 -->
    <v-app-bar app>
      <v-toolbar-title></v-toolbar-title>
    </v-app-bar>

    <!-- E: 앱 헤더 -->

    <!-- S: 콘텐츠 -->
    <v-container>
      <swiper
        class="swiper"
        :slides-per-view="3"
        :space-between="50"
        :options="swiperOption"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
      >
        <swiper-slide
          v-for="(info, infoIdx) in swiperInfo"
          :key="`swiper-info-` + infoIdx"
        >
          <h1>{{ info.title }}</h1>
          <p v-html="info.content" />
        </swiper-slide>

        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>

      <ul class="accountBtnBox">
        <li>
          <h2>기존 회원이라면</h2>
          <div class="btnBox">
            <button type="button" @click="$router.push('/user/login')">
              로그인하기
            </button>
          </div>
        </li>
        <li>
          <h2>처음이세요?</h2>
          <div class="btnBox">
            <button type="button" @click="$router.push('/user/account')">
              새로운 계정 만들기
            </button>
            <button type="button" class="clearWhite" @click="noAccountView">
              계정없이 둘러보기
            </button>
          </div>
        </li>
      </ul>
    </v-container>
    <!-- E: 콘텐츠 -->
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import StorageUtils from '@/utils/storage-utils'
import PersonaMixin from '@/mixin/persona-mixin'

export default {
  mixins: [PersonaMixin],
  components: {
    Swiper,
    SwiperSlide,
  },
  data () {
    return {
      swiperInfo: [
        {
          title: "나의 페르소나는 뭘까?",
          content: "간단한 정보를 입력하고<br>나의 페르소나를 진단해보세요.",
        },
        {
          title: "페르소나 맞춤 콘텐츠",
          content:
            "진단된 페르소나 정보를 바탕으로<br>다양한 분야의 맞춤 콘텐츠가 제공됩니다.",
        },
        {
          title: "다양한 맞춤 추천 서비스",
          content:
            "콘텐츠 추천에서 끝나지 않고,<br>보험 상품과 보험 설게사 추천까지",
        },
      ],
      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        autoHeight: true,
        loop: true,
      },
    };
  },
  created () {
    StorageUtils.clear()
  },
  methods: {
    onSwiper (swiper) {
      console.log(swiper);
    },
    onSlideChange () {
      console.log("slide change");
    },
    /**
     * 계정없이 둘러보기
     */
    noAccountView () {
      this.$store.commit("setNoLogin");

      this.onSetRandomPersona('/user/feedMain', () => {
        this.onGetTempToken()
      })
    },

    /**
     * 임시 토큰 발급
     * 
     * @method onGetTempToken
     */
    async onGetTempToken () {
      const response = await this.$connect('/login/temp-token')

      StorageUtils.saveToken(response.body.info.tempToken);
      this.$router.push({ path: "/user/feedMain" });
    }
  },
};
</script>
