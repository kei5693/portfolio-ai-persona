<template>
  <div id="wrap" class="mypMain">
    <!-- S: 앱 헤더 -->
    <commonHeaderTabType></commonHeaderTabType>
    <!-- E: 앱 헤더 -->

    <v-container v-if="storeUserInfo.myp.completionPersonaLv1">
      <!-- 사용자 정보 입력 -->
      <div class="psnUserInfo">
        <div class="left">
          <div class="info1">
            <span class="name">{{ profile.name }}</span>
          </div>
          <div class="info2">
            <span> {{ profile.sex }}<i>|</i> {{ profile.age }}</span>
          </div>
          <div class="info3">
            <span>{{ !!userInfo.job ? userInfo.job : "직업" }}</span>
            <i>|</i>
            <span class="salary"> 연 소득 {{ profile.income }} 만원 </span>
          </div>
        </div>
        <div class="right">
          <div class="info4">
            <dl class="married">
              <dd>
                <figure>
                  <img
                    src="https://via.placeholder.com/120x120/375989/?text=single"
                    alt=""
                  />
                </figure>
              </dd>
              <dt>{{ profile.married }}</dt>
            </dl>
            <dl class="hasChild" v-if="!!profile.children">
              <dd>
                <figure>
                  <img
                    src="https://via.placeholder.com/120x120/375989/?text=noKids"
                    alt=""
                  />
                </figure>
              </dd>
              <dt>{{ profile.children }}</dt>
            </dl>
          </div>

          <button type="button" @click="jobSelectView = true">
            직업 정보 입력하기
          </button>
        </div>
      </div>

      <!-- 페르소나 진단 결과 -->
      <div
        class="psnResultBox"
        v-if="userInfo.defaultPersonaInfo !== undefined"
      >
        <p class="psnResultTitle pd20">👉 나의 메인 페르소나는</p>
        <div class="personaMain pd20">
          <p class="personaName">{{ userInfo.defaultPersonaInfo.name }}</p>
          <p class="hashTags">
            <span>{{ userInfo.defaultPersonaInfo.meta.keyword }}</span>
          </p>
          <figure>
            <img
              :src="
                require(`@/assets/img/personaImg/defaultPersonaKey${userInfo.defaultPersonaKey}.png`)
              "
              :alt="userInfo.defaultPersonaInfo.name"
            />
          </figure>

          <finDiagnosis nowPage="Main" />
        </div>

        <div class="samePersona pd20">
          <a @click="clickMypDetail">
            <div class="left">
              <div class="samePersonaTitle">😄 나와 같은 페르소나는</div>
              <div class="samePersonaCount">
                <span>{{ dummyDuplicatePeronaUser | comma }}</span
                >명 이에요!
              </div>
            </div>
            <div class="right">
              내 페르소나<br />
              자세히 보기
            </div>
          </a>
        </div>
      </div>

      <TabMoveContent
        v-if="userInfo.defaultPersonaInfo !== undefined"
        :contentTotalCount="userInfo.contentTotalCount"
        :defaultPersona="userInfo.defaultPersonaInfo.name"
      />

      <div class="mypRecommendFC"
        @click="clickRecommendFC">
        <a>👆 나에게 맞는 설계사 추천 받기</a>
      </div>
    </v-container>

    <!-- 페르소나 진단하기 레이어 팝업 -->
    <div v-else class="layerBox light">
      <div class="layerContent">
        <p class="noPersona">진단된 페르소나가 없어요😥</p>
        <p class="noPersonaText">
          나의 페르소나를 분석하고<br />
          맞춤 콘텐츠를 추천받으세요!
        </p>
        <div class="btnBox">
          <a @click="gotoPersonaAnalysis">페르소나 진단하기</a>
          <button type="button" @click="clickExample">진단 결과 예시</button>
        </div>
      </div>
    </div>

    <!-- 페르소나 기본 진단 결과 예시 -->
    <PersonaAnalysisExample v-if="showExample" @closeExample="clickExample" />

    <!-- 페르소나 업데이트 도움말 팝업 -->
    <div class="layerBox dark help on" v-if="showPersonaAnalysisExample">
      <div class="layerContent">
        <button type="button" class="layerClose" @click="diagnosisAddExample">
          <img src="@/assets/img/layerCloseBtn.png" alt="" />
        </button>

        <div class="contextBox">
          <div class="contextTitle">❗ 페르소나 업데이트?</div>
          <div class="context">
            <dl>
              <dt>
                👉 라이프스타일 페르소나, 성향 페르소나 진단이 아직이세요?
              </dt>
              <dd>추가 진단하고 더욱 맞춤화된 콘텐츠를 추천받으세요.</dd>
            </dl>
            <dl>
              <dt>☝ 페르소나 레벨업을 완료하셨다면?</dt>
              <dd>
                페르소나는 언제든 변할 수 있답니다.<br />
                인생의 큰 이벤트가 있을 때 다시 페르소나 진단을 해보세요.<br />
                나의 페르소나가 달라질 수 있어요!
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>

    <JobSelector v-if="jobSelectView" @closeLayer="onClosePopupJob" />
  </div>
</template>

<script>
import commonHeaderTabType from "@/components/include/HeaderTabType";
import FinDiagnosis from "@/components/user/myPage/FinDiagnosis";
import PersonaAnalysisExample from "@/components/user/myPage/PersonaAnalysisExample";
import JobSelector from "@/components/include/JobSelect";
import TabMoveContent from "@/components/include/TabMoveContent";
import PersonaUtils from "@/utils/persona-utils";
import Constant from "@/constant/Constant.js";
import { mapGetters } from "vuex";

export default {
  components: {
    commonHeaderTabType,
    FinDiagnosis,
    JobSelector,
    TabMoveContent,
    PersonaAnalysisExample,
  },
  data () {
    return {
      drawer: null,
      layerOpen: localStorage.getItem("diagnosis"),
      jobSelectView: false,
      showExample: false,
      showPersonaAnalysisExample: false,
      lifeStylePersonaInfo: {
        meta: {
          keyword: "",
        },
      },
      discInfo: {},

      contentTotalCount: 0,
      userInfo: {},
      dummyDuplicatePeronaUser:
        Math.floor(Math.random() * (400000 - 300000 + 1)) + 300000,
    };
  },
  computed: {
    ...mapGetters({ storeUserInfo: "getUserInfo" }),

    userInfoGlobalSaveData () {
      return this._.reduce(
        this.userInfo.personaDetailLogList,
        (r, d) => {
          this._.set(r, JSON.parse(d.serveyMeta).globalSaveData, d.answerValue);
          return r;
        },
        {}
      );
    },
    profile () {
      return this.userInfoGlobalSaveData.profile
        ? this.userInfoGlobalSaveData.profile
        : {};
    },
  },
  watch: {
    userInfoGlobalSaveData (data) {
      this.$globalData.setDataObj(data);
    },
  },
  created () {
    this.onGetUserInfo();
  },
  mounted () {
    this.scrollTop();
    document.querySelector(".v-application").classList.remove("noScroll");
    
    if (!this.$store.state.isLogin) {
      document.querySelector(".v-application").classList.add("noScroll");
      return;
    }
  },
  methods: {
    /**
     * 사용자 정보 조회
     *
     * @method onGetUserInfo
     */
    async onGetUserInfo () {
      if (this.storeUserInfo.userKey === 0)
        return;

      const response = await this.$connect(
        `/user/persona/${this.storeUserInfo.userKey}`,
        "GET"
      );
      const responseInfo = response.body.info;
      const userInfo = responseInfo.user;
      this.$store.commit("setUserInfoMyP", userInfo);

      this.userInfo = userInfo;
      this.$set(
        this.userInfo,
        "contentTotalCount",
        responseInfo.contentTotalCount
      );

      if (this.userInfo.defaultPersonaInfo !== null) {
        this.userInfo.defaultPersonaInfo.meta = typeof this.userInfo.defaultPersonaInfo.meta === 'object'
          ? this.userInfo.defaultPersonaInfo.meta
          : JSON.parse(this.userInfo.defaultPersonaInfo.meta)
      }    

      if(this.userInfo.lifeStylePersonaInfo !== null){
        this.userInfo.lifeStylePersonaInfo.meta = typeof this.userInfo.lifeStylePersonaInfo.meta === 'object'
          ? this.userInfo.lifeStylePersonaInfo.meta
          : JSON.parse(this.userInfo.lifeStylePersonaInfo.meta)
      }

      if (!userInfo.completionPersonaLv1) {
        document.querySelector(".v-application").classList.add("noScroll");
      }
      else{
        document.querySelector(".v-application").classList.remove("noScroll");
      }
    },

    /**
     * 진단 결과 예시 ON/OFF
     */
    clickExample () {
      if (this.showExample) {
        document.querySelector("html").classList.remove("noScroll");
      } else {
        document.querySelector("html").classList.add("noScroll");
      }
      this.showExample = !this.showExample;
    },
    /**
     * MyP Detail 화면 이동
     */
    clickMypDetail () {
      this.$router.push({ path: '/user/mypDetail' })
    },
    /**
     * 설계사 추천 받기 버튼 클릭 시 동작하는 메소드
     */
    clickRecommendFC(){
      if(this.userInfo.completionPersonaLv2){
        this.$router.push({ path: '/user/matchingFC' })
      }
      else{
        this.$router.push({ path: '/user/recommendFC' })
      }
    },
    /**
     * 페르소나 업데이트 도움말
     */
    diagnosisAddExample () {
      if (this.showPersonaAnalysisExample) {
        document.querySelector("html").classList.remove("noScroll");
      } else {
        document.querySelector("html").classList.add("noScroll");
      }
      this.showPersonaAnalysisExample = !this.showPersonaAnalysisExample;
    },
    /**
     * 사용자에게 맞는 페이지로 이동
     * ex) 계정 생성 or 페르소나 진단
     */
    gotoPersonaAnalysis (path = '') {
      PersonaUtils.gotoPersonaAnalysis(this, this.userInfo, path, Constant.PERSONA_ANALYSIS_START_PAGE.MY_PAGE)
    },
    /**
     * 직업 정보 입력하기 버튼 클릭 시
     *
     * @param {String} jobName 직업
     */
    onClosePopupJob (jobName) {
      if (jobName !== null) {
        this.userInfo.job = jobName;
      }

      this.jobSelectView = false;
    },
    jobSelect () {
      document.querySelector("html").classList.add("noScroll");
      var target = document.querySelector(".jobSelectorWrap");
      target.classList.add("on");
    },
  },
};
</script>