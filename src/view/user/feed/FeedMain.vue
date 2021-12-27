<template>
  <div id="wrap" class="feedMain">
    <!-- S: 앱 헤더 -->
    <commonHeaderTabType></commonHeaderTabType>
    <!-- E: 앱 헤더 -->

    <v-container class="npd">
      <div
        v-if="personaInfo.info !== undefined && this.$store.state.isLogin"
        class="upsideAD">
        <!-- 페르소나 검사 X -->
        <div
          v-if="personaInfo.info.lifeStylePersonaName === undefined"
          @click="movePage"
        >
          <router-link to="">
            <img
              :src="require(`@/assets/img/personaImg/defaultPersonaKey${personaInfo.info.defaultPersonaKey}.png`)"
              :alt="personaInfo.defaultPersonaName"
            />
            
            <div class="psnSummary">
              <div class="type">
                <span class="typeName">{{
                  personaInfo.info.defaultPersonaName
                }}</span>
                <span class="counter"
                  ><b>{{ personaInfo.counter | comma }}</b> 명</span
                >
              </div>
              <div class="pps">페르소나 추가하고, 맞춤 콘텐츠 보기</div>
            </div>
          </router-link>
        </div>

        <!-- 페르소나 검사 O -->
        <div v-else>
          <img
            :src="require(`@/assets/img/personaImg/lifeStylePersonaKey${personaInfo.info.lifeStylePersonaKey}.png`)"
            :alt="personaInfo.info.lifeStylePersonaName"
          />
          
          <div class="psnSummary">
            <div class="type">
              <span class="typeName">{{
                personaInfo.info.defaultPersonaName
              }}</span>
              <span class="counter"
                ><b>{{ personaInfo.counter | comma }}</b> 명</span
              >
            </div>
            <div class="pps">{{ personaInfo.info.lifeStylePersonaName }}</div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="upsideNotLogin"
        @click="movePage">
          <img
            :src="require(`@/assets/img/upSideBanner.png`)"
            :alt="personaInfo.defaultPersonaName"
          />
      </div>

      <RecommendContents :personaInfo="personaInfo.info" />

      <div class="feedListBox pd12">
        <FeedContentTagList
          :selectedTagName="selectedTagName"
          :contentTotalCount="paging.totalCount"
          @onClickTag="onClickTag"
        />
        <SortUtil :sortType="sortType" @reloadContent="reloadContent" />

        <div class="feedList" v-show="isShowContents">
          <feedItem
            v-for="(content, contentIdx) in loadContentList"
            :key="`user-content-` + contentIdx"
            :content="content"
            :isAdContent="content.frequency > 0"
            @onShowContentView="onShowContentView"
            @onShowAdContentView="onShowAdContentView"
          />

          <infinite-loading
            @infinite="onInfiniteHandler"
            ref="infiniteLoading"
            :identifier="infiniteId"
          >
            <div slot="no-more"></div>
            <div slot="no-results"></div>
          </infinite-loading>
        </div>
      </div>
    </v-container>

    <!-- S: 레이어 -->
    <div
      class="layerBox dark"
      v-if="!storeUserInfo.completionPersonaLv1 && layerOpen === null"
    >
      <div class="layerContent">
        <figure>
          <img
            src="https://via.placeholder.com/800x640/375989/?text=sampleImg"
            alt=""
          />
        </figure>

        <div class="btnBox">
          <a @click="movePage">페르소나 진단하기</a>
          <button type="button" class="skipBtn" @click="layerClose">
            Skip
          </button>
        </div>
      </div>
    </div>
    <!-- E: 레이어 -->

    <div class="floatingBtnBox">
      <button type="button" class="topBtn" @click="scrollTop">Top</button>
      <div
        class="rsvBox"
        :class="{ on: isFloatingBox && meetingInfo.count >= 0 }"
      >
        <!-- 펼침 전 -->
        <div class="iconBox" @click="clickFloating">
          <i class="mdi mdi-calendar-month-outline"></i>
          <div class="counter" v-if="meetingInfo.count > 0">
            {{ meetingInfo.count }}
          </div>
        </div>
        <!-- 펼침 후 -->
        <div class="overView">
          <div class="iconBox">
            <i class="mdi mdi-calendar-month-outline"></i>
          </div>
          <router-link to="/user/scheduleInquiry">
            <dl>
              <dt>대기중인 예약이 {{ meetingInfo.count }}건 있습니다.</dt>
              <dd v-if="!!meetingInfo.consultationMeeting">
                가까운 예약 :
                {{ meetingInfo.consultationMeeting.dateCode }}&nbsp;&nbsp;{{
                  meetingInfo.consultationMeeting.timeRange
                }}
              </dd>
            </dl>
          </router-link>
          <button type="button" @click="clickFloating">X</button>
        </div>
      </div>
    </div>

    <content-view
      ref="contentView"
      :content="contentInfo"
      v-if="isShowContentView"
      @onCloseContentView="onCloseContentView"
    />

    <ad-content-view
      ref="adContentView"
      :content="contentInfo"
      v-if="isAdShowContentView"
      @onCloseContentView="onCloseContentView"
    />
  </div>
</template>

<script>
import StorageUtils from "@/utils/storage-utils";
import InfiniteLoading from "vue-infinite-loading";
import { mapGetters } from "vuex";

import commonHeaderTabType from "@/components/include/HeaderTabType";
import FeedItem from "@/components/user/feed/FeedItem";
import SortUtil from "@/components/user/feed/SortUtil";
import FeedContentTagList from "@/components/user/feed/FeedContentTagList";
import RecommendContents from "@/components/user/feed/RecommentContent";
import ContentView from "@/components/include/content/ContentView";
import AdContentView from "@/components/include/content/AdContentView";
import PersonaUtils from "@/utils/persona-utils";
import Constant from "@/constant/Constant.js";

export default {
  components: {
    commonHeaderTabType,
    RecommendContents,
    FeedContentTagList,
    SortUtil,
    FeedItem,
    InfiniteLoading,
    ContentView,
    AdContentView,
  },
  data () {
    return {
      layerOpen: localStorage.getItem("diagnosis"),
      sortType: "date_write", // 콘텐츠 정렬 타입
      paging: {},
      selectedTagName: "",
      personaInfo: {},
      contentInfo: {},
      meetingInfo: {
        count: 0,
      },
      infiniteId: +new Date(),
      isFloatingBox: false,
      isShowContents: false,
      isShowContentView: false,
      isAdShowContentView: false,
      contentList: [],
      adContentList: [],
      loadContentList: [],
    };
  },
  created () {
    this.onCloseContentView();
    this.initPaging();

    this.getPersonaName();
    this.onGetTemplate();

    if (this.$route.params.tagInfo !== undefined) {
      this.selectedTagName = this.$route.params.tagInfo.name;
      this.$set(this.paging, "tagKey", this.$route.params.tagInfo.key);
    }
  },
  computed: {
    ...mapGetters({
      commPaging: "getCommonPaging",
      storeUserInfo: "getUserInfo",
    }),
  },
  mounted () {
    this.scrollTop();
    
    var diagnosis = JSON.parse(localStorage.getItem("diagnosis")),
      nowM = new Date().getUTCMonth(),
      nowD = new Date().getUTCDate();

    if (this.storeUserInfo.completionPersonaLv1 === false) {
      if (this.layerOpen === null) {
        document.querySelector(".v-application").classList.add("noScroll");
      }
    }

    if (diagnosis && diagnosis.expireM < nowM) {
      localStorage.removeItem("diagnosis");
    }

    if (diagnosis && diagnosis.expireM == nowM) {
      if (diagnosis.expireD < nowD) {
        localStorage.removeItem("diagnosis");
      }
    }

    this.onGetContent(
      false,
      this.paging.tagKey,
      this.paging.personaKey,
      (data) => {
        console.log(">>>>> get content", data);
      }
    );

    this.getMeetingPopup();
  },
  methods: {
    /**
     * 사용자에게 맞는 페이지로 이동
     * ex) 계정 생성 or 페르소나 진단 or 페르소나 추가 진단
     */
    movePage () {
      // 계정없이 둘러보기 화면일 경우
      if (!this.$store.state.isLogin) {
        this.$router.push({ path: "/user/account" });
      }
      else {
        PersonaUtils.gotoPersonaAnalysis(this, this.storeUserInfo, '', Constant.PERSONA_ANALYSIS_START_PAGE.MY_PAGE)
      }
    },
    /**
     * 정렬 타입에 따라 콘텐츠 재로드
     */
    reloadContent (value) {
      this.sortType = value;
    },
    scrollTop () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    clickFloating () {
      this.isFloatingBox = !this.isFloatingBox;
    },
    layerClose () {
      var dateObj = new Date();
      var value = {
        value: "true",
        expireM: dateObj.getUTCMonth(),
        expireD: dateObj.getUTCDate(),
      };
      this.layerOpen = JSON.stringify(value);
      localStorage.setItem("diagnosis", JSON.stringify(value));
      document.querySelector("html").classList.remove("noScroll");
    },

    /**
     * 일반/AD 콘텐츠 합치기
     */
    loadContent () {
      if (this.paging.page > this.paging.totalPage) {
        return;
      }

      var adGroupBy = this._.groupBy(this.adContentList, "frequency");
      var adKeyList = Object.keys(adGroupBy);

      var currentIdx =
        Math.floor(this.contentList.length % this.paging.limit) > 0
          ? Math.floor(this.contentList.length / this.paging.limit)
          : Math.floor(this.contentList.length / this.paging.limit) - 1;

      var startIdx = Number(`${Math.max(currentIdx, 0)}0`);

      for (var index = startIdx; index < this.contentList.length; index++) {
        this.loadContentList.push(this.contentList[index]);

        var adKey = adKeyList.filter((o) => (index + 1) % o == 0);
        var adContent = this._.cloneDeep(adGroupBy[adKey]);

        if (adContent !== undefined && adContent.length > 0) {
          var randomItem = adContent.splice(
            Math.floor(Math.random() * adContent.length),
            1
          )[0];

          this.loadContentList.push(randomItem);
        }
      }
    },
    /**
     * 태그 클릭
     *
     * @method onClickTag
     * @param {Object} payload 태그 정보
     */
    onClickTag (payload) {
      this.isShowContents = false;

      this.$set(this.paging, "page", 1);
      this.$set(this, "loadContentList", []);

      this.onGetContent(false, payload.key, this.paging.personaKey, (data) => {
        console.log(data);
        if (this.loadContentList.length !== 0) {
          this.infiniteId += 1;
        }
      });
    },

    /**
     * 페이징 초기화
     *
     * @method initPaging
     */
    initPaging () {
      this.paging = JSON.parse(JSON.stringify(this.commPaging));
      this.$set(this.paging, "tagKey", -1);
      this.$set(this.paging, "personaKey", this.storeUserInfo.personaKey);
    },
    /**
     * 콘텐츠 가져오기
     *
     * @method onGetContent
     * @param {Boolean} isNextPage 다음 페이지 이동 유무(true 다음페이지, false 첫 페이지 부터)
     * @param {Number} tagKey 태그 키
     * @param {Nubmer} personaKey 퍼소나 키
     * @param {Object} completeCallBack 완료 콜백
     */
    async onGetContent (
      isNextPage,
      tagKey = -1,
      personaKey = -1,
      completeCallBack
    ) {
      // 데이터 셋팅
      this.paging.tagKey = tagKey;
      this.paging.personaKey = personaKey;

      if (tagKey === -1 || tagKey === null) {
        delete this.paging.tagKey;
      }

      if (this.$refs.infiniteLoading.status === 2) {
        this.$refs.infiniteLoading.$emit("$InfiniteLoading:reset");
      }

      // 페이지 증가
      if (isNextPage) this.paging.page += 1;

      this.paging.extendType = "normal";
      const normalResponse = await this.$connect(
        "/content",
        "GET",
        {},
        this.paging
      );

      this.paging.extendType = "ad";
      const adResponse = await this.$connect(
        "/content",
        "GET",
        {},
        this.paging
      );

      if (isNextPage) {
        normalResponse.body.list.forEach((o) => this.contentList.push(o));
        adResponse.body.list.forEach((o) => this.adContentList.push(o));
      } else {
        this.$set(this, "contentList", normalResponse.body.list);
        this.$set(this, "adContentList", adResponse.body.list);
      }

      this.paging.totalCount = normalResponse.body.totalCount;
      this.paging.totalPage = normalResponse.body.totalPage;

      this.isShowContents = true;

      this.loadContent();
      completeCallBack(normalResponse.body.list);
    },

    /**
     * 무한 스크롤 핸들러
     *
     * @method onInfiniteHandler
     * @param {Object} event 무한 스크롤 이벤트
     */
    onInfiniteHandler (event) {
      this.onGetContent(
        true,
        this.paging.tagKey,
        this.paging.personaKey,
        (data) => {
          if (data.length === 0) {
            event.complete();
          } else {
            event.loaded();
          }
        }
      );
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
    onShowAdContentView (payload) {
      this.isAdShowContentView = true;
      this.$set(this, "contentInfo", payload);

      this.$nextTick(() => {
        this.$refs.adContentView.$el.classList.add("on");
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
        this.isAdShowContentView = false;
      });
    },
    /**
     * 퍼소나 키로 퍼소나 정보 조회
     */
    getPersonaName () {
      this.$connect(`/persona/${this.storeUserInfo.personaKey}`, "GET").then(
        (res) => {
          this.$set(this, "personaInfo", {
            info: res.body.info,
            counter: Math.floor(Math.random() * (400000 - 300000 + 1)) + 300000,
          });
        }
      );
    },
    /**
     * 대기중인 예약 팝업 API 호출
     */
    getMeetingPopup () {
      this.$connect("/consultation/meeting/pop-up", "GET").then((res) => {
        this.meetingInfo = res.body.info;
      });
    },
    /**
     * 사용자 정보 조회
     *
     * @method onGetUserInfo
     */
    onGetUserInfo () {
      this.$connect("/user", "GET").then((res) => {
        const user = res.body.info.user;
        if (user !== null) {
          this.$store.commit("setUserInfo", user);
        }
      });
    },
  },
};
</script>