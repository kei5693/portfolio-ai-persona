<template>
  <div id="wrap" class="reserveList">
    <!-- S: 앱 헤더 -->
    <commonHeader :title="title"></commonHeader>
    <!-- E: 앱 헤더 -->

    <!-- S: 콘텐츠 -->
    <v-container>
      <div class="ifToast" v-if="ifToast === true">
        <router-link to="">
          <span>&lt; 예약 내역 전체 보기</span>
        </router-link>
      </div>
      <div class="revInfoBox">
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
                  <span>{{ consultInfo.toUserName }}</span>
                  <button
                    type="button"
                    class="infoBtn plannerInfo"
                    @click="fcInfoPopup(true)"
                  >
                    설계사 정보 보기
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <th>상담방법</th>
              <td>{{ consultInfo.type }}</td>
            </tr>
            <tr>
              <th>일정</th>
              <td>
                {{ consultInfo.dateWeekDay }}&nbsp;&nbsp;&nbsp;&nbsp;{{
                  consultInfo.timeRange
                }}
              </td>
            </tr>
            <tr>
              <th>예약자</th>
              <td>{{ this.$store.state.userInfo.name }}</td>
            </tr>
            <tr>
              <th>연락처</th>
              <td>
                <div class="flexBox">
                  <span>{{ consultInfo.phoneNumber }}</span>
                  <button
                    type="button"
                    class="infoBtn modify"
                    @click="userInfoPopup"
                  >
                    예약자 정보 변경
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <th>이메일</th>
              <td>{{ consultInfo.email }}</td>
            </tr>
            <tr>
              <th>요청사항</th>
              <td>
                <div class="reqText">
                  {{ consultInfo.subject }}<br />
                  {{ consultInfo.description }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="!isLastReservation">
        <div class="btnBox" v-if="consultInfo.state === 2">
          <a class="offGray" @click="clickCancel"> 예약 취소 </a>
        </div>

        <div 
          class="btnBox half"
          v-if="consultInfo.state === 1 || consultInfo.state === 4">
          <a class="offGray" @click="clickCancel"> 예약 취소 </a>
          <a class="offGray" @click="clickChange"> 예약 변경 </a>
        </div>

        <div class="comment"
          v-if="consultInfo.state === 1 || consultInfo.state === 2 || consultInfo.state === 4">
          본 화면에서 설계사 변경은 불가합니다.<br />
          설계사 변경을 원하시는 경우, 예약 취소 후 다시 예약 바랍니다.
        </div>
      </div>

      <div class="cause" v-if="consultInfo.state == 3">
        <p>❌ 취소 사유</p>
        <table class="table">
          <colGroup>
            <col width="100px" />
          </colGroup>
          <tbody>
            <tr>
              <th>상세 사유</th>
              <td>
                <div class="reqText">
                  {{ consultInfo.subjectCancel }}<br />
                  {{ consultInfo.descriptionCancel }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </v-container>
    <!-- E: 콘텐츠 -->

    <!-- S: 레이어 컨텐츠 -->
    <!-- 예약자 정보 변경 -->
    <div class="layer modifyUserInfo on" v-if="isPopupUserInfo">
      <div class="header">
        <div class="notUse"></div>
        <span class="textBlue">예약자 정보변경</span>
        <button type="button" @click="modifyCancel(true)">
          <img src="@/assets/img/closeBtn_x.svg" alt="" />
        </button>
      </div>

      <div class="content">
        <section>
          <div class="secTitle">예약자 정보</div>
          <div class="secBody">
            <ScheduleContentForm 
              :selectedMeetingInfo="scheduleInfo"
              @changeMeeting="changeMeeting" />
          </div>
        </section>

        <div class="confirmBox">
          <button type="button" @click="modifyUserInfo">
            <p>정보 변경하기</p>
          </button>
        </div>

        <div class="layerBox dark save on"
          v-if="isDoneUserInfo">
          <div class="layerContent">
            <div class="layerTitle">정보 변경 완료</div>
            <div class="layerText">예약자 정보 변경이 완료되었습니다.</div>
            <div class="btnBox">
              <button type="button" @click="modifyDone">확인</button>
            </div>
          </div>
        </div>

        <div class="layerBox dark noSave on"
          v-if="isCloseUserInfo">
          <div class="layerContent">
            <div class="layerTitle">정보 변경 취소</div>
            <div class="layerText">
              정보를 변경하지 않고<br />
              창을 닫으시겠습니까?
            </div>
            <div class="btnBox half">
              <button type="button" @click="modifyClose">예</button>
              <button type="button" @click="modifyCancel(false)">아니오</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 설계사 정보 팝업 -->
    <popupFcInfo
      v-if="isPopupFcInfo"
      @fcInfoClose="fcInfoPopup(false)"
      :userKey="consultInfo.toUserKey"
    />
  </div>
</template>

<script>
import commonHeader from "@/components/include/HeaderWithBack";
import ScheduleContentForm from "@/components/user/schedule/ScheduleContentForm";
import popupFcInfo from "@/components/include/PopupFCInfo";

export default {
  components: {
    commonHeader,
    ScheduleContentForm,
    popupFcInfo,
  },
  props:{
    isLastReservation: {
      type: Boolean,
      default: false,
    },
    consultKey: {
      type: Number,
      default: -1,
    },
    consultState: {
      type: Number,
      default: -1,
    },
  },
  data () {
    return {
      title: "",
      ifToast: false, // 토스트 팝업으로 접근시 true처리
      isPopupFcInfo: false,
      isPopupUserInfo: false,
      isCloseUserInfo: false,
      isDoneUserInfo: false,
      consultInfo: {},
      scheduleInfo: {
        phoneNumber: '',
        email: '',
        subject: '',
        subjectDetail: ''
      },
    };
  },
  mounted () {
    this.loadConsultInfo();

    if(this.consultState === 3){
      this.$set(this, "title", "취소 예약 내역")
    }
    else if(this.consultState === 5){
      this.$set(this, "title", "지난 예약 내역")
    }
    else{
      this.$set(this, "title", "예약 내역")
    }
  },
  methods: {
    /**
     * 예약 내역 불러오기
     * @param consultKey 예약 키
     */
    loadConsultInfo () {
      this.$connect(`/consultation/meeting/client/${this.consultKey}/one`, 'GET')
        .then((res => {
          this.consultInfo = res.body.info.consultationMeeting
          
          this.$set(this.scheduleInfo, "phoneNumber", this.consultInfo.phoneNumber)
          this.$set(this.scheduleInfo, "email", this.consultInfo.email)
          this.$set(this.scheduleInfo, "subject", this.consultInfo.subject)
          this.$set(this.scheduleInfo, "subjectDetail", this.consultInfo.description)
        }))
    },
    /**
     * 예약자 정보 수정하는 API 통신
     */
    modifyUserInfo () {
      var requestBody = {
        phoneNumber: this.scheduleInfo.phoneNumber,
        email: this.scheduleInfo.email,
        subject: this.scheduleInfo.subject,
        description: this.scheduleInfo.subjectDetail
      }

      this.$connect(`/consultation/meeting/client-info-modify/${this.consultKey}`, 'POST', requestBody, {}, {
        'content-type': 'application/json'
      })
        .then((res => {
          if(res.success){
            this.modifyClose();
          }
        }))
    },
    /**
     * ScheduleContentForm 컴포넌트에서 변경할 예약자 정보 입력한 값 받아오기
     * 
     * @param {Object} info 변경할 예약자 정보
     */
    changeMeeting(info){
      this.scheduleInfo = info
    },
    /**
     * 예약 취소 버튼 클릭 시
     */
    clickCancel () {
      this.$router.push({ path: `/user/scheduleCancel/${this.consultKey}`})
    },
    /**
     * 예약 변경 버튼 클릭 시
     */
    clickChange () {
      this.$router.push({ path: `/user/scheduleMake/${this.consultKey}`, query: { fcKey: this.consultInfo.toUserKey } });
    },
    /**
     * 설계사 정보 팝업 ON/OFF
     */
    fcInfoPopup (isFcInfo) {
      this.isPopupFcInfo = isFcInfo;
    },
    /**
     * 예약자 정보 변경 팝업 띄우기
     */
    userInfoPopup(){
      this.isPopupUserInfo = true;
    },
    /**
     * 예약자 정보 변경 레이어 팝업 닫기
     */
    modifyClose(){
      this.isPopupUserInfo = false;
      this.isCloseUserInfo = false;
      this.isDoneUserInfo = false;

      var wrapper = document.querySelector("html");
      wrapper.classList.remove("noScroll");

      this.loadConsultInfo();
    },
    /**
     * 예약자 정보 변경 취소하기 버튼 
     */
    modifyCancel(closePopup){
      this.isCloseUserInfo = closePopup
    },
    /**
     * 예약자 정보 수정하기 완료 팝업 오픈
     */
    modifyDone () {
      this.isDoneUserInfo = true
    },
  },
};
</script>