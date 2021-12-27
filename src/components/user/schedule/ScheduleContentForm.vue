<template>
  <div class="formInputBox">
    <form>
      <fieldset>
        <legend>예약자 정보 입력 폼</legend>
        <table>
          <caption></caption>
          <colgroup>
            <col style="width: 70px" />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <th scope="row">예약자</th>
              <td>
                <span>{{ storeUserInfo.name }}</span>
              </td>
            </tr>
            <tr>
              <th scope="row"><span class="required">연락처</span></th>
              <td>
                <input
                  type="number"
                  placeholder="상담 진행할 연락처 입력"
                  v-model="getNumber"
                  @keyup="setConsultDate"
                />
                <p class="bullTxt mt10">
                  * 설계사님께는 안심번호로 표시되니 걱정마세요!
                </p>
              </td>
            </tr>
            <tr>
              <th scope="row">이메일</th>
              <td>
                <input type="text" v-model="getEmail" @keyup="setConsultDate" />
              </td>
            </tr>
            <tr>
              <th scope="row">요청사항</th>
              <td>
                <div>
                  <select v-model="getSubject" @change="setConsultDate">
                    <option
                      v-for="(subject, subjectIdx) in subjectList"
                      :key="`subject-` + subjectIdx"
                      :value="subject"
                    >
                      {{ subject }}
                    </option>
                  </select>
                </div>

                <textarea
                  class="mt10"
                  :placeholder="txtPlaceholder"
                  v-model="getSubjectDetail"
                  @keyup="setConsultDate"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </fieldset>
    </form>
    <span>*필수 입력</span>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      getNumber: '',
      getEmail: '',
      getSubject: '건강보험',
      getSubjectDetail: '',
      subjectList: [
        "건강보험",
        "사망보험",
        "변액보험",
        "자산관리",
        "보험 리모델링",
        "기타",
      ],
      txtPlaceholder:
        "특별히 상담하고 싶은 내용이나, 요청하고 싶은 사항이 있다면 적어주세요.\n(ex. 건강보험 리모델링 요청, 사망보험 궁금해요.)",
    };
  },
  props: {
    selectedMeetingInfo: Object,
  },
  watch: {
    selectedMeetingInfo: {
      deep: true,
      handler(newData) {
        if (newData.phoneNumber !== '') {
          this.getNumber = newData.phoneNumber;
          this.getEmail = newData.email === undefined ? this.storeUserInfo.email : newData.email;
          this.getSubject = newData.subject === undefined ? '건강보험' : newData.subject;
          this.getSubjectDetail = newData.subjectDetail;
        }
      },
    },
  },
  created() {
    this.getNumber = this.selectedMeetingInfo.phoneNumber;
    this.getEmail = this.selectedMeetingInfo.email === undefined ? this.storeUserInfo.email : this.selectedMeetingInfo.email;
    this.getSubject = this.selectedMeetingInfo.subject === undefined ? '건강보험' : this.selectedMeetingInfo.subject;
    this.getSubjectDetail = this.selectedMeetingInfo.subjectDetail;
  },
  computed:{
    ...mapGetters({ storeUserInfo: "getUserInfo" }),
  },
  methods: {
    setConsultDate() {
      var consultationInfo = {
        phoneNumber: this.getNumber,
        email: this.getEmail,
        subject: this.getSubject,
        subjectDetail: this.getSubjectDetail,
      };
      this.$emit("changeMeeting", consultationInfo);
    },
  },
};
</script>