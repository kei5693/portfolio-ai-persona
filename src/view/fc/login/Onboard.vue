<template>
  <div id="wrap" class="onboard fc">
    <!-- S: 앱 헤더 -->
    <v-app-bar app> </v-app-bar>

    <!-- E: 앱 헤더 -->

    <!-- S: 콘텐츠 -->
    <v-container>
      <swiper
        ref="mySwiper"
        class="swiper"
        :slides-per-view="3"
        :space-between="50"
        :options="swiperOption"
        @swiper="onSwiper"
        @slideChange="onSlideChange"
      >
        <swiper-slide>
          <h1>Z시장의 발견!</h1>
          <p>
            지인의 지인의 지인까지<br />
            다 만나보신 설계사님들에게<br />
            새로운 인맥을 찾기 위한<br />
            또 다른 기회를 제공합니다.
          </p>
        </swiper-slide>
        <swiper-slide>
          <h1>고객님 관심사 파악!</h1>
          <p>
            fit me에는 다양한 고객 유형이 있어요.<br />
            유형 별 콘텐츠를 보시면서 상담 전<br />
            니즈 파악도 하고, 매끄러운 상담을 위한<br />
            보조 자료들도 충분히 준비할 수 있어요.
          </p>
        </swiper-slide>
        <swiper-slide>
          <h1>다양한 맞춤 추천 서비스</h1>
          <p>
            콘텐츠 추천에서 끝나지 않고,<br />보험 상품과 보험 설게사 추천까지
          </p>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>

      <ul class="accountBtnBox">
        <li>
          <h2>기존 회원이라면</h2>
          <div class="btnBox">
            <router-link to="/fc/login">로그인하기</router-link>
          </div>
        </li>
        <li>
          <h2>처음이세요?</h2>
          <div class="btnBox">
            <router-link to="/fc/account">새로운 계정 만들기</router-link>
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

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  data () {
    return {
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
  computed: {
    swiper () {
      return this.$refs.mySwiper.$swiper;
    },
  },
  methods: {
    onSwiper (swiper) {
      console.log(swiper);
    },
    onSlideChange () {
    },
  },
};
</script>