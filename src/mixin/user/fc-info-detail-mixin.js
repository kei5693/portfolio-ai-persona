let FcInfoDetailMixin = {
  data () {
    return {
      fcInfo: null,
      activityArea: [],
      license: [],
      career: [],
      specialty: [],
      discMeta: {},
      profileImage: 'profile01_on.png',
      profileImages: {
        0: 'profile03_on.png',
        '남성': 'profile01_on.png',
        '여성': 'profile02_on.png',
        '남자': 'profile01_on.png',
        '여자': 'profile02_on.png',
      }
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    /**
     * FC 정보 셋팅
     * 
     * @method onSetFcInfo
     * @param {Object} fcInfo FC 정보
     */
    onSetFcInfo (fcInfo = {}) {
      this.$set(this, 'fcInfo', fcInfo)
      this.onSetPersonaDetail()
    },

    /**
     * 퍼소나 정보 조회
     * 
     * @param {Number} userKey 사용자 키
     */
    onGetPersona (userKey) {
      this.$connect(`/user/persona/${userKey}`, 'GET').then((res => {
        this.$set(this, 'fcInfo', res.body.info.user)
        this.onSetPersonaDetail()
      }))
    },

    /**
     * 퍼소나 상세 정보 셋팅
     * 
     * @method onSetPersonaDetail
     */
    onSetPersonaDetail () {
      this.activityArea = this.fcInfo.personaDetailLogList.filter(o => JSON.parse(o.serveyMeta).globalSaveData == 'profile.activityArea')
      this.license = this.fcInfo.personaDetailLogList.filter(o => JSON.parse(o.serveyMeta).globalSaveData == 'profile.license')
      this.career = this.fcInfo.personaDetailLogList.filter(o => JSON.parse(o.serveyMeta).globalSaveData == 'profile.career')
      this.specialty = this.fcInfo.personaDetailLogList.filter(o => JSON.parse(o.serveyMeta).globalSaveData == 'profile.specialty')
      this.discMeta = JSON.parse(this.fcInfo.discMeta)
      const sexs = this.fcInfo.personaDetailLogList.filter(o => JSON.parse(o.serveyMeta).globalSaveData == 'profile.sex')

      this.profileImage = sexs.length === 0 ? this.profileImages[0] : this.profileImages[sexs[0].answerValue]
    }
  }
}

export default FcInfoDetailMixin