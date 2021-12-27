<template>
  <div id="wrap" class="account fc">
    <!-- S: 앱 헤더 -->
    <commonHeader title="설계사 계정 생성"></commonHeader>
    <!-- E: 앱 헤더 -->

    <!-- S: 콘텐츠 -->
    <v-container>
      <h1 class="subject"></h1>
      <form>
        <label for="personaDepartment" class="personaDepartment">
          <p>소속</p>
          <input
            type="text"
            id="department"
            v-model="userDepartment"
            placeholder="소속"
            :class="{
              confirm: verifyDepartment !== null && verifyDepartment,
              err: verifyDepartment !== null && !verifyDepartment,
            }"
          />
          <span class="noticeDepartment">{{ errMsgDepartment }}</span>
        </label>

        <label for="personaID" class="personaID">
          <p>페르소나 코드(이메일 아이디)</p>
          <input
            type="text"
            id="userEmail"
            v-model="userEmail"
            placeholder="이메일"
            :class="{
              confirm: verifyEmail !== null && verifyEmail,
              err: verifyEmail !== null && !verifyEmail,
            }"
          />
          <span class="noticeId">{{ errMsgID }}</span>
        </label>

        <label for="personaPW" class="personaPW">
          <p>비밀번호</p>
          <input
            type="password"
            id="personaPW"
            v-model="userPassword"
            placeholder="영, 숫자 포함 최소 8자 이상 입력"
            :class="{
              confirm: verifyPassword !== null && verifyPassword,
              err: verifyPassword !== null && !verifyPassword,
            }"
          />
          <span class="noticePw">{{ errMsgPW }}</span>
          <input
            type="password"
            id="personaPwChk"
            v-model="userPasswordConfirm"
            placeholder="비밀번호 확인"
            :class="{
              confirm: verifyPasswordConfirm !== null && verifyPasswordConfirm,
              err: verifyPasswordConfirm !== null && !verifyPasswordConfirm,
            }"
          />
          <span class="noticePWchk">{{ errMsgPWConfirm }}</span>
        </label>
      </form>

      <div
        class="confirmBox"
        v-bind:class="{
          on:
            verifyEmail &&
            verifyPassword &&
            verifyPasswordConfirm &&
            verifyDepartment,
        }"
      >
        <div
          v-if="
            verifyEmail &&
            verifyPassword &&
            verifyPasswordConfirm &&
            verifyDepartment
          "
        >
          <button type="button" @click="onClickComplete">
            <p>생성 완료</p>
          </button>
        </div>
        <div v-else>
          <button type="button">
            <p>생성 완료</p>
          </button>
        </div>
      </div>
    </v-container>
    <!-- E: 콘텐츠 -->

    <popup-alert
      v-if="alert.isShow"
      :title="alert.title"
      :desc="alert.desc"
      @closeAlert="alert.callback"
    />
  </div>
</template>


<script>
import commonHeader from "@/components/include/HeaderWithBack";
import RULES from "@/context/form-rules";
import PopupAlert from "@/components/include/PopupAlert";
import Constant from "@/constant/Constant.js";
import StorageUtils from "@/utils/storage-utils";

export default {
  data () {
    return {
      userTypeKey: 1, // FC 회원 가입이므로 2번으로 고정(변경시 DB의 USER_TYPE 테이블 확인)
      errMsgID: "",
      errMsgPW: "",
      errMsgPWConfirm: "",
      errMsgDepartment: "",
      userDepartment: "",
      userEmail: "",
      userPassword: "",
      userPasswordConfirm: "",
      alert: {
        title: "",
        desc: "",
        isShow: false,
        callback: () => {
          this.alert.isShow = false;
        },
      },
    };
  },
  components: {
    commonHeader,
    PopupAlert,
  },
  computed: {
    verifyEmail () {
      return this.userEmail.length === 0
        ? null
        : RULES.regxEmail.test(this.userEmail);
    },
    verifyPassword () {
      return this.userPassword.length === 0
        ? null
        : RULES.regxPassword.test(this.userPassword);
    },
    verifyPasswordConfirm () {
      return this.userPasswordConfirm.length === 0
        ? null
        : this.userPassword === this.userPasswordConfirm;
    },
    verifyDepartment () {
      return this.userDepartment.length === 0 ? null : true;
    },
  },
  watch: {
    verifyEmail (status) {
      this.errMsgID =
        !status && this.userEmail.length > 0
          ? "잘못된 형식의 이메일 입니다."
          : "";
    },
    verifyPassword (status) {
      this.errMsgPW =
        !status && this.userPassword.length > 0
          ? "형식에 맞지 않는 비밀번호 입니다."
          : "";
    },
    verifyPasswordConfirm (status) {
      this.errMsgPWConfirm =
        !status && this.userPasswordConfirm.length > 0
          ? "비밀번호가 일치하지 않습니다."
          : "";
    },
    verifyDepartment (status) {
      this.errMsgDepartment =
        !status && this.userDepartment.length > 0
          ? "소속 형식이 올바르지 않습니다."
          : "";
    },
  },
  methods: {
    /**
     * 얼럿 띄우기
     *
     * @method onShowAlert
     * @param {String} title 제목
     * @param {String} desc 설명
     */
    onShowAlert (title = "", desc = "") {
      this.alert.isShow = true;
      this.alert.title = title;
      this.alert.desc = desc;
    },

    /**
     * 모든 정보 입력 후 생성 완료 클릭 이벤트
     *
     * @method onClickComplete
     */
    onClickComplete () {
      this.$connect(`/user/join/verification/id?id=${this.userEmail}`, "GET")
        .then((res) => {
          if (res.body.info.isVerificationId) {
            this.onUserJoin();
          } else {
            this.errMsgID = "등록 불가한 이메일 입니다.";
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    /**
     * 회원 가입
     *
     * @method onUserJosin
     */
    onUserJoin () {
      const formData = {
        id: this.userEmail,
        password: this.userPassword,
        profileImg: 1,
        department: this.userDepartment,
        userTypeKey: this.userTypeKey,
      };

      this.$connect("/user/join", "POST", formData)
        .then((res) => {
          console.log("회원 가입 결과: ", res);
          StorageUtils.saveToken(res.body.info.token);

          this.$store.commit("setUserInfo", {
            personaKey: 0,
            id: this.userEmail,
            name: "",
            userTypeKey: this.userTypeKey,
          });

          this.gotoPersonaAnalysis();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async gotoPersonaAnalysis () {
      const responseUserInfo = await this.$connect("/user", "GET");

      this.$store.commit("setUserInfo", responseUserInfo.body.info.user);

      this.$router.push({
        path: `/fc/personaAnalysis?startPage=${Constant.PERSONA_ANALYSIS_START_PAGE.ONLY_PERSONA_LV01}`,
      });
    },
  },
};
</script>