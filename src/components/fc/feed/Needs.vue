<template>
  <div class="needs pdb80">
    <div class="optionBox">
      <select v-model="selectedRootMenuSetKey">
        <option
          v-for="item in rootMenus"
          :value="item.key"
          :key="`root-menu-${item.key}`"
        >
          {{ item.name }}
        </option>
      </select>
      <!--<label for="chkOther">
        <input type="checkbox" name="" id="chkOther" />
        <span>담은 콘텐츠 제외</span>
      </label>-->
    </div>

    <div class="tabList">
      <ul>
        <li
          :class="{ on: selectedChildrenMenuSetKey === 0 }"
          @click="onClickChildrenMenu(0)"
        >
          <button type="button">전체</button>
        </li>
        <li
          v-for="(item, index) in childrenMenus"
          :key="`children-menu-${index}`"
          :class="{ on: selectedChildrenMenuSetKey === item.key }"
          @click="onClickChildrenMenu(item.key)"
        >
          <button type="button">
            {{ item.name }}
          </button>
        </li>
      </ul>
    </div>

    <div class="contentList">
      <template v-for="(item, index) in contents">
        <div
          class="newItem"
          :key="`needs-content-${index}`"
          @click="onClickContent(item)"
        >
          <figure>
            <img :src="item.thumbnailUrl" alt="" />
          </figure>
          <p class="itemTitle">{{ item.title }}</p>
          <!-- <div class="recommendRibbon">
          <span>추천</span>
        </div> -->
          <div class="hashTags">
            <template v-for="(tagItem, tagIndex) in item.tag.split(',')">
              <span :key="`tag-${index}-${tagIndex}`">{{ tagItem }}</span>
            </template>
          </div>
        </div>
      </template>

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
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      paging: {},
      contents: [],
      rootMenus: [],
      selectedRootMenuSetKey: -1,
      selectedChildrenMenuSetKey: 0,
      childrenMenus: [],
      infiniteId: +new Date()
    }
  },
  components: {
    InfiniteLoading
  },
  computed: {
    ...mapGetters({ commPaging: 'getCommonPaging' }),
  },
  watch: {
    selectedRootMenuSetKey () {
      // this.initPaging()
      this.onGetMenu(this.selectedRootMenuSetKey)
    }
  },
  created () {
    this.initPaging()
  },
  mounted () {
    this.onGetMenu(0)
  },
  methods: {
    /**
     * 페이징 초기화
     * 
     * @method initPaging
     */
    initPaging () {
      this.paging = JSON.parse(JSON.stringify(this.commPaging))
      this.paging.sort = 'sort_index'
      this.paging.direction = 'ASC'

      this.$set(this, 'contents', [])
      this.infiniteId += 1
    },

    /**
     * 메뉴 가져오기
     * 
     * @method onGetMenu
     * @param {Number} menuParentKey 메뉴 부모 키(최상위 메뉴: 0)
     */
    async onGetMenu (menuParentKey = 0) {
      const response = await this.$connect(`/menu/${menuParentKey}`, 'GET')
      const menuVariableName = menuParentKey === 0 ? 'rootMenus' : 'childrenMenus'
      const selectedVariableName = menuParentKey === 0 ? 'selectedRootMenuSetKey' : 'selectedChildrenMenuSetKey'

      this.$set(this, menuVariableName, [])
      this.$set(this, menuVariableName, response.body.list)

      if (selectedVariableName === 'selectedChildrenMenuSetKey') {
        this[selectedVariableName] = 0
      } else {
        this.selectedChildrenMenuSetKey = 0;
        this[selectedVariableName] = this[menuVariableName].length === 0 ? 0 : this[menuVariableName][0].key
      }

      // 자녀 메뉴가 바뀔때만 콘텐츠 호출
      if (menuVariableName === 'childrenMenus') {
        this.initPaging()
        this.onGetContent(this.selectedRootMenuSetKey, this.selectedChildrenMenuSetKey, data => console.log(data))
      }
    },

    /**
     * 자녀 메뉴 클릭
     * 
     * @method onClickChildrenMenu
     * @param {Number} menuKey 메뉴 키
     */
    onClickChildrenMenu (menuKey) {
      this.selectedChildrenMenuSetKey = menuKey
      this.initPaging()
      this.onGetContent(this.selectedRootMenuSetKey, this.selectedChildrenMenuSetKey, data => console.log(data))
    },

    /**
     * 콘텐츠 가져오기
     *
     * @method onGetContent
     * @param {Number} rootMenuSetKey 부모 메뉴 키
     * @param {Number} childrenMenuSetKey 자녀 메뉴 키
     * @param {Object} completeCallBack 완료 콜백
     */
    async onGetContent (rootMenuSetKey, childrenMenuSetKey, completeCallBack) {
      if (rootMenuSetKey <= 0) {
        return
      }

      let url = childrenMenuSetKey === 0 ? `/fc/content/menu-set/${rootMenuSetKey}/all`
        : `/fc/content/menu-set/${childrenMenuSetKey}`

      const response = await this.$connect(url, 'GET', {}, this.paging)
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
      this.onGetContent(this.selectedRootMenuSetKey, this.selectedChildrenMenuSetKey, data => {
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