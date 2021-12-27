<template>
  <div class="listUtilBox">
    <p>
      전체글 <b>{{ contentTotalCount }}</b>
    </p>
    <div class="tabList">
      <ul>
        <li
          v-for="(item, index) in tags"
          :class="{ on: selectedTagIndex === index }"
          :key="`persona-tag-${index}`"
          @click="onClickTag(index)"
        >
          <button type="button">{{ item.name }}</button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    personaKey: {
      default: 0,
      type: Number,
      required: true
    },
    contentTotalCount: {
      default: 0,
      type: Number,
      required: false
    }
  },
  data () {
    return {
      tags: [],
      selectedTagIndex: 0,
    }
  },
  created () {

  },
  mounted () {
    this.onGetTag()
  },
  watch: {
    personaKey () {
      this.onGetTag()
    }
  },
  methods: {
    /**
     * 태그 목록 가져오기
     * 
     * @method onGetTag
     */
    async onGetTag () {
      this.selectedTagIndex = 0

      const response = await this.$connect(`/fc/tag/${this.personaKey}`, 'GET')

      this.$set(this, 'tags', response.body.info.tagList)

      this.onClickTag(this.selectedTagIndex)
    },

    /**
     * 태그 클릭
     * 
     * @method onClickTag
     * @param {Number} index 태그 메뉴 인덱스
     */
    onClickTag (index) {
      this.selectedTagIndex = index
      this.$emit('onClickTag', { tagKey: this.tags.length === 0 ? -1 : this.tags[index].key })
    }
  }
}
</script>
