<template>
  <div id="wrap" class="mypDetail">
    <!-- S: 앱 헤더 -->
    <commonHeader title="my Persona"></commonHeader>
    <!-- E: 앱 헤더 -->

    <!-- S: 콘텐츠 -->
    <v-container v-if="userInfo !== undefined">
      <div class="psnResultCompo">
        <div class="psnStageInfo">
          <div class="stageName">
            <span class="preText">
              {{ userInfo.defaultPersonaInfo.meta.slogan }}
            </span>
            <p>{{ userInfo.defaultPersonaInfo.name }}</p>
            <div class="noHashTag">
              <span>{{ userInfo.defaultPersonaInfo.meta.keyword }}</span>
            </div>
          </div>
          <psn-type 
            is-propensity="noPps" 
            :userInfo="userInfo"
            :specificity="userInfo.defaultPersonaInfo.meta.specificity" />
        </div>

        <tab-move-content
          v-if="userInfo !== undefined"
          :defaultPersona="userInfo.defaultPersonaInfo.name"
          :clickeRouterPath="'/fc/feedMain'"
          :routerParam="{
            defaultPersonaKey: userInfo.defaultPersonaKey,
            lifeStylePersonaKey: userInfo.lifeStylePersonaKey,
          }"
          :contentTotalCount="userInfo.contentTotalCount"
        />

        <div class="subCharacter">
          <div class="secTitle">🤪 또 다른 나의 부캐는?</div>
          <div class="secContents">
            <finDiagnosis />
          </div>
        </div>
      </div>

      <div class="floatingBtnBox">
        <button type="button" class="topBtn" @click="scrollTop">Top</button>
      </div>
    </v-container>
    <!-- E: 콘텐츠 -->

    <commonFooter crtPage="myp"></commonFooter>
  </div>
</template>

<script>
import commonHeader from '@/components/include/HeaderWithBack'
import commonFooter from '@/components/include/FcCommonFooter'
import PsnType from '@/components/user/myPage/PsnType'
import FinDiagnosis from '@/components/user/myPage/FinDiagnosis'
import TabMoveContent from '@/components/include/TabMoveContent'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      drawer: null
    };
  },
  components: {
    commonHeader,
    commonFooter,
    PsnType,
    FinDiagnosis,
    TabMoveContent,
  },
  computed: {
    ...mapGetters({ userInfo: 'getUserInfoMyP' }),
  },
  created(){
    this.userInfo.defaultPersonaInfo.meta = JSON.parse(
      this.userInfo.defaultPersonaInfo.meta
    );

    if (this.userInfo.lifeStylePersonaInfo !== null) {
      this.userInfo.lifeStylePersonaInfo.meta = JSON.parse(
        this.userInfo.lifeStylePersonaInfo.meta
      );
    }
  },
  mounted () {
    window.scrollTo({ top: 0 })
  },
  methods: {
    scrollTop () {
      window.scrollTo({ top: 0, behavior: "smooth" })
    },
  },
};
</script>