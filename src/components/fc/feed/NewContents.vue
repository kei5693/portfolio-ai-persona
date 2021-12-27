<template>
  <div class="newContent pdb80">
    <h2>최신 콘텐츠</h2>

    <!--<div class="adCnt">
      <router-link to="">
        <img src="https://via.placeholder.com/370x120/bff0fd/?text=Ad_Img" alt="">
      </router-link>
    </div>-->

    <div class="contentList">
      <template v-for="(item, index) in contents">
        <div
          class="newItem"
          :key="`new-content-${index}`"
          @click="onClickContent(item)"
        >
          <figure>
            <img :src="item.thumbnailUrl" alt="" />
          </figure>
          <p class="itemTitle">{{ item.title }}</p>
          <!--<div class="recommendRibbon"></div>-->
          <div class="hashTags">
            <template v-for="(tagItem, tagIndex) in item.tag.split(',')">
              <span :key="`tag-${index}-${tagIndex}`">{{ tagItem }}</span>
            </template>
          </div>
        </div>
      </template>

      <infinite-loading @infinite="onInfiniteHandler" ref="infiniteLoading">
        <div slot="no-more"></div>
        <div slot="no-results"></div>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      paging: {},
      contents: [],
    }
  },
  components: {
    InfiniteLoading
  },
  computed: {
    ...mapGetters({ commPaging: 'getCommonPaging' })
  },
  created () {
    this.initPaging()
  },
  mounted () {
    this.onGetContent(data => console.log(data))
  },
  methods: {
    /**
     * 페이징 초기화
     * 
     * @method initPaging
     */
    initPaging () {
      this.paging = JSON.parse(JSON.stringify(this.commPaging))
    },

    /**
     * 콘텐츠 가져오기
     * 
     * @method onGetContent
     * @param {Object} completeCallBack 완료 콜백
     */
    async onGetContent (completeCallBack) {
      const response = await this.$connect('/fc/content/new', 'GET', {}, this.paging)

      response.body.list.forEach(o => this.contents.push(o))

      this.paging.totalCount = response.body.totalCount
      this.paging.totalPage = response.body.totalPage
      this.paging.page += 1

      completeCallBack(response.body.list)
    },

    /**
     * 무한 스크롤 핸들러
     * 
     * @method onInfiniteHandler 
     * @param {Object} event 무한 스크롤 이벤트
     */
    onInfiniteHandler (event) {
      this.onGetContent(data => {
        if (data.length === 0) {
          event.complete()
        } else {
          event.loaded()
        }
      })
    },

    /**
     * 콘텐츠 클릭
     * 
     * @method onClickContent
     * @param {Object} payload 콘텐츠 정보
     */
    onClickContent (payload) {
      this.$emit('onShowContentView', payload)
    }
  }
}
</script>
