<template>
  <div class="psnType" :class="`${isPropensity}`">
    <div class="stageImg" v-if="isPropensity === 'noPps'">
      <img
        :src="
          require(`@/assets/img/personaImg/defaultPersonaKey${
            userInfo.defaultPersonaKey > 0
              ? userInfo.defaultPersonaKey
              : $store.state.userInfo.personaKey
          }.png`)
        "
        :alt="userInfo.defaultPersonaInfo.name"
      />
    </div>

    <div v-else class="stageImg">
      <img
        v-if="personaType.includes('라이프스타일')"
        :src="
          require(`@/assets/img/personaImg/lifeStylePersonaKey${userInfo.lifeStylePersonaKey}.png`)
        "
        :alt="userInfo.lifeStylePersonaInfo.name"
      />

      <img
        v-if="personaType.includes('성향')"
        :src="require(`@/assets/img/personaImg/disc_${userInfo.discName}.png`)"
        :alt="userInfo.discName"
      />
    </div>

    <div
      class="stageExplain"
      v-if="isPropensity === 'noPps'"
      v-html="specificity"
    />

    <div v-else>
      <div class="stageExplain">
        <div
          v-if="personaType.includes('라이프스타일')"
          v-html="userInfo.lifeStylePersonaInfo.meta.specificity"
        />
        <div
          v-if="personaType.includes('성향')"
          v-html="discMeta.commonCharacter"
        />
      </div>

      <div class="exExplain" v-if="personaType.includes('성향')">
        <div class="expTitle">관계적 태도</div>

        <div class="expText">
          {{ discMeta.relationalAttr }}
        </div>
      </div>

      <div class="exExplain" v-if="personaType.includes('성향')">
        <div class="expTitle">의사결정 스타일</div>

        <div class="expText">
          {{ discMeta.decisionMakingStyle }}
        </div>
      </div>

      <div class="exExplain" v-if="personaType.includes('성향')">
        <div class="expTitle">커뮤니케이션스타일</div>

        <div class="expText">
          {{ discMeta.communicationStyle }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: {
    userInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    discMeta: {
      type: Object,
      default: () => {
        return {}
      }
    },
    personaType: {
      type: String,
      default: ''
    },
    specificity: {
      type: String,
      default: ''
    },
    isPropensity: {
      type: String,
      default: '',
      required: true
    } // 받는 속성 이름을 지정한다.
  },
  created(){
    this.$set(this.userInfo.defaultPersonaInfo, 'meta', 
      typeof this.userInfo.defaultPersonaInfo.meta === 'object' 
        ? this.userInfo.defaultPersonaInfo.meta
        : JSON.parse(this.userInfo.defaultPersonaInfo.meta)
    )

    if(this.userInfo.lifeStylePersonaInfo !== null){
      this.$set(this.userInfo.lifeStylePersonaInfo, 'meta',
        typeof this.userInfo.lifeStylePersonaInfo.meta === 'object' 
          ? this.userInfo.lifeStylePersonaInfo.meta
          : JSON.parse(this.userInfo.lifeStylePersonaInfo.meta)
      )
    }
  },
}
  
</script>
