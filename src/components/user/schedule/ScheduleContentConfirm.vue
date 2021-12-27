<template>
  <div class="formInputBox result">
    <h4>예약정보</h4>
    <form>
      <fieldset>
        <legend>예약자 정보 입력 확인 폼</legend>
        <table>
          <caption></caption>
          <colgroup>
            <col style="width: 70px" />
            <col />
          </colgroup>
          <tbody>
            <tr>
              <td colspan="2">
                <table>
                  <colgroup>
                    <col style="width: 50%" />
                    <col />
                  </colgroup>
                  <tbody>
                    <tr>
                      <th scope="row">
                        <span>{{ selectedConsultData.toUserName }}</span>
                      </th>
                      <td>
                        <span>{{ reserveType }}</span>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">
                        <span>{{ selectedConsultData.dateWeekDay }}</span>
                      </th>
                      <td>
                        <span>
                          {{ selectedConsultData.timeRange }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>

          <tbody class="userInfo">
            <tr class="confirm">
              <th scope="row">예약자</th>
              <td>
                <strong>{{ storeUserInfo.name }}</strong>
              </td>
            </tr>
            <tr>
              <th scope="row">연락처</th>
              <td>
                <strong>{{ selectedConsultData.phoneNumber }}</strong>
              </td>
            </tr>
            <tr>
              <th scope="row">이메일</th>
              <td>
                <strong>{{ selectedConsultData.email }}</strong>
              </td>
            </tr>
            <tr>
              <th scope="row">요청사항</th>
              <td>
                <strong>{{ selectedConsultData.subject }}</strong>
                <p>{{ selectedConsultData.description }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </fieldset>
    </form>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  props: {
    reserveType: { type: String },
    selectedConsultData: { type: Object },
  },
  computed: {
    ...mapGetters({ storeUserInfo: "getUserInfo" }),
  },
};
</script>