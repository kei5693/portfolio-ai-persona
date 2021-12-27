<template>
  <div class="feedContentView layer" ref="contentBoxInner">
    <div class="header">
      <div class="routerBox">
        <a @click="onClickClose" class="goBack">뒤로가기</a>
      </div>
      <div class="socialBox">
        <!-- <span class="snsLike">좋아요</span>  -->
        <span class="snsShare" @click="toggleSharePopup()">공유하기</span>
        <span class="snsBookmark">즐겨찾기</span>
      </div>
    </div>
    <div class="feedViewBox pdb80">
      <div class="feedView">
        <div class="titleBox">
          <h2>{{ content.title }}</h2>
          <!-- <p>{{ content.desc }}</p> -->
        </div>

        <div class="editor">
          <iframe
            :src="contentUrl"
            frameborder="0"
            v-if="content.type !== 'html'"
          ></iframe>
          <div v-html="content.html"></div>
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

      <div class="confirmBox on" @click="onClickMatchingFC">
        <button type="button"><p>나에게 맞는 설계사 찾기</p></button>
      </div>
    </div>
  </div>
</template>

<script>
import StorageUtils from '@/utils/storage-utils'
import { mapGetters } from "vuex";

export default {
  props: {
    content: {
      default: () => {
        return {}
      },
      required: true,
      type: Object
    }
  },
  data () {
    return {
      sharePopup: false,
    }
  },
  computed: {
    ...mapGetters({
      storeUserInfo: "getUserInfo",
    }),
    tags () {
      return this.content.tag.split(',')
    },
    contentUrl () {
      const template = StorageUtils.getTemplate(this.content.templatesKey)

      return template === undefined ? '' : `${template.url}?content-key=${this.content.key}&token=${StorageUtils.getToken()}`
    }
  },
  created () {
  },
  mounted () {

  },
  methods: {
    /**
     * 공유 팝업 토글
     * 
     * @method toggleSharePopup
     */
    toggleSharePopup () {
      this.sharePopup = !this.sharePopup;
      if (this.sharePopup === false) {
        document.querySelector('html').classList.add('noScroll');
      } else {
        document.querySelector('html').classList.remove('noScroll');
      }
    },

    /**
     * 콘텐츠 닫기
     * 
     * @method onClickClose
     */
    onClickClose () {
      this.$emit('onCloseContentView')
      console.log(this.$refs.contentBoxInner);
    },

    /**
     * 나에게 맞는 설계사 찾기 버튼
     * 
     * @method onClickMatchingFC
     */
    onClickMatchingFC () {
      this.$router.push({ path: '/user/recommendFC' })
    }
  }
}
</script>