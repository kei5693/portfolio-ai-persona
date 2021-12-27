import Vue from 'vue'
import VueRouter from 'vue-router'
import StorageUtils from '@/utils/storage-utils'

// 로그인 및 초기 진입
import UserOnboard from '../view/user/login/Onboard.vue'             // 사용자 - 온보드 화면
import UserLogin from '../view/user/login/Login.vue'                 // 사용자 - 로그인 화면
import UserAccount from '../view/user/login/Account.vue'             // 사용자 - 계정 생성 화면
import UserProfileSelect from '../view/user/login/ProfileSelect.vue' // 사용자 - 프로필 설정 화면

// 진단, 추가 진단
import PersonaAnalysis from '../view/personaAnalysis/PersonaAnalysis.vue'               // 공통 - 퍼소나 진단 화면

// 피드
import UserFeedMain from '../view/user/feed/FeedMain.vue'                           // 사용자 - 피드 목록 화면

// 마이 페르소나
import UserMyPMain from '../view/user/myPage/MyPage.vue'         // 사용자 - 마이페이지 메인 화면
import UserMyPDetail from '../view/user/myPage/MyPageDetail.vue' // 사용자 - 마이페이지 상세 화면
import UserMyPDetailFindFC from '../view/user/myPage/MyPageDetail.vue' // 사용자 - 마이페이지 상세 화면

// 예약
import UserScheduleMake from '../view/user/schedule/ScheduleMake.vue'       // 사용자 - 예약 화면 메인
import UserScheduleChange from '../view/user/schedule/ScheduleMake.vue'       // 사용자 - 예약 화면 메인
import UserScheduleInquiry from '../view/user/schedule/ScheduleInquiry.vue' // 사용자 - 예약 내역 화면 ????
import UserScheduleList from '../view/user/schedule/ScheduleList.vue'       // 사용자 - 예약 내역 화면 ????
import UserScheduleCancel from '../view/user/schedule/ScheduleCancel.vue'   // 사용자 - 예약 취소 화면

// 설계사 매칭
import UserMatchingFC from '../view/user/findFC/MatchingDone.vue'    // 사용자 - 설계사 매칭 완료 화면
import UserFcInformation from '../view/user/findFC/FcInfomation.vue' // 사용자 - 설계사 매칭 후 설계사의 상세정보 보기 화면
import UserMatchingList from '../view/user/findFC/MatchingList.vue'  // 사용자 - 설계사 매칭 리스트 화면
import UserRecommendFC from '../view/user/findFC/RecommendFC.vue'    // 사용자 - 설계사 매칭 설명 화면


////////////////////////////////////////////
// FC
////////////////////////////////////////////


// 로그인 및 초기 진입
import FcOnboard from '../view/fc/login/Onboard.vue' // 설계사 - 온보딩 화면
import FcLogin from '../view/fc/login/Login.vue'     // 설계사 - 로그인 화면
import FcAccount from '../view/fc/login/Account.vue' // 설계사 - 회원가입 화면

// 피드(홈)
import FcFeedMain from '../view/fc/feed/FeedMain.vue'       // 설계사 - 피드 목록 화면

// 마이 페이지
import FcMypMain from '../view/fc/myPage/MyPage.vue'         // 설계사 - 마이페이지 메인 화면
import FcMypDetail from '../view/fc/myPage/MyPageDetail.vue' // 설계사 - 마이페이지 상세 화면

// 예약현황
import FcScheduleMain from '../view/fc/schedule/ScheduleMain.vue'                       // 설계사 - 예약 현황 화면
import FcScheduleDetail from '../view/fc/schedule/ScheduleDetail.vue'                   // 설계사 - 예약 내역 확인
import FcScheduleSetting from '../view/fc/schedule/ScheduleSetting.vue'                 // 설계사 - 상담 가능 일정 관리 화면
import FcScheduleUserPersonaInfo from '../view/fc/schedule/ScheduleUserPersonaInfo.vue' // 설계사 - 고객의 상세정보 보기 화면

// 세일즈 라이브러리
import FcSalesLibrary from '../components/fc/proposal/SalesLibrary.vue'

// 컨텐츠 공유용 컨텐츠 뷰어
import ShareContentViewer from '../components/include/content/ShareContentViewer.vue'


Vue.use(VueRouter)

const routes = [
  // 로그인 및 초기 집입
  {
    path: '/',
    redirect: '/user'
  },
  {
    path: '/user',
    name: 'UserOnboard',
    component: UserOnboard
  },
  {
    path: '/user/login',
    name: 'UserLogin',
    component: UserLogin
  },
  {
    path: '/user/account',
    name: 'UserAccount',
    component: UserAccount
  },
  {
    path: '/user/profile',
    name: 'UserProfileSelect',
    component: UserProfileSelect
  },

  // 진단
  {
    path: '/user/personaAnalysis',
    name: 'UserPersonaAnalysis',
    component: PersonaAnalysis,
    props: (route) => ({
      startPage: route.query.startPage,
      personaLv01: isNaN(parseInt(route.query.personaLv01)) ? -1 : parseInt(route.query.personaLv01),
      userType: "user"
    })
  },

  // 피드
  {
    path: '/user/feedMain',
    name: 'UserFeedMain',
    component: UserFeedMain
  },

  // 마이 페르소나
  {
    path: '/user/myPage',
    name: 'UserMyPMain',
    component: UserMyPMain
  },
  {
    path: '/user/mypDetail',
    name: 'UserMyPDetail',
    component: UserMyPDetail,
    props: true
  },
  {
    path: '/user/mypDetail/:isFindFC',
    name: 'UserMyPDetailFindFC',
    component: UserMyPDetailFindFC,
    props: (route) => ({
      isFindFC: route.params.isFindFC === 'true'
    })
  },
  // 예약
  {
    path: '/user/scheduleMake',
    name: 'UserScheduleMake',
    component: UserScheduleMake
  },
  {
    path: '/user/scheduleMake/:consultKey',
    name: 'UserScheduleChange',
    component: UserScheduleChange,
    props: (route) => {
      const consultKey = Number.parseInt(route.params.consultKey)
      return Number.isNaN(consultKey) ? -1 : { consultKey };
    }
  },
  {
    path: '/user/scheduleInquiry',
    name: 'UserScheduleInquiry',
    component: UserScheduleInquiry
  },
  {
    path: '/user/scheduleList/:consultKey/:consultState',
    name: 'UserScheduleList',
    component: UserScheduleList,
    props: (route) => ({
      consultKey: isNaN(parseInt(route.params.consultKey)) ? -1 : parseInt(route.params.consultKey),
      consultState: isNaN(parseInt(route.params.consultState)) ? -1 : parseInt(route.params.consultState),
      isLastReservation: route.query.isLastReservation === 'true'
    })
  },
  {
    path: '/user/scheduleCancel/:consultKey',
    name: 'UserScheduleCancel',
    component: UserScheduleCancel,
    props: (route) => {
      const consultKey = Number.parseInt(route.params.consultKey)
      return Number.isNaN(consultKey) ? -1 : { consultKey };
    }
  },
  // 설계사 매칭
  {
    path: '/user/matchingFC',
    name: 'UserMatchingFC',
    component: UserMatchingFC
  },
  {
    path: '/user/fcInformation/:fcUserKey',
    name: 'UserFcInformation',
    component: UserFcInformation,
    props: true
  },
  {
    path: '/user/matchingList',
    name: 'UserMatchingList',
    component: UserMatchingList
  },
  {
    path: '/user/recommendFC',
    name: 'UserRecommendFC',
    component: UserRecommendFC
  },

  //////////////////////////////////////////////////////////
  // FC 
  //////////////////////////////////////////////////////////

  // FC>> 온보드
  {
    path: "/fc",
    name: "FcOnboard",
    component: FcOnboard
  },
  {
    path: "/fc/login",
    name: "FcLogin",
    component: FcLogin
  },
  {
    path: "/fc/account",
    name: "FcAccount",
    component: FcAccount
  },

  // FC>> 진단
  {
    path: '/fc/personaAnalysis',
    name: 'FcPersonaAnalysis',
    component: PersonaAnalysis,
    props: (route) => ({
      startPage: route.query.startPage,
      personaLv01: isNaN(parseInt(route.query.personaLv01)) ? -1 : parseInt(route.query.personaLv01),
      userType: "fc"
    })
  },
  // FC>> 피드
  {
    path: "/fc/feedMain",
    name: "FcFeedMain",
    component: FcFeedMain,
    props: true
  },

  // FC>>  마이 페르소나
  {
    path: "/fc/myPage",
    name: "FcMypMain",
    component: FcMypMain
  },
  {
    path: "/fc/myPageDetail",
    name: "FcMypDetail",
    component: FcMypDetail
  },

  // FC>> 예약현황
  {
    path: "/fc/scheduleSetting",
    name: "FcScheduleSetting",
    component: FcScheduleSetting
  },
  {
    path: "/fc/scheduleMain",
    name: "FcScheduleMain",
    component: FcScheduleMain
  },
  {
    path: "/fc/scheduleDetail/:consultingKey",
    name: "FcScheduleDetail",
    component: FcScheduleDetail,
    props: true
  },
  {
    path: "/fc/scheduleUserPersonaInfo/:fromUserKey",
    name: "FcScheduleUserPersonaInfo",
    component: FcScheduleUserPersonaInfo,
    props: true
  },

  // FC>> 세일즈 라이브러리
  {
    path: "/fc/salesLibrary",
    name: "FcSalesLibrary",
    component: FcSalesLibrary
  },

  {
    path: "/shareContentViewer/:contentKey",
    name: "ShareContentViewer",
    component: ShareContentViewer,
    props: (route) => {
      const contentKey = Number.parseInt(route.params.contentKey)
      return Number.isNaN(contentKey) ? 0 : { contentKey };
    }
  }
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  StorageUtils.savePreRouterName(from.name === null ? '' : from.name)
  next()
})

export default router