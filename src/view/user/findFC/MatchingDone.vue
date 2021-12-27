<template>
  <div id="wrap" class="matchingFC">
    <!-- S: 앱 헤더 -->
    <commonHeader
      title="맞춤 설계사 찾기"
      :router-path="prevRouteName === 'UserMyPMain' ? '' : '/user/recommendFC'"
    ></commonHeader>
    <!-- E: 앱 헤더 -->

    <!-- S: 콘텐츠 -->
    <v-container>
      <div class="matchingFCHeader">
        <div class="left">
          {{ this.$store.state.userInfo.name }} 님의 페르소나와<br />
          유사한 설계사를 소개합니다.
        </div>
        <div class="right">
          <span>맞춤 설계사</span>
          <b>{{ totalCount }} <span>명</span></b>
        </div>
      </div>

      <div
        class="fcList"
        v-for="(matchFC, matchFCIdx) in matchFCs"
        :key="`matchFC-` + matchFCIdx"
      >
        <FcInfoCard :matchFCInfo="matchFC" />
      </div>
    </v-container>
    <!-- E: 콘텐츠 -->

    <!-- S: 매칭 로딩 -->
    <transition name="fade">
      <div class="loading" v-if="loader">
        <div class="loader">
          <p>설계사를 찾고 있습니다.</p>
          <div class="lds-ripple">
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </transition>
    <!-- E: 매칭 로딩 -->

    <!-- S: 레이어 팝업 -->
    <div class="layerBox dark matchDone" :class="{ on: isShowHelp }">
      <div class="layerContent">
        <div class="title">설계사 매칭 완료!</div>
        <figure>
          <img src="@/assets/img/matchingImg.png" alt="" />
          <img src="@/assets/img/matchingInfo.png" alt="" />
        </figure>
        <div class="comment">
          설계사 네임카드를 눌러<br />
          정보를 확인하세요!
        </div>

        <div class="btnBox">
          <button type="button" @click="onClickCloseHelp">확인</button>
        </div>
      </div>
    </div>
    <!-- E: 레이어 팝업 -->

    <popup-alert
      v-if="alert.isShow"
      :title="alert.title"
      :desc="alert.desc"
      @closeAlert="alert.callback"
    />
  </div>
</template>

<script>
import StorageUtils from "@/utils/storage-utils";
import commonHeader from "@/components/include/HeaderWithBack";
import FcInfoCard from "@/components/user/findFC/FcInfoCard";
import { mapGetters } from "vuex";
import PopupAlert from '@/components/include/PopupAlert'

export default {
  components: {
    commonHeader,
    FcInfoCard,
    PopupAlert
  },
  data () {
    return {
      loader: true,
      totalCount: 0,
      matchFCs: {},
      isShowHelp: true,
      alert: {
        title: '추가 진단 필요',
        desc: '라이프스타일 진단 후 이용이 가능합니다.',
        isShow: false,
        callback: () => {
          this.alert.isShow = false
          this.$router.push({ path: '/user/recommendFC' })
        }
      },
      prevRouteName: '',
    };
  },
  computed: {
    ...mapGetters({ storeUserInfo: 'getUserInfo' }),
  },
  created () {},
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.prevRouteName = from.name
    });
  },
  mounted () {
    var wrapper = document.querySelector("html");
    wrapper.classList.add("noScroll");

    setTimeout(() => {
      this.loader = false;
    }, 1500);

    this.onGetTopScoreTenFc()
  },
  methods: {
    /**
     * 상위 10명 설계사 조회
     * 
     * @method onGetTopScoreTenFc
     */
    onGetTopScoreTenFc () {
      this.$connect('/user/match/top-score-ten', 'GET', {}, {}, { "x-token": StorageUtils.getToken() })
        .then((res => {
          console.log(">>>> 상위 10명 설계사 불러오기", res.body)

          this.matchFCs = res.body.list.slice(0, 5)
          this.totalCount = this.matchFCs.length
        }))
    },

    /**
     * 도움말 창 닫기 클릭
     * 
     * @method onClickCloseHelp
     */
    onClickCloseHelp () {
      var wrapper = document.querySelector("html");
      wrapper.classList.remove("noScroll");

      this.isShowHelp = false
    },
  },
};
</script>