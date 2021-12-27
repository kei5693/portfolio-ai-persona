<template>
  <div :class="!isAdContent ? 'feedItem' : 'adItems feedItem'">
    <router-link
      to=""
      @click.native="onClickContent(content)"
      v-if="!isAdContent"
    >
    <!-- v-if="content.extendType == 'normal'" -->
      <div class="itemHeader"
        v-if="!$store.state.userInfo.completionPersonaLv2">
        <div class="titleBox">
          <span class="avatar v-icon mdi mdi-account-circle"></span>
          <ul>
            <li class="personaMain">{{ this.personaMain }}</li>
            <li class="personaType">{{ this.personaType }}</li>
          </ul>
        </div>
        <div class="lastest">
          <span>{{ content.dateWrite | timeForToday }}</span>
        </div>
      </div>
      
      <div class="itemBody">
        <div class="thumbImg">
          <img
            :src="content.thumbnailUrl"
            alt=""
          />
        </div>
        <dl>
          <dt>{{ content.title }}</dt>
          <dd>{{ content.desc }}</dd>
        </dl>
      </div>
    </router-link>

    <router-link
      v-else
      to=""
      @click.native="onAdClickContent(content)"
    >
      <div class="itemBody">
        <div class="thumbImg">
          <img
            :src="content.thumbnailUrl"
            alt=""
          />
          <span>AD</span>
        </div>
        <dl>
          <dt>{{ content.title }}</dt>
        </dl>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    isAdContent: {
      type: Boolean,
      default: false,
    },
    content: {
      type: Object,
    },
  },
  data() {
    return {
      personaMain: "아이엠싱글",
      personaType: "인생설계스타터",
      latest: "6시간",
    };
  },
  methods: {
    /**
     * 콘텐츠 클릭
     * 
     * @method onClickContent
     * @param {Object} payload 콘텐츠 정보
     */
    onClickContent (payload) {
      this.$emit('onShowContentView', payload)
    },
    onAdClickContent (payload){
      this.$emit('onShowAdContentView', payload)
    },
    /**
     * 피드 디테일 화면 클릭 시
     */
    clickFeedDetail(view) {
      this.$router.push({ name: view, params: { key: this.contents.key } });
    },
  },
};
</script>