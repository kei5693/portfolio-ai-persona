import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import TokenUtils from '@/utils/token-utils'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    domainUrl: 'http://14.63.217.25:28080/persona-client-api/v1',
    clientUrlPath: 'persona-rnd',// 도메인 이후의 경로(공유 기능에서 사용)
    isLoading: false, // 로딩 뷰를 띄울지 유무

    /* 로그인 유무 */
    isLogin: false,
    /** 사용자 정보 */
    userInfo: {
      completionPersonaLv1: false,
      completionPersonaLv2: false,
      job: "",
      department: "",//소속
      userKey: 0, // 유저 키
      personaKey: 0,  // 유저 퍼소나 키
      userTypeKey: 2, // 유저 타입 키 (클라이언트 : 2, 설계사 1)
      email: '',
      name: '',
      myp: {}
    },

    badge: {
      fcConsultingTodayCount: 0, // 설계사 금일 예약 대기 및 확정 뱃지 갯수
    },

    commonPaging: {
      page: 1,
      limit: 10,
      sort: 'date_write',
      direction: 'DESC',
      extendType: 'normal',
      totalPage: 0,
      totalCount: 0,
    },
  },
  getters: {
    getUserInfo: function (state) {
      // 사용자 키는 토큰에서 가지고 오기 때문에 getUserInfo 호출시 셋팅
      state.userInfo.userKey = TokenUtils.getUserKey()
      return state.userInfo
    },
    getCommonPaging: function (state) {
      return state.commonPaging
    },
    getUserInfoMyP: function (state) {
      return state.userInfo.myp
    },
    getFcConsultingBadgeTodayCount: function (state) {
      return state.badge.fcConsultingTodayCount
    }
  },
  mutations: {
    setNoLogin(state) {
      state.isLogin = false
      state.userInfo.completionPersonaLv1 = false
      state.userInfo.completionPersonaLv2 = false
      state.userInfo.job = ''
      state.userInfo.department = ''
      state.userInfo.userKey = 0
      state.userInfo.personaKey = 0
      state.userInfo.userTypeKey = 2
      state.userInfo.email = ''
      state.userInfo.name = ''
      state.userInfo.myp = {}
    },
    startLoading(state) {
      state.isLoading = true;
    },
    stopLoading(state) {
      state.isLoading = false;
    },
    setState(state, data) {
      state[data.key] = data.value
    },
    setUserInfo(state, data) {
      state.userInfo.completionPersonaLv1 = data.completionPersonaLv1;
      state.userInfo.completionPersonaLv2 = data.completionPersonaLv2;
      state.userInfo.department = data.department;
      state.userInfo.userKey = data.key;
      state.userInfo.personaKey = data.personaKey;
      state.userInfo.userTypeKey = data.userTypeKey;
      state.userInfo.email = data.id;
      state.userInfo.personaSetDiscContentKey = data.personaSetDiscContentKey;
      state.userInfo.name = data.name;
    },
    setUserJob(state, jobName) {
      state.userInfo.job = jobName
    },
    setUserInfoPersonaKey(state, payload) {
      state.userInfo.personaKey = payload
    },
    setUserInfoMyP(state, payload) {
      state.userInfo.myp = payload
    },
    setFcConsultingBadgeTodayCount(state, badgeCount) {
      state.badge.fcConsultingTodayCount = badgeCount
    },
    startDiagnosis: (state) => {
      if (state.createStep == 0 || state.fcDiagnosisStep == 0) {
        state.createStep = 1;
        state.fcDiagnosisStep = 1;
      }
    },
    startAdditional: (state) => {
      state.additionalStep = 1;
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [createPersistedState({ storage: window.sessionStorage })]
})
