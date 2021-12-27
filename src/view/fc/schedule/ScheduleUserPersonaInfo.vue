<template>
  <div id="wrap" class="customerProperty mypDetail">
    <!-- S: 앱 헤더 -->
    <v-app-bar app>
      <div class="routerBox"></div>
      <v-toolbar-title class="textBlue">고객 페르소나 특성</v-toolbar-title>
      <button type="button" @click="onClickBack">
        <img src="@/assets/img/closeBtn_x.svg" alt="" />
      </button>
    </v-app-bar>
    <!-- E: 앱 헤더 -->

    <v-container>
      <div class="fcNotice">
        상담 예정인 고객님의 페르소나를 확인하고,<br />
        맞춤 상담 콘텐츠를 준비하세요.
      </div>
      <div class="psnResultCompo pdb80">
        <div class="psnStageInfo">
          <div class="stageName" v-if="userInfo !== undefined">
            <span class="preText">{{
              userInfo.defaultPersonaInfo.meta.slogan
            }}</span>
            <p>{{ userInfo.defaultPersonaInfo.name }}</p>
            <div class="hashTag">
              <span>{{ userInfo.defaultPersonaInfo.meta.keyword }}</span>
            </div>
          </div>
          <PsnType
            v-if="userInfo !== undefined"
            :userInfo="userInfo"
            :specificity="userInfo.defaultPersonaInfo.meta.specificity"
            isPropensity="noPps"
          />
        </div>

        <div
          class="subCharacter"
          v-if="userInfo !== undefined && userInfo.completionPersonaLv2"
        >
          <div class="secTitle">🤪 또 다른 나의 부캐는?</div>
          <div class="secContents">
            <FinAccordDiagnosis
              :userInfo="userInfo"
              :myPersonaList="myPersonas"
            />
          </div>
        </div>
      </div>

      <div class="floatingBtnBox">
        <button type="button" class="topBtn" @click="onScrollTop">Top</button>
      </div>
    </v-container>

    <fcCommonFooter crtPage="rsv"></fcCommonFooter>
  </div>
</template>

<script>
import fcCommonFooter from '@/components/include/FcCommonFooter'
import PsnType from '@/components/user/myPage/PsnType'
import FinAccordDiagnosis from '@/components/user/myPage/FinAccordDiagnosis'

export default {
  components: {
    fcCommonFooter,
    PsnType,
    FinAccordDiagnosis,
  },
  data () {
    return {
      fromUserKey: 0,
      userInfo: undefined,
      department: '',
      discInfo: {},
      profiles: [
        { key: 'profile.name', name: '이름', value: [] },
        { key: 'profile.sex', name: '성별', value: [] },
        { key: 'profile.married', name: '결혼유무', value: [] },
        { key: 'profile.children', name: '자녀유무', value: [] },
        { key: 'profile.age', name: '나이', value: [] },
        { key: 'profile.career', name: '경력', value: [] },
        { key: 'profile.license', name: '보유자격', value: [] },
        { key: 'profile.specialty', name: '주요분야', value: [] },
        { key: 'profile.activityArea', name: '활동지역', value: [] },
      ],
      myPersonas: [
        { type: '라이프스타일<br>페르소나', persona: '업데이트 필요' },
        { type: '성향<br>페르소나', persona: '업데이트 필요' },
      ],
    }
  },
  created () {
    this.fromUserKey = this.$route.params.fromUserKey
    this.onGetUserInfo(this.fromUserKey)
  },
  mounted () {
    this.onScrollTop()
  },
  methods: {
    /**
     * 상단으로 이동
     * 
     * @method onScrollTop
     */
    onScrollTop () {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    /**
     * 뒤로가기
     * 
     * @method onClickBack
     */
    onClickBack () {
      this.$router.go(-1)
    },

    /**
     * 사용자 정보 조회
     * 
     * @method onGetUserInfo
     * @param {Number} userKey 사용자 키
     */
    async onGetUserInfo (userKey) {
      const response = await this.$connect(`/user/persona/${userKey}`, 'GET')
      const userInfo = response.body.info.user

      this.department = userInfo.department
      this.$set(this, 'userInfo', userInfo)
      this.$set(this.userInfo, 'contentTotalCount', this.contentTotalCount)
      this.$set(this.userInfo.defaultPersonaInfo, 'meta', JSON.parse(userInfo.defaultPersonaInfo.meta))
      this.$set(this, 'discInfo', JSON.parse(userInfo.discMeta))

      if(this.userInfo.lifeStylePersonaInfo !== null){
        this.$set(this.userInfo.lifeStylePersonaInfo, 'meta', JSON.parse(userInfo.lifeStylePersonaInfo.meta))
      }

      console.log('사용자 정보: ', this.userInfo)

      this.$store.commit('setUserInfoMyP', JSON.parse(JSON.stringify(this.userInfo)))
      this.onSetPersonaDetailLog(userInfo)
    },

    /**
     * 퍼소나 디테일 로그 셋팅
     * 
     * @method onSetPersonaDetailLog
     * @param {Object} userInfo 사용자 정보
     */
    onSetPersonaDetailLog (userInfo) {
      const personaDetailLogs = userInfo.personaDetailLogList.map(o => {
        o.serveyMeta = JSON.parse(o.serveyMeta)

        return o
      })

      this.profiles.forEach(o => {
        const key = o.key
        o.value = personaDetailLogs.filter(o2 => o2.serveyMeta.globalSaveData === key).map(o3 => o3.answerValue)
      })

      this.onSetMyPersonas(userInfo)
    },

    /**
     * 나의 퍼소나 정보 업데이트
     * 
     * @method onSetMyPersonas
     * @param {Object} userInfo 사용자 정보
     */
    onSetMyPersonas (userInfo) {
      if (!userInfo.completionPersonaLv2) {
        this.$set(this.myPersonas[0], 'persona', userInfo.defaultPersonaInfo.name)
      }
      else {
        this.$set(this.myPersonas[0], 'persona', userInfo.lifeStylePersonaInfo.name)
        this.$set(this.myPersonas[1], 'persona', JSON.parse(userInfo.discMeta).name)
      }
    }
  },
};
</script>