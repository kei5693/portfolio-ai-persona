<template>
  <div class="feedMainTabContent">
    <div class="tabPsnStage">
      <div class="mask">
        <ul>
          <template v-for="(item, index) in personas">
            <li
              :key="`default-persona-${index}`"
              @click="onClickDefaultPersona(index)"
              :class="{ on: selectedDefaultPersonaIndex === index }"
            >
              <button
                type="button"
                v-html="JSON.parse(item.meta).fcMenu"
              ></button>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <div class="tabPsnSub">
      <div
        class="mask"
        v-if="personas[selectedDefaultPersonaIndex] !== undefined"
      >
        <ul>
          <template
            v-for="(item, index) in personas[selectedDefaultPersonaIndex]
              .children"
          >
            <li
              :key="`lifestyle-persona-${index}`"
              @click="onClickLifeStylePersona(index)"
              :class="{ on: selectedLifeStylePersonaIndex === index }"
            >
              <button type="button">{{ item.personaName }}</button>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <div class="upsideAD">
      <img
        :src="require(`@/assets/img/personaImg/lifeStylePersonaKey${personaInfo.lifeStylePersonaKey}.png`)"
        :alt="personaInfo.lifeStylePersonaName"
      />

      <div class="psnSummary">
        <div class="type">
          <span class="typeName">{{ personaInfo.defaultPersonaName }}</span>
          <span class="counter"
            ><b>{{ personaInfo.counter | comma }}</b> 명</span
          >
        </div>
        <div class="pps">{{ personaInfo.lifeStylePersonaName }}</div>
      </div>
    </div>

    <div class="feedListBox pd12">
      <feed-content-tag-list
        v-if="personas.length !== 0"
        :persona-key="selectedMenuPersonaKey"
        :content-total-count="paging.totalCount"
        @onClickTag="onClickTag"
      ></feed-content-tag-list>
    </div>

    <div class="feedListBox pd12 pdb80" v-if="isShowContents">
      <div class="feedList">
        <template v-for="(item, index) in contents">
          <div class="feedItem" :key="`content-${index}`">
            <div @click="onClickContent(item)">
              <div class="itemBody">
                <div class="thumbImg">
                  <img :src="item.thumbnailUrl" alt="" />
                </div>
                <dl>
                  <dt>{{ item.title }}</dt>
                  <dd>{{ item.desc }}</dd>
                </dl>
              </div>

              <div class="itemTail">
                <div class="lastest">
                  <span>{{ item.dateWrite | timeForToday }}</span>
                </div>
              </div>
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
  </div>
</template>

<script>
import FeedContentTagList from '@/components/fc/feed/FeedContentTagList'
import InfiniteLoading from "vue-infinite-loading";
import { mapGetters } from "vuex";

export default {
  components: {
    InfiniteLoading,
    FeedContentTagList
  },
  data () {
    return {
      drawer: null,
      personas: [], // 퍼소나 목록
      selectedDefaultPersonaIndex: 0, // 선택 된 기본 퍼소나 인덱스
      selectedLifeStylePersonaIndex: 0, // 선택 된 라이프 퍼소나 인덱스
      paging: {},
      contents: [],
      isShowContents: false,
      infiniteId: +new Date()
    };
  },
  computed: {
    ...mapGetters({ commPaging: "getCommonPaging" }),

    /**
     * 선택된 메뉴의 퍼소나 키 가져오기
     *
     * @return {Number} result 퍼소나 키
     */
    selectedMenuPersonaKey () {
      return this.personas[this.selectedDefaultPersonaIndex].children === 0
        ? -1
        : this.personas[this.selectedDefaultPersonaIndex].children[
          this.selectedLifeStylePersonaIndex
        ].personaKey;
    },

    /**
     * 퍼소나 정보 가져오기
     *
     * @return {Object} result 퍼소나 정보
     */
    personaInfo () {
      let result = {
        defaultPersonaName: "",
        lifeStylePersonaName: "",
        lifeStylePersonaKey: 8,
        counter: 0,
      };

      if (this.personas.length !== 0) {
        result = {
          defaultPersonaName:
            this.personas[this.selectedDefaultPersonaIndex].personaName,
          lifeStylePersonaName:
            this.personas[this.selectedDefaultPersonaIndex].children === 0
              ? ""
              : this.personas[this.selectedDefaultPersonaIndex].children[
                this.selectedLifeStylePersonaIndex
              ].personaName,
          lifeStylePersonaKey: 
            this.personas[this.selectedDefaultPersonaIndex].children === 0
              ? 8
              : this.personas[this.selectedDefaultPersonaIndex].children[
                this.selectedLifeStylePersonaIndex
              ].personaKey,
          counter: Math.floor(Math.random() * (400000 - 300000 + 1)) + 300000,
        };
      }

      return result;
    },
  },
  created () {
    this.initPaging();
  },
  mounted () {
    window.scrollTo({ top: 0, behavior: "smooth" });

    this.onGetPersonas();
  },
  methods: {
    /**
     * 페이징 초기화
     *
     * @method initPaging
     */
    initPaging () {
      this.paging = JSON.parse(JSON.stringify(this.commPaging));
      this.$set(this.paging, "tagKey", -1);
      this.$set(this.paging, "personaKey", -1);
    },

    /**
     * 퍼소나 목록 가져오기
     *
     * @method onGetPersonas
     */
    async onGetPersonas () {
      const response = await this.$connect("/persona-set/persona/depth", "GET");

      // 파라미터로 받은 기본 퍼소나 키와 라이프스타일 퍼소나 키 셋팅
      if (this.$route.query.defaultPersonaKey !== undefined) {
        const defaultPersonaKey = parseInt(
          this.$route.query.defaultPersonaKey,
          10
        );
        const lifeStylePersonaKey = parseInt(
          this.$route.query.lifeStylePersonaKey,
          10
        );
        const defaultPersonaIndex = this._.findIndex(
          response.body.list,
          (o) => o.personaKey === defaultPersonaKey
        );

        this.selectedDefaultPersonaIndex =
          defaultPersonaIndex === -1 ? 0 : defaultPersonaIndex;

        if (defaultPersonaIndex !== -1) {
          const lifeStylePersonaIndex = this._.findIndex(
            response.body.list[defaultPersonaIndex].children,
            (o) => o.personaKey === lifeStylePersonaKey
          );
          this.selectedLifeStylePersonaIndex =
            lifeStylePersonaIndex === -1 ? 0 : lifeStylePersonaIndex;
        }
      }
      
      this.$set(this, "personas", response.body.list);
    },

    /**
     * 기본 퍼소나 메뉴 클릭
     *
     * @method onClickDefaultPersona
     * @param {Number} index 메뉴 인덱스
     */
    onClickDefaultPersona (index) {
      this.selectedDefaultPersonaIndex = index;
      this.selectedLifeStylePersonaIndex = 0;
    },

    /**
     * 라이프 스타일 퍼소나 메뉴 클릭
     *
     * @method onClickLifeStylePersona
     * @param {Number} index 메뉴 인덱스
     */
    onClickLifeStylePersona (index) {
      this.selectedLifeStylePersonaIndex = index;
    },

    /**
     * 태그 클릭
     *
     * @method onClickTag
     * @param {Object} payload 태그 정보
     */
    onClickTag (payload) {
      const tagKey = payload.tagKey;
      const personaKey =
        this.personas[this.selectedDefaultPersonaIndex].children === 0
          ? -1
          : this.personas[this.selectedDefaultPersonaIndex].children[
            this.selectedLifeStylePersonaIndex
          ].personaKey;

      this.onGetContent(this.onSetPaging(tagKey, personaKey), (data) => {
        console.log(data)
        if (this.contents.length !== 0) {
          this.infiniteId += 1;
        }

        this.isShowContents = true;
      });
    },

    /**
     * 페이지 변경 셋팅
     *
     * @method onGetContent
     * @param {Number} tagKey 태그 키
     * @param {Nubmer} personaKey 퍼소나 키
     * @return {Boolean} isNewPage true 신규 페이지, false 페이지 증가
     */
    onSetPaging (tagKey, personaKey) {
      let isNewPage = false;

      if (tagKey !== undefined && personaKey !== undefined) {
        this.paging.page = 0;
        this.paging.tagKey = tagKey;
        this.paging.personaKey = personaKey;
        isNewPage = true;
      }

      this.paging.page += 1;

      return isNewPage;
    },

    /**
     * 콘텐츠 가져오기
     *
     * @method onGetContent
     * @param {Boolean} isNewPage true 신규 페이지, false 페이지 증가
     * @param {Object} completeCallBack 완료 콜백
     */
    async onGetContent (
      isNewPage,
      completeCallBack
    ) {
      const response = await this.$connect(
        "/fc/content",
        "GET",
        {},
        this.paging
      );

      if (isNewPage) {
        this.$set(this, "contents", response.body.list);
      } else {
        response.body.list.forEach((o) => this.contents.push(o));
      }

      this.paging.totalCount = response.body.totalCount;
      this.paging.totalPage = response.body.totalPage;

      completeCallBack(response.body.list);
    },

    /**
     * 무한 스크롤 핸들러
     *
     * @method onInfiniteHandler
     * @param {Object} event 무한 스크롤 이벤트
     */
    onInfiniteHandler (event) {
      this.onGetContent(
        this.onSetPaging(),
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
     * 콘텐츠 클릭
     *
     * @method onClickContent
     * @param {Object} payload 콘텐츠 정보
     */
    onClickContent (payload) {
      this.$emit("onShowContentView", payload);
    },
  },
};
</script>