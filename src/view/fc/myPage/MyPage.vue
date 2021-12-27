<template>
  <div id="wrap" class="mypMain fc">
    <!-- S: 앱 헤더 -->
    <commonHeaderFcFeedPsn></commonHeaderFcFeedPsn>
    <!-- E: 앱 헤더 -->

    <!-- S: 콘텐츠 -->
    <v-container>
      <div class="psnUserInfo">
        <div class="left">
          <p class="affiliation">{{ department }}</p>
          <div class="info1">
            <span class="name">{{ profiles[0].value[0] }} <i>설계사</i></span>
          </div>
          <div class="info2">
            <span
              >{{ profiles[1].value[0] }} <i>|</i>
              {{ profiles[4].value[0] }}</span
            >
            <!--<i></i>
            <span>생일 {{ birthDay }}</span>-->
          </div>
        </div>
        <div class="right">
          <div class="info4">
            <dl class="married">
              <dd>
                <figure>
                  <img
                    src="https://via.placeholder.com/120x120/375989/?text=single"
                    alt=""
                  />
                </figure>
              </dd>
              <dt>{{ profiles[2].value[0] }}</dt>
            </dl>
            <dl class="hasChild" v-if="profiles[3].value.length !== 0">
              <dd>
                <figure>
                  <img
                    src="https://via.placeholder.com/120x120/375989/?text=noKids"
                    alt=""
                  />
                </figure>
              </dd>
              <dt>{{ profiles[3].value[0] }}</dt>
            </dl>
          </div>
          <!-- todo: 링크 연결 -->
        </div>
        <div class="bottom">
          <div class="agentInfo">
            <table class="table">
              <tbody>
                <tr>
                  <th>업무경력</th>
                  <td>{{ profiles[5].value[0] }}</td>
                </tr>
                <tr>
                  <th>보유자격</th>
                  <td>{{ profiles[6].value | arrayToCommaStr }}</td>
                </tr>
                <tr>
                  <th>주요분야</th>
                  <td>{{ profiles[7].value | arrayToCommaStr }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="btnBox">
            <button type="button" class="clearWhite">프로필 업데이트</button>
          </div>
        </div>
      </div>

      <div class="pdBox016" v-if="userInfo !== undefined">
        <div class="psnResultBox">
          <p class="psnResultTitle pd20">👉 나의 메인 페르소나는</p>
          <div class="personaMain pd20">
            <p class="personaName">{{ userInfo.defaultPersonaInfo.name }}</p>
            <p class="hashTags">
              <span>{{ userInfo.defaultPersonaInfo.meta.keyword }}</span>
            </p>
            <figure>
              <img
                :src="
                  require(`@/assets/img/personaImg/defaultPersonaKey${userInfo.defaultPersonaKey}.png`)
                "
                :alt="userInfo.defaultPersonaInfo.name"
              />
            </figure>
            <finDiagnosis nowPage="Main" />
          </div>
          <div class="samePersona pd20">
            <!-- todo: 링크 처리 -->
            <a @click="onClickPersonaDetail">
              <div class="left">
                <div class="samePersonaTitle">😄 나와 같은 페르소나는</div>
                <div class="samePersonaCount">
                  <span>{{ dummyDuplicatePeronaUser | comma }}</span
                  >명 이에요!
                </div>
              </div>
              <div class="right">
                내 페르소나<br />
                자세히 보기
              </div>
            </a>
          </div>
        </div>
      </div>

      <div class="pdBox016 pdb80">
        <TabMoveContent
          v-if="userInfo !== undefined"
          :defaultPersona="userInfo.defaultPersonaInfo.name"
          :clickeRouterPath="'/fc/feedMain'"
          :routerParam="{
            defaultPersonaKey: userInfo.defaultPersonaKey,
            lifeStylePersonaKey: userInfo.lifeStylePersonaKey,
          }"
          :contentTotalCount="contentTotalCount"
        />
      </div>

      <div class="floatingBtnBox">
        <button type="button" class="topBtn" @click="scrollTop">Top</button>
      </div>
    </v-container>
    <!-- E: 콘텐츠 -->

    <commonFooter crtPage="myp"></commonFooter>
  </div>
</template>

<script>
import commonHeaderFcFeedPsn from "@/components/include/FcAgentHeader";
import commonFooter from "@/components/include/FcCommonFooter";
import TabMoveContent from "@/components/include/TabMoveContent";
import FinDiagnosis from "@/components/user/myPage/FinDiagnosis";

export default {
  data () {
    return {
      drawer: null,
      userInfo: undefined,
      department: "",
      discInfo: {},
      contentTotalCount: 0,
      dummyDuplicatePeronaUser:
        Math.floor(Math.random() * (400000 - 300000 + 1)) + 300000,
      profiles: [
        { key: "profile.name", name: "이름", value: [] },
        { key: "profile.sex", name: "성별", value: [] },
        { key: "profile.married", name: "결혼유무", value: [] },
        { key: "profile.children", name: "자녀유무", value: [] },
        { key: "profile.age", name: "나이", value: [] },
        { key: "profile.career", name: "경력", value: [] },
        { key: "profile.license", name: "보유자격", value: [] },
        { key: "profile.specialty", name: "주요분야", value: [] },
        { key: "profile.activityArea", name: "활동지역", value: [] },
      ],
    };
  },
  components: {
    commonHeaderFcFeedPsn,
    commonFooter,
    TabMoveContent,
    FinDiagnosis,
  },
  created () {
    this.onGetUserInfo();
  },
  methods: {
    scrollTop () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    /**
     * 사용자 정보 조회
     *
     * @method onGetUserInfo
     */
    async onGetUserInfo () {
      const response = await this.$connect("/user/persona", "GET");

      const responseInfo = response.body.info.user;
      this.$store.commit("setUserInfoMyP", responseInfo);

      this.contentTotalCount = response.body.info.contentTotalCount;

      const userInfo = this._.cloneDeep(responseInfo)
      this.department = userInfo.department;
      this.$set(this, "userInfo", userInfo);
      this.$set(this.userInfo, "contentTotalCount", this.contentTotalCount);
      this.$set(this, "discInfo", JSON.parse(userInfo.discMeta));

      this.userInfo.defaultPersonaInfo.meta = typeof this.userInfo.defaultPersonaInfo.meta === 'object'
        ? this.userInfo.defaultPersonaInfo.meta
        : JSON.parse(this.userInfo.defaultPersonaInfo.meta)

      if (this.userInfo.lifeStylePersonaInfo !== null) {
        this.userInfo.lifeStylePersonaInfo.meta = typeof this.userInfo.lifeStylePersonaInfo.meta === 'object'
          ? this.userInfo.lifeStylePersonaInfo.meta
          : JSON.parse(this.userInfo.lifeStylePersonaInfo.meta)
      }

      console.log("사용자 정보: ", this.userInfo);

      this.onSetPersonaDetailLog(userInfo);
    },

    /**
     * 퍼소나 디테일 로그 셋팅
     *
     * @method onSetPersonaDetailLog
     * @param {Object} userInfo 사용자 정보
     */
    onSetPersonaDetailLog (userInfo) {
      const personaDetailLogs = userInfo.personaDetailLogList.map((o) => {
        o.serveyMeta = JSON.parse(o.serveyMeta);

        return o;
      });

      this.profiles.forEach((o) => {
        const key = o.key;
        o.value = personaDetailLogs
          .filter((o2) => o2.serveyMeta.globalSaveData === key)
          .map((o3) => o3.answerValue);
      });
    },

    /**
     * 퍼소나 상세 페이지 이동
     *
     * @method onClickPersonaDetail
     */
    onClickPersonaDetail () {
      this.$router.push({ path: '/fc/myPageDetail' })
    },
  },
};
</script>