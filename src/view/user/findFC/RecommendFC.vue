<template>
  <div id="wrap" class="recommendFC">
    <!-- S: 앱 헤더 -->
    <commonHeader
      title="맞춤 설계사 찾기"
      :router-path="'/user/feedMain'"
    ></commonHeader>
    <!-- E: 앱 헤더 -->

    <!-- S: 콘텐츠 -->
    <v-container>
      <div class="swiperBox">
        <swiper
          ref="fcSwiper"
          class="swiper"
          :slides-per-view="3"
          :space-between="50"
          :options="swiperOption"
          @swiper="onSwiper"
          @slideChange="onSlideChange"
        >
          <swiper-slide>
            <div class="top">
              <h1>나와 잘 맞는 설계사,<br />어디 없을까요?</h1>
            </div>
            <figure class="img">
              <img
                src="https://via.placeholder.com/372x372/bff0fd/?text=FC_IMG01"
                alt=""
              />
            </figure>
            <div class="text">
              Fit me의 맞춤 설계사 찾기 서비스는<br />
              나의 페르소나 타입과<br />
              추가 입력된 정보를 바탕으로<br />
              고객님과 잘 맞는 설계사를 추천합니다!
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="top">
              <h2>1. 정교한 추천을 위해 추가 진단하기</h2>
              <p>
                고객님과 잘 맞는 설계사 추천을 위해<br />
                성향/라이프스타일 페르소나 진단이 필요해요!<br />
                정교한 추천을 위해 꼭 진단을 진행해수세요.
              </p>
            </div>
            <figure class="img">
              <img
                src="https://via.placeholder.com/372x372/bff0fd/?text=FC_IMG02"
                alt=""
              />
            </figure>
            <div class="text">
              * 최소 성향 페르소나 진단까지 하신 고객님께는<br />
              바로 설계사 추천이 진행됩니다.
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="top">
              <h2>2. 진단 완료 후 설계사와 미팅 방법 결정</h2>
              <p>
                fit me는 채팅상담, 전화상담 이외에<br />
                화상으로 자료를 열람하고 상담 받을 수 있어요!
              </p>
            </div>
            <figure class="img">
              <img
                src="https://via.placeholder.com/372x372/bff0fd/?text=FC_IMG03"
                alt=""
              />
            </figure>
            <div class="text">
              처음 보는 설계사와 얼굴보고 이야기하기<br />
              불편하시다구요? 걱정마세요!<br />
              얼굴에 나의 아바타를 매핑해서<br />
              얼굴 노출 없이, 직접 만나서 이야기나누는 것처럼<br />
              편하게 상담이 가능하답니다 :)
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="top">
              <h2>3. 미팅 가능 일자와 시간 예약하기</h2>
              <p>
                캘린더에서 직접 원하는 날짜와 시간을<br />
                선택하여 미팅을 할 수 있어요.
              </p>
            </div>
            <figure class="img">
              <img
                src="https://via.placeholder.com/372x372/bff0fd/?text=FC_IMG04"
                alt=""
              />
            </figure>
            <div class="text">
              설계사마다 예약 현황에 따라<br />
              일정 선택에 제한이 있을 수 있다는 점,<br />
              참고 바라요 ❤
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="top">
              <h2>4. 예약된 일정에 맞춤 설계사와 미팅 진행하기</h2>
              <p>
                화상채팅을 선택하신 경우<br />
                예약한 일정에 fitme 앱에 접속하시고<br />
                개설된 룸에서 상담을 진행하세요.
              </p>
            </div>
            <figure class="img">
              <img
                src="https://via.placeholder.com/372x372/bff0fd/?text=FC_IMG05"
                alt=""
              />
            </figure>
            <div class="text">
              * 전화/채팅 상담은 설계사가 따로 연락 드려요!
            </div>
          </swiper-slide>

          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
      <div class="confirmBox on">
        <div v-if="storeUserInfo.completionPersonaLv2">
          <router-link to="/user/matchingFC">
            <p>시작하기</p>
          </router-link>
        </div>
        <div v-else>
          <a href="javascript:void(0)" @click="onClickGoToPersonaAnalysis">
            <p>시작하기</p>
          </a>
        </div>
      </div>
    </v-container>
    <!-- E: 콘텐츠 -->
  </div>
</template>

<script>
import commonHeader from "@/components/include/HeaderWithBack";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
import { mapGetters } from 'vuex'
import PersonaUtils from "@/utils/persona-utils";
import Constant from "@/constant/Constant.js";

export default {
  components: {
    commonHeader,
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
        loop: false,
      },
    };
  },
  computed: {
    ...mapGetters({ storeUserInfo: 'getUserInfo' }),

    swiper () {
      return this.$refs.fcSwiper.$swiper;
    },
  },
  methods: {
    onSwiper (swiper) {
      console.log(swiper);
    },
    onSlideChange () {
      console.log("changed");
    },

    /**
     * 퍼소나 진단 클릭
     * 
     * @method onClickGoToPersonaAnalysis
     */
    onClickGoToPersonaAnalysis () {
      PersonaUtils.gotoPersonaAnalysis(this, this.storeUserInfo, '', Constant.PERSONA_ANALYSIS_START_PAGE.FIND_FC)
    }
  },
};
</script>