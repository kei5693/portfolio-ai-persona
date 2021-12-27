<template>
  <div id="wrap" class="login">
    <!-- S: 앱 헤더 -->
    <v-app-bar app> </v-app-bar>
    <!-- E: 앱 헤더 -->

    <!-- S: 콘텐츠 -->
    <v-container>
      <h1 class="subject">Fit-me</h1>

      <form>
        <label for="userId">
          <input
            type="text"
            id="userId"
            ref="userId"
            placeholder="페르소나 코드"
          />
        </label>
        <label for="userPw">
          <input
            type="password"
            id="userPw"
            ref="userPw"
            placeholder="비밀번호"
          />
        </label>

        <div class="loginUtil">
          <label for="autoLogin">
            <input type="checkbox" id="autoLogin" />
            <span>자동 로그인</span>
          </label>
          <div class="accountUtil">
            <router-link to="">코드 찾기</router-link>
            <router-link to="">비밀번호 찾기</router-link>
          </div>
        </div>
      </form>

      <div class="btnBox" @click="onClickLogin">
        <router-link to="">로그인</router-link>
      </div>
    </v-container>
    <!-- E: 콘텐츠 -->
  </div>
</template>



<script>
import StorageUtils from "@/utils/storage-utils";
// import TokenUtils from '@/utils/token-utils'
import PersonaMixin from '@/mixin/persona-mixin'

export default {
  mixins: [PersonaMixin],
  created () {
    StorageUtils.clear();
  },
  methods: {
    /**
     * 사용자 정보 조회
     * 
     * @method onGetUserInfo
     */
    onGetUserInfo () {
      this.$connect("/user", "GET").then(res => {
        console.log(">>> login user res", res);

        this.$store.commit("setUserInfo", res.body.info.user);

        this.onSetRandomPersona('/user/feedMain', () => {
          this.$router.push({ path: "/user/feedMain" });
        })
      });
    },

    /**
     * 로그인 버튼 클릭
     * 
     * @method onClickLogin
     */
    onClickLogin () {
      var email = this.$refs.userId.value;
      var pw = this.$refs.userPw.value;

      this.$connect("/login/user", "POST", { id: email, password: pw }).then(res => {
        if (res.success) {
          StorageUtils.saveToken(res.body.info.token);

          this.$store.commit("setState", {
            key: "isLogin",
            value: true,
          });

          this.onGetUserInfo()
        }
      });
    },
  },
};
</script>