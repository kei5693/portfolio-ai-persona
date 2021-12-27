<template>
  <div id="wrap" class="reserve">
    <!-- S: 앱 헤더 -->
    <commonHeader title="상담 예약" @clickGoBack="onClickGoBack" />
    <!-- E: 앱 헤더 -->

    <!-- S: 콘텐츠 -->
    <v-container>
      <div class="reserveBox">
        <ul class="menuList">
          <li
            :class="{ on: reserveData == 1, complete: reserveType !== '' }"
            @click="onGotoPage(reserveData == 1, 1)"
          >
            <span>상담 방법 선택</span><em>{{ reserveType }}</em>
          </li>

          <li
            :class="{ on: reserveData == 2, complete: reserveDate !== '' }"
            @click="onGotoPage(reserveData == 2, 2)"
          >
            <span>예약일</span
            ><em>
              {{ reserveDate }}
            </em>
          </li>

          <li
            :class="{ on: reserveData == 3, complete: reserveInfo !== '' }"
            @click="onGotoPage(reserveData == 3, 3)"
          >
            <span>예약 정보 확인</span><em>{{ reserveInfo }}</em>
          </li>
        </ul>

        <ScheduleMainTab01
          v-if="reserveData == 1"
          :selectedConsultData="selectedConsultData"
          @changeSelectedConsultData="changeSelectedConsultData"
        />
        <ScheduleMainTab02
          v-if="reserveData == 2"
          :selectedConsultData="selectedConsultData"
          @changeSelectedConsultData="changeSelectedConsultData"
        />
        <ScheduleMainTab03
          v-if="reserveData == 3"
          :reserveType="reserveType"
          :selectedConsultData="selectedConsultData"
          :reserveConfirmLayer="reserveConfirmLayer"
        />

        <div
          class="confirmBox"
          :class="{ on: setBtnColor }"
          @click="onClickNextStage"
        >
          <button type="button">
            <p>{{ bottomBtnTxt }}</p>
          </button>
        </div>

        <!-- 써머리 레이어팝업 -->
        <div
          ref="reserveInfoToggleBox"
          class="reserveInfoToggleBox"
          :class="{ on: toggleBox }"
          v-if="isChangeMeeting"
        >
          <div class="toggleCont">
            <h4>변경된 예약 정보</h4>
            <table>
              <colgroup>
                <col style="width: 80px" />
                <col />
              </colgroup>
              <tbody>
                <tr>
                  <th scope="row">담당자</th>
                  <td>{{ defaultMeetingInfo.toUserName }}</td>
                </tr>
                <tr>
                  <th scope="row">상담방법</th>
                  <td>{{ reserveType }}</td>
                </tr>
                <tr>
                  <th scope="row">일정</th>
                  <td>
                    {{ selectedConsultData.dateWeekDay }}&nbsp;&nbsp;{{
                      selectedConsultData.timeRange
                    }}
                  </td>
                </tr>
              </tbody>
            </table>

            <button type="button" @click="showDefaultInfo()">
              기존 예약 내역 보기
            </button>
          </div>
          <button type="button" @click="toggleMenu()">닫기</button>
        </div>
        <!-- //써머리 레이어팝업 -->

        <!-- S: 레이어 -->
        <div class="layerBox dark" v-if="isReserveInfo">
          <div class="layerContent reserveConfirmLayer">
            <div class="infoBox">
              <h3>🗓 예약 정보</h3>
              <ScheduleContentConfirm
                :reserveType="defaultMeetingInfo.type"
                :selectedConsultData="defaultMeetingInfo"
              />
            </div>
            <div class="btnBox">
              <button type="button" @click="showDefaultInfo()">확인</button>
            </div>
          </div>
        </div>

        <!-- 예약 변경 완료 -->
        <popup-alert
          v-if="isShowPopup"
          :title="popupTitle"
          :desc="popupDesc"
          @closeAlert="alertPopupClose"
        />

        <!-- 예약 변경 팝업 -->
        <popup-confirm
          v-if="alertLayer"
          title="예약 변경"
          desc="등록하신 내용으로<br>예약을 변경하시겠습니까?"
          @confirmBtn="alertLayerClose"
        />

        <!-- 예약 변경 취소 -->
        <popup-confirm
          v-if="alertLayer"
          title="예약 변경 취소"
          desc="예약 변경을 그만두시겠습니까?<br>작성된 내용은 저장되지않습니다."
          @confirmBtn="alertLayerClose"
        />

        <popup-confirm
          v-if="isReserveCancel"
          title="예약을 그만하시겠습니까?"
          desc="페이지를 벗어나면<br>진행 중인 예약이 취소됩니다."
          @confirmBtn="onReserveCancel"
        />
      </div>
    </v-container>
    <!-- E: 콘텐츠 -->
  </div>
</template> 
<script>
import commonHeader from "@/components/include/HeaderWithBack";
import ScheduleMainTab01 from "@/components/user/schedule/ScheduleMainTab01";
import ScheduleMainTab02 from "@/components/user/schedule/ScheduleMainTab02";
import ScheduleMainTab03 from "@/components/user/schedule/ScheduleMainTab03";
import ScheduleContentConfirm from "@/components/user/schedule/ScheduleContentConfirm";
import popupAlert from "@/components/include/PopupAlert";
import popupConfirm from "@/components/include/PopupConfirm";
import { mapGetters } from "vuex";
import dayjs from "dayjs";

export default {
  components: {
    commonHeader,
    ScheduleMainTab01,
    ScheduleMainTab02,
    ScheduleMainTab03,
    ScheduleContentConfirm,
    popupAlert,
    popupConfirm,
  },
  data() {
    return {
      isPopupConfirm: false,
      isPopupAlert: false,
      isReserveCancel: false,
      popupTitle: "", // 팝업 제목
      popupDesc: "", // 팝업 내용
      reserveData: 1, // Step Index
      fcKey: 0,
      selectedConsultData: {}, // 선택된 예약 정보
      reserveConfirmLayer: false, // 예약 완료 버튼 클릭 시 true 로 변경

      isChangeMeeting: false, // 예약 변경하기 여부
      defaultMeetingInfo: {}, // 서버에 저장된 예약 정보

      toggleBox: false,
      isReserveInfo: false,
      isToggleBox: false, // 하단 써머리 팝업
      alertLayer: false, // 레이어 팝업 토글
      isShowPopup: false,
    };
  },
  props: {
    consultKey: { type: Number, default: -1 },
  },
  computed: {
    ...mapGetters({ storeUserInfo: "getUserInfo" }),
    /**
     * 예약 수정 모드 확인
     */
    isChangeScheduleMode() {
      return this.consultKey >= 0 ? true : false;
    },
    reserveType() {
      return this.selectedConsultData.type === undefined ? '' : this.selectedConsultData.type;
    },
    reserveDate() {
      return this.selectedConsultData.dateWeekDay === undefined
        ? ''
        : this.selectedConsultData.dateWeekDay;
    },
    reserveInfo() {
      return this.reserveData == 3 ? "선택완료" : "";
    },
    /**
     * 하단 버튼 텍스트 지정
     */
    bottomBtnTxt() {
      var text = "";

      if (this.reserveData == 1) {
        text = "다음";
      } else if (this.reserveData == 2) {
        text = "선택 완료";
      } else if (this.reserveData == 3) {
        text = this.isChangeScheduleMode ? "예약 변경하기" : "예약하기";
      }

      return text;
    },
    /**
     * 하단 버튼 색상 변경 (On/Off)
     */
    setBtnColor() {
      var isSelected = false;

      if (
        this.reserveData == 1 && 
        this.selectedConsultData.type !== undefined &&
        this.selectedConsultData.type !== "" 
      ) {
        isSelected = true;
      }
      else if (
        this.reserveData == 2 &&
        this.selectedConsultData.dateCode !== '' &&
        this.selectedConsultData.timeCodes !== undefined &&
        this.selectedConsultData.timeCodes.length > 0 &&
        this.selectedConsultData.phoneNumber !== undefined &&
        this.selectedConsultData.phoneNumber !== '' &&
        this.selectedConsultData.email !== '' &&
        this.selectedConsultData.subject !== undefined
      ) {
        isSelected = true;
      } 
      else if (
        this.reserveData == 3 &&
        this.selectedConsultData.timeCodes.length > 0
      ) 
      {
        isSelected = true;
      }

      return isSelected;
    },
    /**
     * 탭마다 상담 정보를 입력했는지 길이로 체크
     */
    checkForStepList() {
      return [
        this.reserveType.length,
        this.reserveDate.length,
        this.reserveInfo.length,
      ];
    },
  },
  watch: {
    isToggleBox(newVal) {
      if (newVal === true) {
        setTimeout(() => {
          this.onScrollEnd();
        }, 100);
      } else {
        this.$refs.wrap.style.paddingBottom = "0px";
      }
    },
  },
  created() {
    if (this.$route.query.fcKey !== undefined) {
      this.fcKey = this.$route.query.fcKey;
    }

    if(this.consultKey >= 0){
      this.getConsultInfo();
    }
  },
  mounted() {
    this.scrollTop();
  },
  methods: {
    /**
     * 상단 탭의 날짜 -> UI 에 뿌려줄 형태로 가공
     */
    showDayString(date) {
      if (date === "") {
        return;
      }

      var week = ["일", "월", "화", "수", "목", "금", "토"];
      var dayOfWeek = week[dayjs(date).format('d')];
    
      return `${dayjs(date).format('YYYY.MM.DD')} ${dayOfWeek}`;
    },
    /**
     * selectedConsultData 정보 수정
     *
     * @method changeSelectedConsultData
     */
    changeSelectedConsultData(data) {
      this.$set(this.selectedConsultData, data.key, data.value);

      if (data.key == "dateCode") {
        this.$set(
          this.selectedConsultData,
          "dateWeekDay",
          this.showDayString(data.value)
        );
      }
      if (data.key == "timeCodes") {
        this.$set(
          this.selectedConsultData,
          "timeRange",
          this._.chain(data.value)
            .sortBy()
            .reduce((result, data, idx, arr) => {
              if (idx == 0) {
                result.push(data);
              }
              if (idx == arr.length - 1) {
                var lastHH = parseInt(data.substring(0, 2));
                var lastMM = parseInt(data.substring(2, 4));
                if (lastMM > 0) {
                  lastHH = lastHH + 1;
                  lastMM = 0;
                } else {
                  lastMM = 30;
                }
                lastHH = lastHH < 10 ? String(`0` + lastHH) : String(lastHH);
                lastMM = lastMM < 10 ? String(`0` + lastMM) : String(lastMM);
                result.push(lastHH.concat(lastMM));
              }
              return result;
            }, [])
            .map((d) => {
              return `${d.substring(0, 2)}:${d.substring(2, 4)}`;
            })
            .join("~")
            .value()
        );
      }
    },

    /**
     * 필요한 상담 정보를 모두 입력했는가 체크하는 메소드
     *
     * @method onCheckReserveInfo
     */
    onCheckReserveInfo() {
      if (this.selectedConsultData.phoneNumber == "") {
        this.reserveData -= 1;
        this.alertPopupOpen(
          "연락처를 입력해주세요",
          "상담 안내를 위해서는<br>연락처가 필요합니다."
        );
      }
    },
    /**
     * 상단바에서 뒤로가기 버튼 클릭 시 동작하는 함수
     *
     * @method onClickGoBack
     */
    onClickGoBack() {
      this.isReserveCancel = true;
    },
    /**
     * 예약하기 화면에서 PopupConfirm 컴포넌트에서 버튼 클릭 시
     *
     * @method onReserveCancel
     * @param isConfirm 예/아니요 여부 => true/false 로 들어옴
     */
    onReserveCancel(isConfirm) {
      this.isReserveCancel = false;

      if(!isConfirm){
        return;
      }

      if(this.consultKey === -100){
        this.$router.push({ path: "/user/scheduleInquiry" });
      }
      else if (this.consultKey < 0) {
        this.$router.push({ path: "/user/matchingFC" });
      }
      else{
        this.$router.go(-1)
      }
    },
    /**
     * 하단 버튼 클릭 시, 다음 단계 진행 여부
     *
     * @method onClickNextStage
     */
    onClickNextStage() {
      if (!this.setBtnColor) {
        return;
      }

      if (this.reserveData == 2) {
        this.onCheckReserveInfo();
      }

      if (this.reserveData == 3) {
        this.postMeeting();
      } else {
        this.reserveData += 1;
      }
    },
    /**
     * 탭 메뉴 클릭에 따른 페이지 이동 여부
     *
     * @method onGotoPage
     */
    onGotoPage(isThisPage, pageIdx) {
      if (isThisPage || this.checkForStepList[pageIdx - 1] == 0) {
        return;
      }
      this.reserveData = pageIdx;
    },
    // 채팅이 보이도록 padding 값 추가
    onSetScrollPadding() {
      var reserveInfoToggleBox = this.$refs.reserveInfoToggleBox,
        height = reserveInfoToggleBox.clientHeight + 20,
        wrap = this.$refs.wrap;
      wrap.style.paddingBottom = height + "px";
    },
    // 채팅이 보이도록 스크롤 최하단으로 이동
    scrollEnd() {
      this.onSetScrollPadding();
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    },
    /**
     * 예약 변경 여부에 따라서 하단 메뉴 ON/OFF
     */
    toggleMenu() {
      this.toggleBox = !this.toggleBox;
    },
    /**
     * 기존 예약 정보 레이어 팝업 띄어줄 지 체크
     */
    showDefaultInfo() {
      this.isReserveInfo = !this.isReserveInfo;
    },
    alertLayerClose() {
      this.alertLayer = !this.alertLayer;
    },
    /**
     * 팝업 열기
     */
    alertPopupOpen(title, desc) {
      this.isShowPopup = true;
      this.popupTitle = title;
      this.popupDesc = desc;
    },
    /**
     * 팝업 닫기
     */
    alertPopupClose() {
      this.isShowPopup = false;
      this.popupTitle = "";
      this.popupDesc = "";
    },
    /**
     * 예약 변경 시, 예약 정보 단일 조회하기
     */
    async getConsultInfo() {
      var response = await this.$connect(
        `/consultation/meeting/client/${this.consultKey}/one`,
        "GET"
      );
      this.selectedConsultData = response.body.info.consultationMeeting;
      this.$set(
        this.selectedConsultData,
        "description",
        this.selectedConsultData.description
          ? this.selectedConsultData.description
          : ""
      );
      this.isChangeMeeting = true;

      // 기본 예약 내역 보기
      this.defaultMeetingInfo = this._.cloneDeep(this.selectedConsultData);
    },
    /**
     * 예약하기 API 통신
     */
    postMeeting() {
      var requestBody = {
        phoneNumber: this.selectedConsultData.phoneNumber,
        email: this.selectedConsultData.email,
        subject: this.selectedConsultData.subject,
        description: this.selectedConsultData.description,
        fromUserKey: this.storeUserInfo.userKey,
        toUserKey: this.fcKey,
        type: this.reserveType,
        state: 1,
        dateCode: this.selectedConsultData.dateCode,
        weekDayCode: dayjs(this.selectedConsultData.dateCode).format('d'),
        timeCodeList: this._.sortBy(this.selectedConsultData.timeCodes),
      };
      
      var apiUrl =
        this.consultKey < 0
          ? "/consultation/meeting"
          : `/consultation/meeting/${this.consultKey}`;

      this.$connect(apiUrl, "POST", requestBody, {}).then((res) => {
        if (res.success && res.errMsg.length === 0) {
          this.reserveConfirmLayer = true;
        } else {
          this.popupTitle = "해당일 예약 불가";
          this.popupDesc = res.errMsg;
          this.isShowPopup = true;
        }
      });
    },
  },
};
</script>