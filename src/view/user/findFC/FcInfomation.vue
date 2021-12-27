<template>
  <div id="wrap" class="fcInformation">
    <!-- S: 앱 헤더 -->
    <commonHeader
      title="설계사 정보"
      :router-path="backRouterPath"
    ></commonHeader>
    <!-- E: 앱 헤더 -->

    <!-- S: 콘텐츠 -->
    <v-container>
      <div class="conetent" v-if="fcInfo !== null">
        <div class="avatarBox">
          <div class="avatarImg">
            <!-- <span class="avatar v-icon mdi mdi-account-circle"></span> -->
            <img :src="require(`@/assets/img/` + profileImage)" />
          </div>
        </div>
        <div class="fcHeader">
          <div class="infoBox">
            <div class="fcInfo1">
              <span class="name">{{
                fcInfo.personaDetailLogList[0].answerValue
              }}</span>
              <span class="other"
                >{{ fcInfo.personaDetailLogList[1].answerValue }} |
                {{ fcInfo.personaDetailLogList[2].answerValue }}</span
              >
            </div>

            <div class="fcPrsn">
              <dl>
                <dd>🎈 {{ fcInfo.defaultPersonaInfo.name }}</dd>
                <dd>
                  📍 {{ discMeta.tag }}&nbsp;&nbsp;{{
                    fcInfo.lifeStylePersonaInfo.name
                  }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="fcBody">
          <section class="cnt01">
            <div class="secTitle">😀 어떤 사람일까요?</div>
            <div class="secContents">
              <div class="textBox">
                {{ discMeta.tendencyFactor }}<br /><br />
                {{
                  JSON.parse(fcInfo.lifeStylePersonaInfo.meta).lifeStyleFactor
                }}
              </div>
            </div>
          </section>

          <section class="cnt02">
            <div class="secTitle">🏆 저의 역량은요!</div>
            <div class="secContents">
              <div class="textBox">
                <table class="table">
                  <colGroup>
                    <col width="85px" />
                  </colGroup>
                  <tbody>
                    <tr>
                      <th>📍 활동지역</th>
                      <td>
                        <span
                          v-for="(areaTag, areaTagIdx) in activityArea"
                          :key="`area-tag-` + areaTagIdx"
                        >
                          {{ areaTag.answerValue }}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <th>🥇자격증</th>
                      <td>
                        <div class="certiBox">
                          <template v-for="(item, index) in license">
                            <dl
                              v-if="item.answerValue == '자격증없음'"
                              :key="`license-${index}`"
                            >
                              자격증없음
                            </dl>

                            <dl
                              class="certificate_CIC on"
                              v-if="item.answerValue == '우수인증설계사'"
                              :key="`license-${index}`"
                            >
                              <dt>
                                <span class="certi_Bg"></span>
                              </dt>
                              <dd>우수인증<br />설계사</dd>
                            </dl>

                            <dl
                              class="certificate_MDRT on"
                              v-if="item.answerValue == 'MDRT'"
                              :key="`license-${index}`"
                            >
                              <dt>
                                <span class="certi_Bg"></span>
                              </dt>
                              <dd>MDRT</dd>
                            </dl>

                            <dl
                              class="certificate_AFPK on"
                              v-if="item.answerValue == 'AFPK'"
                              :key="`license-${index}`"
                            >
                              <dt>
                                <span class="certi_Bg"></span>
                              </dt>
                              <dd>AFPK</dd>
                            </dl>

                            <dl
                              class="certificate_CFP on"
                              v-if="item.answerValue == 'CFP'"
                              :key="`license-${index}`"
                            >
                              <dt>
                                <span class="certi_Bg"></span>
                              </dt>
                              <dd>CFP</dd>
                            </dl>
                          </template>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <th>💼 경력</th>
                      <td>
                        <span
                          v-for="(careerTag, careerTagIdx) in career"
                          :key="`career-tag-` + careerTagIdx"
                        >
                          {{ careerTag.answerValue }}
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <th>🧾 주 상담분야</th>
                      <td>
                        <span
                          v-for="(specialtyTag, specialtyTagIdx) in specialty"
                          :key="`specialty-tag-` + specialtyTagIdx"
                        >
                          {{ specialtyTag.answerValue }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p>
                  * 모든 보장상담이 가능하지만, 더 자세한 상담이 가능한
                  분야입니다.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div class="confirmBox on" @click="clickReserveBtn">
          <router-link to="">
            <p>예약하기</p>
          </router-link>
        </div>
      </div>
    </v-container>
    <!-- E: 콘텐츠 -->
  </div>
</template>

<script>
import commonHeader from "@/components/include/HeaderWithBack";
import FcInfoDetailMixin from '@/mixin/user/fc-info-detail-mixin'

export default {
  mixins: [FcInfoDetailMixin],
  data () {
    return {
      prevRouteName: '',
      backRouterPath: '',
    };
  },
  components: {
    commonHeader,
  },
  mounted () {
    this.onSetBackRouterPath()
    this.onGetPersona(this.$route.params.fcUserKey)
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.prevRouteName = from.name
    });
  },
  methods: {
    /**
     * 뒤로가기 시 이동할 라우터 주소 셋팅
     * 
     * @method onSetBackRouterPath
     */
    onSetBackRouterPath () {
      this.backRouterPath = this.prevRouteName === 'UserMatchingList' ? '/user/scheduleInquiry' : '/user/matchingFC'
    },
    /**
     * 상담 예약하기 페이지로 이동
     */
    clickReserveBtn () {
      if(this.prevRouteName === 'UserMatchingList'){
        this.$router.push({ path: `/user/scheduleMake/-100`, query: { fcKey: this.fcInfo.userKey } });
      }
      else{
        this.$router.push({ name: 'UserScheduleMake', query: { fcKey: this.fcInfo.userKey } });
      }
    }
  },
};
</script>