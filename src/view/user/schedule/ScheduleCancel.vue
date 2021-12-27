<template>
  <div id="wrap" class="reserveList cancel">
    <!-- S: 앱 헤더 -->
    <commonHeader 
      title="예약 취소"
      @clickGoBack="clickGoBack" />
    <!-- E: 앱 헤더 -->

    <v-container>
      <!-- 예약 취소 > 예약 정보 -->
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
                    @click="fcInfoOpen"
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
              <td>{{ consultInfo.dateWeekDay }}&nbsp;&nbsp;{{ consultInfo.timeRange }}</td>
            </tr>

            <tr>
              <th>예약자</th>
              <td>{{ storeUserInfo.name }}</td>
            </tr>

            <tr>
              <th>연락처</th>
              <td>{{ consultInfo.phoneNumber }}</td>
            </tr>

            <tr>
              <th>이메일</th>
              <td>{{ consultInfo.email }}</td>
            </tr>

            <tr>
              <th>요청사항</th>
              <td>
                <div>
                  {{ consultInfo.subject }}<br />
                  {{ consultInfo.description }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 예약 취소 > 예약 취소 사유 -->
      <div class="causeInput">
        <div class="formInputBox">
          <p>예약을 취소하는 사유를 알려주세요!</p>
          <table class="table">
            <tbody>
              <tr>
                <td>
                  <select v-model="reasonSelected">
                    <option
                      v-for="(reason, reasonIdx) in cancelReason"
                      :value="reason"
                      :key="`reason-` + reasonIdx"
                    >
                      {{ reason }}
                    </option>
                  </select>
                </td>
              </tr>

              <tr>
                <td>
                  <label for="">
                    <textarea
                      v-model="reasonDetail"
                      name=""
                      id=""
                      placeholder="예약 취소 사유를 알려주세요."
                      @focusin="scrollEnd"
                    />
                  </label>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="confirmBox on">
        <button type="button" @click="clickCancelBtn">예약 취소</button>
      </div>
    </v-container>

    <popup-confirm
      v-if="isPopupConfirm"
      title="예약 취소"
      desc="정말로 예약을 취소하시겠습니까?"
      @confirmBtn="confirmBtn"
    />

    <popup-alert
      v-if="isPopupAlert"
      title="예약 취소 완료"
      desc="취소가 완료되었습니다."
      @closeAlert="closeAlert"
    />

    <!-- 설계사 정보 팝업 -->
    <popupFcInfo 
      v-if="isPopupFcInfo"
      @fcInfoClose="fcInfoClose"
      :userKey="consultInfo.toUserKey" />
  </div>
</template>

<script>
import StorageUtils from "@/utils/storage-utils";

import commonHeader from "@/components/include/HeaderWithBack";
import popupAlert from "@/components/include/PopupAlert";
import popupConfirm from "@/components/include/PopupConfirm";
import popupFcInfo from "@/components/include/PopupFCInfo";
import { mapGetters } from "vuex";

export default {
  components: {
    commonHeader,
    popupAlert,
    popupConfirm,
    popupFcInfo,
  },
  data() {
    return {
      consultInfo: {},
      cancelReason: ["설계사 변경", "기타 사유"],
      reasonSelected: "설계사 변경",
      reasonDetail: "",
      isPopupConfirm: false,
      isPopupAlert: false,
      isPopupFcInfo: false,
      userKey: 0
    };
  },
  props:{
    consultKey:{
      type: Number,
      default: -1
    }
  },
  created(){
    this.loadConsultInfo();
  },
  computed:{
    ...mapGetters({ storeUserInfo: "getUserInfo" }),
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
        }))
    },
    /**
     * 예약 상태 변경 API 호출 ( 예약 상태 : 취소로 변경 )
     */
    putMeetingCancel(){
      var requestBody = {
        subjectCancel: this.reasonSelected,
        descriptionCancel: this.reasonDetail,
        state: 3
      }
      this.$connect(`/consultation/meeting/${this.consultKey}`, 'PUT', requestBody, {}, { "x-token": StorageUtils.getToken() })
        .then(res => {
          if(res.success){
            this.isPopupAlert = true;
          }
        })
    },
    /**
     * 상단바에서 뒤로가기 버튼 클릭 시 동작하는 함수
     */
    clickGoBack(){
      this.$router.go(-1)
    },
    /**
     * 하단 > 예약 취소 버튼 클릭
     */
    clickCancelBtn() {
      if (this.reasonDetail == '') {
        alert("예약을 취소하는 사유를 입력해주세요.");
      }
      else {
        this.isPopupConfirm = true;
      }
    },
    /**
     * 팝업 버튼 선택 여부에 따라 예약 취소 로직 수행 여부 판단
     */
    confirmBtn(isConfirm) {
      this.isPopupConfirm = false;
      if (isConfirm) {
        this.putMeetingCancel()
      }
    },
    /**
     * 얼럿 팝업 닫기
     */
    closeAlert() {
      this.isPopupAlert = false;
      this.$router.push({ path: '/user/scheduleInquiry'})
    },
    /**
     * 설계사 정보 팝업 띄우기
     */
    fcInfoOpen() {
      this.isPopupFcInfo = true;
    },
    /**
     * 설계사 정보 팝업 닫기
     */
    fcInfoClose() {
      this.isPopupFcInfo = false;
    },
    scrollEnd() {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    },
  },
};
</script>