<template>
  <div class="feedContentView layer" ref="contentBoxInner">
    <div class="header" v-if="!shareMode">
      <div class="routerBox">
        <a @click="onClickClose" class="goBack">뒤로가기</a>
      </div>
      <div class="socialBox">
        <span class="snsLike">좋아요</span>
        <span class="snsShare" @click="toggleSharePopup()">공유하기</span>
        <span class="snsBookmark">즐겨찾기</span>
      </div>
    </div>
    <div class="feedViewBox pdb80">
      <div class="feedView">
        <div class="titleBox">
          <h2>{{ content.title }}</h2>
          <p>{{ content.desc }}</p>

          <div class="statusCount">
            <div class="sns">
              <!-- <span>좋아요 59</span>
              <span>조회 259</span>
              <span>공유 43</span> -->
              <!-- ·  -->
            </div>
            <div class="date">{{ content.dateWrite | contentDate }}</div>
          </div>
        </div>

        <div class="editor">
          <iframe
            :src="contentUrl"
            frameborder="0"
            v-if="content.type !== 'html'"
            ref="contentViewer"
            :height="contentViewerHeight > 0 ? contentViewerHeight : 'auto'"
          ></iframe>
          <div v-else v-html="content.html"></div>
        </div>

        <div class="tagList">
          <template v-for="(item, index) in tags">
            <a href="javascript:void(0)" :key="`tag-${index}`">#{{ item }}</a>
          </template>
        </div>
      </div>
      <div class="feedContents borderInterval"></div>

      <!-- S: 레이어 -->
      <div class="layerBox dark simpleType" v-if="sharePopup">
        <div class="layerContent sharePopup">
          <ul>
            <li @click="onClickKakao()">
              <span></span>
              <strong>카카오톡</strong>
            </li>
            <li @click="onClickUrlCopy()">
              <span></span>
              <strong>URL</strong>
            </li>
          </ul>

          <button type="button" class="layerClose" @click="toggleSharePopup()">
            <img src="@/assets/img/layerCloseBtn.png" alt="" />
          </button>
        </div>
      </div>
      <!-- E: 레이어 -->
    </div>
  </div>
</template>

<script>
import StorageUtils from "@/utils/storage-utils";

export default {
  props: {
    content: {
      type: Object,
      required: true,
      default: new Object(),
    },
    shareMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      sharePopup: false,
      contentViewerHeight: 0,
    };
  },
  computed: {
    tags() {
      return this.content.tag.split(",");
    },
    contentUrl() {
      const template = StorageUtils.getTemplate(this.content.templatesKey);

      return template === undefined
        ? ""
        : `${template.url}?content-key=${
            this.content.key
          }&token=${StorageUtils.getToken()}`;
    },
    clientUrlPath() {
      return this.$store.state.clientUrlPath;
    },
    shareContentUrl() {
      return this.clientUrlPath.length > 0
        ? `${location.origin}/${this.clientUrlPath}/shareContentViewer/${this.content.key}`
        : `${location.origin}/shareContentViewer/${this.content.key}`;
    },
  },
  created() {
    window.addEventListener("message", this.receivePostMsg);
  },
  beforeDestroy() {
    window.removeEventListener("message", this.receivePostMsg, false);
  },
  mounted() {},
  methods: {
    /**
     * 공유 팝업 토글
     *
     * @method toggleSharePopup
     */
    toggleSharePopup() {
      this.sharePopup = !this.sharePopup;
      if (this.sharePopup === false) {
        document.querySelector("html").classList.add("noScroll");
      } else {
        document.querySelector("html").classList.remove("noScroll");
      }
    },

    /**
     * 콘텐츠 닫기
     *
     * @method onClickClose
     */
    onClickClose() {
      this.$emit("onCloseContentView");
      console.log(this.$refs.contentBoxInner);
    },

    receivePostMsg(event) {
      if (event.data && event.data.height) {
        this.contentViewerHeight = event.data.height;
      }
    },
    onClickKakao() {
      window.getApp.$emit("SHARE_EVENT_SEND_KAKAO", {
        title: this.content.title,
        desc: this.content.desc,
        url: this.shareContentUrl.replace(`${location.origin}/`, ""),
        callback: () => {
          this.sharePopup = false;
        },
      });
    },
    onClickUrlCopy() {
      window.getApp.$emit("SHARE_EVENT_COPY_URL", {
        url: this.shareContentUrl,
        callback: () => {
          this.sharePopup = false;
          alert("주소가 복사 되었습니다. ❤");
        },
      });
    },
  },
};
</script>
