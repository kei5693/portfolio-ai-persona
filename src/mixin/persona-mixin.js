let PersonaMixin = {
  data () {
    return {

    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    /**
     * 퍼소나가 없을 경우 랜덤 퍼소나 적용
     * 
     * @method onSetRandomPersona 
     * @param {String} existPersonaRouterPath 퍼소나가 존재할 경우 이동할 라우터 경로
     * @param {Object} suffixCB 후처리 할 함수
     */
    onSetRandomPersona (existPersonaRouterPath, suffixCB) {
      if (this.$store.state.userInfo.personaKey !== undefined
        && this.$store.state.userInfo.personaKey !== null
        && this.$store.state.userInfo.personaKey > 0) {
        this.$router.push({ path: existPersonaRouterPath });
        return
      }

      this.onGetPersona(suffixCB)
    },

    /**
     * 퍼소나 목록 가져오기
     * 
     * @method onGetPersona
     * @param {Object} suffixCB 후처리 할 함수
     */
    onGetPersona (suffixCB) {
      this.$connect("/persona-set/persona", "GET").then(res => {
        if (res.success) {
          var personaKeyList = this._.chain(
            res.body.info.personaSetPersonaList
          )
            .filter((o) => o.personaParentKey == 0)
            .flatMap((o) => o.personaKey)
            .value();

          this.$store.commit(
            "setUserInfoPersonaKey",
            personaKeyList.splice(
              Math.floor(Math.random() * personaKeyList.length),
              1
            )[0]
          );

          suffixCB()
        }
      });
    },
  }
}

export default PersonaMixin