<template>
  <div id="wrap" class="account">
    <!-- S: 앱 헤더 -->
    <v-app-bar app class="center">
      <v-toolbar-title>계정생성</v-toolbar-title>
    </v-app-bar>
    <!-- E: 앱 헤더 -->

    <v-container>
      <h1 class="subject">Fit-me</h1>
      <form>
        <label for="personaID" class="personaID">
          <p>페르소나 코드(이메일 아이디)</p>
          <input
            type="text"
            id="personaID"
            ref="userId"
            v-model="userEmail"
            placeholder="이메일"
            :class="{
              confirm:
                verifyEmail !== null && verifyEmail && errMsgID.length == 0,
              err:
                (verifyEmail !== null && !verifyEmail) || errMsgID.length > 0,
            }"
          />
          <span class="noticeId">{{ errMsgID }}</span>
        </label>

        <label for="personaPW" class="personaPW">
          <p>비밀번호</p>
          <input
            type="password"
            id="personaPW"
            ref="userPw"
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
            ref="userPwChk"
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
        :class="{ on: verifyEmail && verifyPassword && verifyPasswordConfirm }"
        @click="onClickJoin"
      >
        <button type="button">
          <p>생성 완료</p>
        </button>
      </div>
    </v-container>
  </div>
</template>

<script>
import RULES from "@/context/form-rules";
import StorageUtils from "@/utils/storage-utils";

export default {
  data() {
    return {
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
      errMsgID: "",
      errMsgPW: "",
      errMsgPWConfirm: "",
    };
  },
  computed: {
    verifyEmail() {
      return this.userEmail.length === 0
        ? null
        : RULES.regxEmail.test(this.userEmail);
    },
    verifyPassword() {
      return this.userPassword.length === 0
        ? null
        : RULES.regxPassword.test(this.userPassword);
    },
    verifyPasswordConfirm() {
      return this.userPasswordConfirm.length === 0
        ? null
        : this.userPassword === this.userPasswordConfirm;
    },
  },
  watch: {
    verifyEmail(status) {
      this.errMsgID =
        !status && this.userEmail.length > 0
          ? "잘못된 형식의 이메일 입니다."
          : "";
    },
    verifyPassword(status) {
      this.errMsgPW =
        !status && this.userPassword.length > 0
          ? "형식에 맞지 않는 비밀번호 입니다."
          : "";
    },
    verifyPasswordConfirm(status) {
      this.errMsgPWConfirm =
        !status && this.userPasswordConfirm.length > 0
          ? "비밀번호가 일치하지 않습니다."
          : "";
    },
  },
  created() {
    StorageUtils.clear();
  },
  methods: {
    /**
     * 사용 가능한 이메일인지 체크하는 메서드
     *
     * @method onDuplicateEmailCheck
     * @param {Object} callbackCB 콜백
     */
    onDuplicateEmailCheck(callbackCB) {
      this.$connect(
        "/user/join/verification/id",
        "GET",
        {},
        { id: this.userEmail }
      ).then((res) => {
        if (!res.success) {
          return;
        }

        if (res.body.info.isVerificationId) {
          callbackCB();
        } else {
          this.errMsgID = "등록 불가한 이메일 입니다.";
        }
      });
    },

    /**
     * 프로필 이미지 선택하는 페이지로 이동
     */
    onClickJoin() {
      if (
        !this.verifyEmail ||
        !this.verifyPassword ||
        !this.verifyPasswordConfirm
      ) {
        return;
      }

      this.onDuplicateEmailCheck(() => {
        this.$router.push({
          name: "UserProfileSelect",
          params: { id: this.userEmail, pw: this.userPassword },
        });
      });
    },
  },
};
</script>
