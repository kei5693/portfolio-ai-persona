<template>
  <div id="wrap" class="profile">
    <!-- S: 앱 헤더 -->
    <v-app-bar app class="center">
      <v-toolbar-title>프로필 선택</v-toolbar-title>
    </v-app-bar>
    <!-- E: 앱 헤더 -->

    <!-- S: 콘텐츠 -->
    <v-container>
      <h1>
        나를 가장 잘 표현하는<br />
        프로필을 고르세요!
      </h1>

      <div class="inner">
        <ul>
          <li
            v-for="(img, imgIdx) in imgList"
            :key="`profile-img-` + imgIdx + 1"
          >
            <label :for="img">
              <input
                type="radio"
                name="profile"
                :id="img"
                @click="profileChk($event)"
              />
              <img
                :src="require(`@/assets/img/` + img + `.png`)"
                class="off"
                :alt="img"
              />
              <img
                :src="require(`@/assets/img/` + img + `_on.png`)"
                class="on"
                :alt="img"
              />
            </label>
          </li>
        </ul>
      </div>

      <div
        class="confirmBox"
        :class="{ on: this.confirm }"
        @click="onClickCreateAccount"
      >
        <button type="button">
          <p>생성 완료</p>
        </button>
      </div>
    </v-container>
    <!-- E: 콘텐츠 -->
  </div>
</template>


<script>
import StorageUtils from '@/utils/storage-utils'
import Constant from "@/constant/Constant.js";
import PersonaMixin from '@/mixin/persona-mixin'

export default {
  mixins: [PersonaMixin],
  data () {
    return {
      confirm: false,
      selectedImg: "",
      imgList: ["profile01", "profile02", "profile03"],
    };
  },
  methods: {
    profileChk (event) {
      var targetAll = document.querySelectorAll("input[type=radio]"),
        target = event.currentTarget;

      targetAll.forEach(function (e) {
        e.closest("label").classList.remove("on");
      });

      target.closest("label").classList.add("on");

      this.selectedImg = target.id;
      this.confirm = true;
    },
    /**
     * 계정 생성 (API 통신)
     */
    onClickCreateAccount () {
      if (!this.confirm) {
        return;
      }

      var accountInfo = {
        id: this.$route.params.id,
        password: this.$route.params.pw,
        profileImg: `${this.selectedImg}_on.png`,
        userTypeKey: 2,
      };

      this.$connect("/user/join", "POST", accountInfo)
        .then((res) => {
          if (res.success) {
            StorageUtils.saveToken(res.body.info.token)

            this.$store.commit("setState", {
              key: "isLogin",
              value: true,
            });

            this.onGetUserInfo()
          }
        })
    },

    /**
     * 사용자 정보 조회
     * 
     * @method onGetUserInfo
     */
    onGetUserInfo () {
      this.$connect("/user", "GET").then(res => {
        this.$store.commit("setUserInfo", res.body.info.user);

        this.onSetRandomPersona('/user/feedMain', () => {
          this.$router.push({ path: `/user/personaAnalysis?startPage=${Constant.PERSONA_ANALYSIS_START_PAGE.ONLY_PERSONA_LV01}` });
        })
      });
    },
  },
};
</script>