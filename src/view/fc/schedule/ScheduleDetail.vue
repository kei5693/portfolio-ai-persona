<template>
  <div id="wrap" class="fcReserveList">
    <commonHeader title="예약 내역"></commonHeader>

    <v-container>
      <div class="revInfoCounselorBox">
        <h1><i class="mdi mdi-calendar-month-outline"></i> 예약 정보</h1>
        <table class="table">
          <colGroup>
            <col width="100px" />
          </colGroup>
          <tbody>
            <tr>
              <th>담당자</th>
              <td>
                <div class="flexBox">
                  <span>{{ consultingInfo.toUserName }} 설계사</span>
                </div>
              </td>
            </tr>
            <tr>
              <th>상담방법</th>
              <td>{{ consultingInfo.type }}</td>
            </tr>
            <tr>
              <th>일정</th>
              <td>{{ consultingInfo.dateWeekDay }}</td>
            </tr>
          </tbody>
        </table>
        <div class="btnBox">
          <button type="button" @click="onClickCreateMeetingRoom">
            미팅룸 링크 생성하기
          </button>
        </div>
      </div>
      <div class="revInfoCustomerBox pdb80">
        <h1>😍 고객 정보</h1>
        <table class="table">
          <colGroup>
            <col width="100px" />
          </colGroup>
          <tbody>
            <tr>
              <th>예약자</th>
              <td>{{ fromUserPersonaInfo.from_name }}</td>
            </tr>
            <tr>
              <th>연령대</th>
              <td>{{ fromUserPersonaInfo.from_age }}</td>
            </tr>
            <tr>
              <th>성별</th>
              <td>{{ fromUserPersonaInfo.from_sex }}</td>
            </tr>
            <tr>
              <th>페르소나</th>
              <td>
                <div>🎈{{ fromUserPersonaInfo.lifeStylePersonaInfo.name }}</div>
                <div>📍{{ fromUserPersonaInfo.discMeta.name }}</div>
                <div class="btnBox">
                  <button
                    type="button"
                    class="clearWhite"
                    @click="onClickPersonaInfo(consultingInfo.fromUserKey)"
                  >
                    페르소나 특성 확인하기 →
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <th>연락처<br />(안심번호)</th>
              <td>
                <div class="tel">
                  {{ consultingInfo.phoneNumber }}
                  <a :href="`tel:${consultingInfo.phoneNumber}`" class="telBtn"
                    >전화걸기</a
                  >
                </div>
              </td>
            </tr>
            <tr>
              <th>이메일</th>
              <td>{{ consultingInfo.email }}</td>
            </tr>
            <tr>
              <th>요청사항</th>
              <td>
                <ul>
                  <li>{{ consultingInfo.subject }}</li>
                  <li>{{ consultingInfo.description }}</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div 
        class="btnMenu"
        @click="onClickConsultConfirm"
        v-if="consultingInfo.state === 1"> 
        <button type="button" class="confirmBtn">예약 확정</button>
      </div>
    </v-container>

    <!-- S: 레이어 팝업 -->
    <div
      class="layerBox dark simpleType urlCopy"
      :class="{ on: popupCopy.isPopupCopy }"
    >
      <div class="layerContent">
        <div class="titleBox">
          <h4>미팅룸 링크 생성</h4>
          <p>
            상담 시간 전 고객님께 미팅룸 링크를 전달하고 화상 상담을 진행하세요.
          </p>
        </div>
        <div class="content">
          <ul>
            <li class="ulTitle">미팅룸 링크</li>
            <li>
              <span>https://us02web.xoom.us/j/203854230952</span>
            </li>
            <li>
              <button
                type="button"
                @click="
                  onClickCopyLink(
                    'kakao',
                    'https://us02web.xoom.us/j/203854230952'
                  )
                "
              >
                카카오톡
              </button>
              <button
                type="button"
                @click="
                  onClickCopyLink(
                    'copy',
                    'https://us02web.xoom.us/j/203854230952'
                  )
                "
              >
                링크복사
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div class="closeBtn">
        <button type="button" @click="onClickCopyClose">
          <img src="@/assets/img/layerCloseBtn.png" alt="" />
        </button>
      </div>
    </div>

    <div
      class="layerBox dark simpleType copyDone"
      :class="{ on: popupCopy.isPopupCopyComplete }"
    >
      <div class="layerContent">
        <div class="titleBox">
          <h4>링크가 복사되었습니다.</h4>
        </div>
        <div class="btnBox">
          <button type="button" @click="onClickCopyOk">확인</button>
        </div>
      </div>
    </div>
    <!-- E: 레이어 팝업 -->

    <fcCommonFooter crtPage="rsv"></fcCommonFooter>
  </div>
</template>

<script>
import commonHeader from '@/components/include/HeaderWithBack'
import fcCommonFooter from '@/components/include/FcCommonFooter'

export default {
  components: {
    commonHeader,
    fcCommonFooter,
  },
  data () {
    return {
      popupCopy: {
        isPopupCopyComplete: false,
        isPopupCopy: false,
      },
      consultingKey: 0,
      consultingInfo: {
        type: '',
        dateWeekDay: '',
        phoneNumber: '',
        email: '',
        subject: '',
        description: '',
      },
      fromUserPersonaInfo: {
        from_name: '',
        from_age: '',
        from_sex: '',
        defaultPersonaInfo: {
          name: '',
          meta: {
            keyword: '',
            lifeStyleFactor: '',
            slogan: '',
            specificity: ''
          }
        },
        lifeStylePersonaInfo: {
          name: '',
          meta: {
            keyword: '',
            lifeStyleFactor: '',
            slogan: '',
            specificity: ''
          }
        },
        discMeta: {
          name: '',
        }
      },
      fromUserProfileKey: ['profile.name', 'profile.sex', 'profile.age'],
    }
  },
  created () {
    this.consultingKey = this.$route.params.consultingKey

    this.onGetConsultingInfo(this.consultingKey)
  },
  mounted () {
    this.scrollTop()
  },
  methods: {

    /**
     * 컨설팅 정보 가져오기
     * 
     * @method onGetConsultingInfo
     * @param {Number} consultingKey 컨설팅 키
     */
    async onGetConsultingInfo (consultingKey) {
      const response = await this.$connect(`/consultation/meeting/planner/${consultingKey}/one`, 'GET')

      this.consultingInfo = JSON.parse(JSON.stringify(response.body.info.consultationMeeting))
      console.log('컨설팅 정보: ', this.consultingInfo)

      this.onGetFromUserPersonaInfo(this.consultingInfo.fromUserKey)
    },

    /**
     * 퍼소나 정보 가져오기
     * 
     * @method onGetUserPersonaInfo
     * @param {Number} userKey 사용자 키
     */
    async onGetFromUserPersonaInfo (userKey) {
      const response = await this.$connect(`/user/persona/${userKey}`, 'GET')

      this.fromUserPersonaInfo = JSON.parse(JSON.stringify(response.body.info.user))

      this.fromUserPersonaInfo.personaDetailLogList.forEach(o => {
        const metaDatas = this.fromUserProfileKey.filter(v => v === JSON.parse(o.serveyMeta).globalSaveData)
        if (metaDatas.length !== 0) {
          this.$set(this.fromUserPersonaInfo, metaDatas[0].replace('profile.', 'from_'), o.answerValue)
        }
      })

      this.fromUserPersonaInfo.discMeta = typeof this.fromUserPersonaInfo.discMeta === 'object'
        ? this.fromUserPersonaInfo.discMeta
        : JSON.parse(this.fromUserPersonaInfo.discMeta);

      console.log('From 사용자 퍼소나 정보: ', this.fromUserPersonaInfo)
    },

    /**
     * 퍼소나 정보보기
     * 
     * @method onClickPersonaInfo
     * @param {Number} fromUserKey 사용자 키
     */
    onClickPersonaInfo (fromUserKey) {
      this.$router.push({ path: `/fc/scheduleUserPersonaInfo/${fromUserKey}` })
    },

    /**
     * 미팅 룽 생성 클릭
     * 
     * @method onClickCreateMeetingRoom
     */
    onClickCreateMeetingRoom () {
      this.popupCopy.isPopupCopy = true
    },

    /**
     * 미팅 룸 링크 복사 클릭
     * 
     * @method onClickCopyLink
     * @param {String} copyType 복사 할 타입
     * @param {String} copyLink 복사 할 링크
     */
    onClickCopyLink (copyType = '', copyLink = '') {
      console.log('미팅 룸 링크 복사: ', copyType, copyLink)

      this.popupCopy.isPopupCopy = false
      this.popupCopy.isPopupCopyComplete = true
    },

    /**
     * 미팅 룸 링크 복사 완료
     * 
     * @method onClickCopyOk
     */
    onClickCopyOk () {
      this.popupCopy.isPopupCopyComplete = false;
    },

    /**
     * 미팅룸 링크 팝업창 닫기
     *
     * @method onClickCopyClose
     */
    onClickCopyClose () {
      this.popupCopy.isPopupCopy = false
    },
    /**
     * 예약 확정 버튼 클릭 이벤트 동작 ( state 2 - 수락 )
     * 
     * @method onClickConsultConfirm
     */
    onClickConsultConfirm(){
      this.$connect(`/consultation/meeting/${this.consultingKey}`, 'PUT', { state: 2 }).then(res => {
        if(res.success){
          this.$router.go(-1)
        }
      });
    }
  },
};
</script>