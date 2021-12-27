<template>
  <div id="wrap" class="mypDetail">
    <!-- S: 앱 헤더 -->
    <commonHeader
      :title="isFindFC ? '페르소나 결과' : 'my Persona'"
      router-path="/user/myPage"
    ></commonHeader>
    <!-- E: 앱 헤더 -->

    <!-- S: 콘텐츠 -->
    <v-container v-if="storeUserInfo.myp !== undefined">
      <PsnResult 
        type="detail"
        :isFindFC="isFindFC" />

      <div class="samePersonaPeoples" v-if="!isFindFC">
        <div class="secTitle">
          👀 나와 같은 페르소나에 대해 궁금하지않으세요?
        </div>

        <div class="secBody">
          <div class="header">
            <button
              class="exclamation insertJob"
              v-if="storeUserInfo.myp.job === ''"
              @click="clickJobSelect"
            >
              직업정보를 입력해주세요
            </button>
            <div v-else class="curious job">
              <span class="curiousTitle occupation">직종</span>
              <span>{{ storeUserInfo.myp.job }}</span>
            </div>

            <div class="curious salary">
              <span class="curiousTitle salary">연 소득</span>
              <span>{{ userInfoGlobalSaveData.profile.income }} 만원</span>
            </div>

            <i class="notice"
              >※ 콘텐츠 추천 데이터로만 활용되며, 외부에 공개되지 않습니다.</i
            >
          </div>

          <div class="contents">
            <div class="cntTitle">
              나와 같은 페르소나의<br />
              <b>평균 연령 및 소득구간</b>
            </div>
            <div class="cntAverage">
              <ul>
                <li><span>평균 연령</span> <span>32 세</span></li>
                <li><span>평균 소득</span> <span>3,570 만원</span></li>
              </ul>
            </div>
            <div class="cntChart">
              <img src="@/assets/img/chartImg.png" alt="" />
            </div>
          </div>
        </div>
      </div>

      <div class="weTalks" v-if="!isFindFC">
        <div class="secTitle">🔎 우리의 이야기들</div>
        <div class="secHeader">
          <FeedContentTagList type="mypDetail" @onClickTag="onClickTag" />
        </div>
        <div class="secBody">
          <ul class="talkContents">
            <li
              v-for="(content, contentIdx) in contentList"
              :key="`recommend-two-content-` + contentIdx"
              @click="onShowContentView(content)"
            >
              <a>
                <figure>
                  <img :src="content.thumbnailUrl" alt="" />
                  <p>{{ content.title }}</p>
                </figure>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </v-container>
    <!-- E: 콘텐츠 -->

    <div class="confirmBox on"
      v-if="isFindFC">
      <router-link to="/user/matchingFC">
        <p>설계사 추천받기</p>
      </router-link>
    </div>

    <content-view
      ref="contentView"
      :content="contentInfo"
      v-if="isShowContentView"
      @onCloseContentView="onCloseContentView"
    />

    <JobSelector v-if="jobSelectView" @closeLayer="clickJobSelect" />
  </div>
</template>

<script>
import commonHeader from "@/components/include/HeaderWithBack";
import PsnResult from "@/components/user/myPage/PrnResult";
import FeedContentTagList from "@/components/user/feed/FeedContentTagList";
import JobSelector from "@/components/include/JobSelect";
import ContentView from "@/components/include/content/ContentView";

import StorageUtils from "@/utils/storage-utils";
import { mapGetters } from "vuex";

export default {
  data () {
    return {
      drawer: null,
      contentInfo: {},
      contentList: [],
      jobSelectView: false,
      isShowContentView: false,
    };
  },
  props:{
    isFindFC:{
      type: Boolean,
      default: false
    }
  },
  components: {
    commonHeader,
    FeedContentTagList,
    JobSelector,
    PsnResult,
    ContentView,
  },
  computed: {
    ...mapGetters({ storeUserInfo: "getUserInfo" }),

    userInfoGlobalSaveData () {
      return this._.reduce(
        this.storeUserInfo.myp.personaDetailLogList,
        (r, d) => {
          this._.set(r, JSON.parse(d.serveyMeta).globalSaveData, d.answerValue);
          return r;
        },
        {}
      );
    },
  },
  created () {
    this.onCloseContentView();
    this.onGetTemplate();
  },
  mounted () {
    window.scrollTo({ top: 0 });

    const searchPersonaKey = this.storeUserInfo.myp.completionPersonaLv2
      ? this.storeUserInfo.myp.lifeStylePersonaKey
      : this.storeUserInfo.myp.defaultPersonaKey;

    this.$connect(
      "/content",
      "GET",
      {},
      {
        personaKey: searchPersonaKey > 0 ? searchPersonaKey : 0,
        sort: "date_write",
        extendType: "normal",
        page: 1,
        limit: 2,
        direction: "DESC",
      }
    ).then((res) => {
      this.contentList = res.body.list;
    });
  },
  methods: {
    clickJobSelect () {
      this.jobSelectView = !this.jobSelectView;
    },
    /**
     * my P 상세보기 > 우리의 이야기들에서 태그 클릭 시
     * @param {Object} payload 선택한 태그 정보
     */
    onClickTag (payload) {
      this.$router.push({ name: "UserFeedMain", params: { tagInfo: payload } });
    },
    /**
     * 콘텐츠 뷰 팝업
     *
     * @method onToggleContentView
     * @param {Object} payload 콘텐츠 정보
     */
    onShowContentView (payload) {
      this.isShowContentView = true;
      this.$set(this, "contentInfo", payload);

      this.$nextTick(() => {
        this.$refs.contentView.$el.classList.add("on");
        document.querySelector("html").classList.add("noScroll");
      });
    },
    /**
     * 콘텐츠 뷰 팝업 닫기
     *
     * @method onCloseContentView
     */
    onCloseContentView () {
      document.querySelector("html").classList.remove("noScroll");

      this.$nextTick(() => {
        this.isShowContentView = false;
      });
    },
    /**
     * 템플릿 목록 가져오기
     *
     * @method onGetTemplate
     */
    async onGetTemplate () {
      const response = await this.$connect("/templates", "GET");

      StorageUtils.saveTemplate(response.body.list);
    },
  },
};
</script>