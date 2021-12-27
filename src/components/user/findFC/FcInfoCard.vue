<template>
  <section class="fcCard" @click="clickFCDetail(matchFCInfo.userKey)">
    <a>
      <div class="secHeader">
        <div class="avatar">
          <!-- <span class="avatar v-icon mdi mdi-account-circle"></span> -->
          <img
            :src="require(`@/assets/img/` + profileImage)"
            v-if="matchFCInfo.profileImage !== null"
          />
        </div>

        <div class="fcInfo1">
          <span class="name">{{
            matchFCInfo.personaDetailLogList[0].answerValue
          }}</span>
          <span class="other"
            >{{ matchFCInfo.personaDetailLogList[1].answerValue }} |
            {{ matchFCInfo.personaDetailLogList[2].answerValue }}</span
          >
        </div>

        <div class="fcPrsn">
          <dl>
            <dd>🎈{{ matchFCInfo.defaultPersonaInfo.name }}</dd>
            <dd>📍{{ matchFCInfo.lifeStylePersonaInfo.name }}</dd>
          </dl>
        </div>
      </div>
      <div class="secHashtags">
        <span
          v-for="(areaTag, areaTagIdx) in activityArea"
          :key="`area-tag-` + areaTagIdx"
        >
          {{ areaTag.answerValue }}
        </span>

        <span
          v-for="(licenseTag, licenseTagIdx) in license"
          :key="`license-tag-` + licenseTagIdx"
        >
          {{ licenseTag.answerValue }}
        </span>

        <span
          v-for="(specialtyTag, specialtyTagIdx) in specialty"
          :key="`specialty-tag-` + specialtyTagIdx"
        >
          {{ specialtyTag.answerValue }}
        </span>
      </div>
    </a>
  </section>
</template>

<script>
import FcInfoDetailMixin from '@/mixin/user/fc-info-detail-mixin'

export default {
  mixins: [FcInfoDetailMixin],
  data () {
    return {
    };
  },
  props: {
    matchFCInfo: {
      type: Object,
    }
  },
  created () {
    this.onSetFcInfo(this.matchFCInfo)
  },
  mounted () {
  },
  methods: {
    /**
     * 원하는 설계사 카드 클릭 시, 설계사 정보 디테일 화면으로 이동
     * @param userKey 설계사 키
     */
    clickFCDetail (userKey) {
      this.$router.push({ path: `/user/fcInformation/${userKey}` });
    },
  },
};
</script>