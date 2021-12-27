<template>
  <div id="wrap" class="feedMain fc">
    <!-- S: 앱 헤더 -->
    <commonHeaderFcFeedPsn></commonHeaderFcFeedPsn>
    <!-- E: 앱 헤더 -->

    <!-- S: 콘텐츠 -->
    <v-container class="npd">
      <div class="feedAgentTab">
        <button type="button" @click="openedContents(1)">
          <span>페르소나</span>
        </button>
        <button type="button" @click="openedContents(2)">
          <span>신규콘텐츠</span>
        </button>
        <button type="button" @click="openedContents(3)">
          <span>니즈환기</span>
        </button>
      </div>

      <!-- Feed 리스트 페이지 -->
      <feedMainTabContent
        v-if="this.openedContent === 1"
        @onShowAlert="onShowAlert"
        @onShowContentView="onShowContentView"
      ></feedMainTabContent>
      <newContents
        v-if="this.openedContent === 2"
        @onShowContentView="onShowContentView"
      ></newContents>
      <needs
        v-if="this.openedContent === 3"
        @onShowContentView="onShowContentView"
      ></needs>
    </v-container>
    <!-- E: 콘텐츠 -->

    <div class="floatingBtnBox">
      <!-- <button type="button" class="topBtn" @click="scrollTop">Top</button> -->
      <button type="button" class="viewPsn offGray" @click="onClickPersonaView">
        페르소나 보기
      </button>
    </div>

    <fcCommonFooter crtPage="home"></fcCommonFooter>

    <popup-alert
      v-if="alert.isShow"
      :title="alert.title"
      :desc="alert.desc"
      @closeAlert="alert.callback"
    />

    <content-view
      ref="contentView"
      :content="contentInfo"
      v-if="isShowContentView"
      @onCloseContentView="onCloseContentView"
    ></content-view>
  </div>
</template>

<script>
import StorageUtils from "@/utils/storage-utils";
import commonHeaderFcFeedPsn from "@/components/include/FcAgentHeader";
import fcCommonFooter from "@/components/include/FcCommonFooter";
import feedMainTabContent from "@/components/fc/feed/FeedMainTab";
import newContents from "@/components/fc/feed/NewContents";
import needs from "@/components/fc/feed/Needs";
import PopupAlert from "@/components/include/PopupAlert";
import ContentView from "@/components/include/content/ContentView";

export default {
  components: {
    commonHeaderFcFeedPsn,
    fcCommonFooter,
    feedMainTabContent,
    newContents,
    needs,
    PopupAlert,
    ContentView,
  },
  data() {
    return {
      drawer: null,
      openedContent: 1,
      contentInfo: {},
      isShowContentView: false,
      alert: {
        title: "",
        desc: "",
        isShow: false,
        callback: () => {
          this.alert.isShow = false;
        },
      },
    };
  },
  mounted() {
    var openedCntNum = this.openedContent;
    document
      .querySelector(".feedAgentTab > button:nth-child(" + openedCntNum + ")")
      .classList.add("on");
    this.onGetTemplate();
  },
  methods: {
    openedContents(cntNum) {
      var targetCRT = event.currentTarget,
        buttons = document.querySelectorAll(".feedAgentTab > button");

      buttons.forEach(function (e) {
        e.classList.remove("on");
      });

      targetCRT.classList.add("on");
      this.openedContent = cntNum;
    },

    /**
     * 얼럿 띄우기
     *
     * @method onShowAlert
     * @param {Object} payload title 제목, desc 설명
     */
    onShowAlert(payload) {
      this.alert.isShow = true;
      this.alert.title = payload.title;
      this.alert.desc = payload.desc;
    },

    /**
     * 템플릿 목록 가져오기
     *
     * @method onGetTemplate
     */
    async onGetTemplate() {
      const response = await this.$connect("/templates", "GET");

      StorageUtils.saveTemplate(response.body.list);
    },

    /**
     * 콘텐츠 뷰 팝업
     *
     * @method onToggleContentView
     * @param {Object} payload 콘텐츠 정보
     */
    onShowContentView(payload) {
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
    onCloseContentView() {
      document.querySelector("html").classList.remove("noScroll");

      this.$nextTick(() => {
        this.isShowContentView = false;
      });
    },

    /**
     * 페르소나 보기 클릭
     *
     * @method onClickPersonaView
     */
    onClickPersonaView() {
      this.$router.push({ path: "/fc/myPage" });
    },
  },
};
</script>