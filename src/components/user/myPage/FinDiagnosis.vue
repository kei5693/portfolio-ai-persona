<template>
  <div
    class="finDiagnosis"
    v-if="nowPage == 'Main' || !storeUserInfo.myp.completionPersonaLv2"
  >
    <div
      class="psnResult"
      v-for="(myPersona, myPersonaIdx) in myPersonaList"
      :key="`myPersona-` + myPersonaIdx"
      @click="onClickPersona"
    >
      <span class="resultTitle" v-html="myPersona.type"> </span>
      <span
        :class="
          !storeUserInfo.myp.completionPersonaLv2
            ? 'moreInfo exclamation '
            : 'resultType'
        "
      >
        {{ myPersona.persona }}
      </span>
    </div>
  </div>

  <FinAccordDiagnosis v-else :myPersonaList="myPersonaList" />
</template>

<script>
import FinAccordDiagnosis from "@/components/user/myPage/FinAccordDiagnosis";
import { mapGetters } from "vuex";
import PersonaUtils from '@/utils/persona-utils'
import Constant from "@/constant/Constant.js";

export default {
  components: {
    FinAccordDiagnosis,
  },
  props: {
    nowPage: {
      type: String,
      default: "",
    },
  },
  data () {
    return {
      /** 페르소나 */
      myPersonaList: [
        { type: '라이프스타일<br>페르소나', persona: '업데이트 필요' },
        { type: '성향<br>페르소나', persona: '업데이트 필요' },
      ],
    };
  },
  computed: {
    ...mapGetters({ storeUserInfo: "getUserInfo" }),
  },
  mounted () {
    if (this.storeUserInfo.myp.completionPersonaLv2) {
      this.$set(this.myPersonaList[0], 'persona', this.storeUserInfo.myp.lifeStylePersonaInfo.name)
      this.$set(this.myPersonaList[1], 'persona', JSON.parse(this.storeUserInfo.myp.discMeta).name)
    }
  },
  methods: {
    /**
     * 퍼소나 클릭 
     * 
     * @method onClickPersona
     */
    onClickPersona () {
      PersonaUtils.gotoPersonaAnalysis(this, this.storeUserInfo, '', Constant.PERSONA_ANALYSIS_START_PAGE.MY_PAGE)
    }
  }
};
</script>
