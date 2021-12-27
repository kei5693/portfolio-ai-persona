<template>
  <div class="finDiagnosis detail">
    <div
      class="psnResult"
      v-for="(myPersona, myPersonaIdx) in myPersonaList"
      :key="`myPersona-` + myPersonaIdx"
    >
      <div class="secHeader" v-if="storeUserInfo.myp.discMeta !== undefined">
        <span
          class="resultTitle"
          v-html="myPersona.type.replace('<br>', '&nbsp&nbsp')"
        ></span>
        <span class="resultType">{{ myPersona.persona }}</span>

        <p v-if="myPersona.type.includes('라이프스타일')">
          {{ storeUserInfo.myp.lifeStylePersonaInfo.meta.keyword }}
        </p>
        <p v-else>{{ JSON.parse(storeUserInfo.myp.discMeta).keyword }}</p>

        <button type="button" class="openToggleBtn" @click="openToggleBtn">
          <img src="@/assets/img/icon_arrow_down.svg" alt="" />
        </button>

        <div class="secBody">
          <PsnType
            :personaType="myPersona.type"
            :userInfo="storeUserInfo.myp"
            :discMeta="JSON.parse(storeUserInfo.myp.discMeta)"
            isPropensity="pps"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PsnType from "@/components/user/myPage/PsnType";
import { mapGetters } from "vuex";

export default {
  props: {
    myPersonaList: {
      type: Array,
      default: new Array(),
      required: true
    },
  },
  components: {
    PsnType,
  },
  computed:{
    ...mapGetters({ storeUserInfo: "getUserInfo" }),
  }, 
  methods: {
    openToggleBtn () {
      var target = event.currentTarget;
      target.closest(".psnResult").classList.toggle("on");
    },
  }
};
</script>