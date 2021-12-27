<template>
  <div class="psnResultCompo" :class="`${type}`">
    <div class="psnStageInfo">
      <div class="stageName">
        <span class="preText">{{
          storeUserInfo.myp.defaultPersonaInfo.meta.slogan
        }}</span>
        <p>{{ storeUserInfo.myp.defaultPersonaInfo.name }}</p>
        <div class="hashTag">
          <span>{{ storeUserInfo.myp.defaultPersonaInfo.meta.keyword }}</span>
        </div>
      </div>
      <PsnType
        :userInfo="storeUserInfo.myp"
        :specificity="storeUserInfo.myp.defaultPersonaInfo.meta.specificity"
        isPropensity="noPps"
      />
    </div>
    <TabMoveContent
      v-if="!isFindFC"
      :defaultPersona="storeUserInfo.myp.defaultPersonaInfo.name"
      :contentTotalCount="storeUserInfo.myp.contentTotalCount" />

    <div class="subCharacter">
      <div class="secTitle">🤪 또 다른 나의 부캐는?</div>
      <div class="secContents">
        <finDiagnosis />
      </div>
    </div>
  </div>
</template>

<script>
import PsnType from "@/components/user/myPage/PsnType";
import FinDiagnosis from "@/components/user/myPage/FinDiagnosis";
import TabMoveContent from "@/components/include/TabMoveContent";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      drawer: null,
    };
  },
  props: {
    type: {
      type: String,
      default: "",
    },
    isFindFC: {
      type: Boolean,
      default: false,
    }
  },
  components: {
    PsnType,
    FinDiagnosis,
    TabMoveContent,
  },
  computed:{
    ...mapGetters({ storeUserInfo: "getUserInfo" }),
  }
};
</script>