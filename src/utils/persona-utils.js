import Constant from "@/constant/Constant.js";

/**
 * 퍼소나 진단으로 이동
 * 
 * @param {Object} vue 뷰 
 * @param {Object} userInfo 사용자 정보
 * @param {String} completeLv1And2GoRouterPath 진단 레벨 1,2 완료한 사용자가 이동할 라우터 경로
 */
const gotoPersonaAnalysis = (vue, userInfo, completeLv1And2GoRouterPath = '', startPage = Constant.PERSONA_ANALYSIS_START_PAGE.ONLY_PERSONA_LV01) => {
  console.log('퍼소나 진단 이동시 정보: ', userInfo)

  // 계정없이 둘러보기 화면일 경우
  if (!vue.$store.state.isLogin) {
    vue.$router.push({ path: "/user/account" });
  } else if (!userInfo.completionPersonaLv1 || !userInfo.completionPersonaLv2) {
    // 페르소나 진단을 하지 않았을 경우
    if (userInfo.completionPersonaLv1) {
      vue.$router.push({
        path: `/user/personaAnalysis?startPage=${startPage}&personaLv01=${userInfo.personaKey}`,
      });
    } else {
      vue.$router.push({
        path: `/user/personaAnalysis?startPage=${startPage}`,
      });
    }
  } else if (completeLv1And2GoRouterPath.length !== 0) {  
    vue.$router.push({ path: completeLv1And2GoRouterPath })
  }
}

export default { gotoPersonaAnalysis }