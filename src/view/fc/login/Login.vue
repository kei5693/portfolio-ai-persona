<template>
  <div id="wrap" class="login fc">
    <!-- S: 앱 헤더 -->
    <v-app-bar app> </v-app-bar>
    <!-- E: 앱 헤더 -->

    <!-- S: 콘텐츠 -->
    <v-container>
      <h1 class="subject">Fit-me</h1>

      <form>
        <label for="userId">
          <input
            type="text"
            id="userId"
            v-model="userEmail"
            placeholder="페르소나 코드"
          />
        </label>
        <label for="userPw">
          <input
            type="password"
            id="userPw"
            v-model="userPassword"
            placeholder="비밀번호"
          />
        </label>

        <div class="loginUtil">
          <label for="autoLogin">
            <input type="checkbox" id="autoLogin" />
            <span>자동 로그인</span>
          </label>
          <div class="accountUtil">
            <router-link to="">코드 찾기</router-link>
            <router-link to="">비밀번호 찾기</router-link>
          </div>
        </div>
      </form>

      <div class="btnBox" @click="onClickLogin">
        <router-link to="">로그인</router-link>
      </div>
    </v-container>
    <!-- E: 콘텐츠 -->

    <popup-alert
      v-if="alert.isShow"
      :title="alert.title"
      :desc="alert.desc"
      @closeAlert="alert.callback"
    />
  </div>
</template>

<script>
import PopupAlert from '@/components/include/PopupAlert'
import StorageUtils from '@/utils/storage-utils'

export default {
  data () {
    return {
      userEmail: '',
      userPassword: '',
      alert: {
        title: '',
        desc: '',
        isShow: false,
        callback: () => {
          this.alert.isShow = false
        },
      },
    };
  },
  components: {
    PopupAlert,
  },
  computed: {
    isDisableButtonLogin () {
      return this.userEmail.length === 0 || this.userPassword.length === 0;
    },
  },
  created () {
    StorageUtils.clear()
  },
  methods: {
    /**
     * 얼럿 띄우기
     *
     * @method onShowAlert
     * @param {String} title 제목
     * @param {String} desc 설명
     */
    onShowAlert (title = '', desc = '') {
      this.alert.isShow = true
      this.alert.title = title
      this.alert.desc = desc
    },

    /**
     * 로그인 클릭
     *
     * @method onClickLogin
     */
    async onClickLogin () {
      if (this.isDisableButtonLogin) {
        this.onShowAlert('확인', '아이디 혹은 비밀번호를 입력해 주세요.')
        return
      }

      // 사용자 로그인
      const responseLogin = await this.$connect('/login/fc', 'POST', {
        id: this.userEmail,
        password: this.userPassword,
      })

      StorageUtils.saveToken(responseLogin.body.info.token)
      this.$store.commit('setState', {
        key: 'isLogin',
        value: true,
      })

      this.onGetConsultingBadgeTodaycount()
      this.onGetUserInfo()
    },

    /**
     * 사용자 정보 조회
     *
     * @method onGetUserInfo
     */
    async onGetUserInfo () {
      const responseUserInfo = await this.$connect('/user', 'GET')

      this.$store.commit('setUserInfo', responseUserInfo.body.info.user)

      const completionPersonaLv1 =
        responseUserInfo.body.info.user.completionPersonaLv1
      const completionPersonaLv2 =
        responseUserInfo.body.info.user.completionPersonaLv2

      let routerPath =
        !completionPersonaLv1 || !completionPersonaLv2
          ? '/fc/personaAnalysis'
          : '/fc/feedMain'

      this.$router.push(routerPath)
    },

    /**
     * 금일 예약 대기 및 확정 갯수 가져오기
     * 
     * @method onGetConsultingBadgeTodaycount
     */
    async onGetConsultingBadgeTodaycount () {
      const response = await this.$connect('/consultation/meeting/badge/today/count', 'GET')

      this.$store.commit('setFcConsultingBadgeTodayCount', response.body.info.badgeCount)
    }
  },
};
</script>