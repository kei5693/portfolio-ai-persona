<template>
  <div class="listUtilBox">
    <p v-if="type === ''">
      전체글 <b>{{ contentTotalCount }}</b>
    </p>
    <div class="tabList">
      <ul>
        <li
          v-for="(tag, idx) in tagList"
          :class="{ on: selectedTag === tag.name }"
          :key="`persona-tag-${idx}`"
          @click="clickPersonaTag(tag)"
        >
          <button type="button">{{ tag.name }}</button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: "",
    },
    selectedTagName: {
      type: String,
      default: ''
    },
    contentTotalCount: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      tagList: [],
      selectedTag: '',
    };
  },
  created () {
    this.getPersonaTag();

    this.$set(this, "selectedTag", this.selectedTagName)
  },
  methods: {
    /**
     * 퍼소나 태그 목록 불러오기
     */
    getPersonaTag () {
      var tagUrl = ''
      if (this.$store.state.userInfo.personaKey == null) {
        tagUrl = `/tag`
      }
      else {
        tagUrl = `/tag/${this.$store.state.userInfo.personaKey}`
      }

      this.$connect(
        tagUrl,
        "GET"
      ).then((res) => {
        this.tagList = res.body.info.tagList;
      });
    },
    /**
     * 태그 클릭 시 동작하는 메소드
     */
    clickPersonaTag (tag) {
      this.selectedTag = tag.name
      this.$emit('onClickTag', tag)
    },
  },
};
</script>