<template>
  <div class="reserveBox" :class="`${isLastReservation ? 'past' : 'income'}`">
    <div class="commentText income">
      예약 내역을 선택하면 상세한 내용 확인 및<br />
      예약 상태 변경이 가능합니다.
    </div>
    <div class="commentText past">최근 3개월치 내역만 확인할 수 있습니다.</div>

    <div
      class="rsvList"
      v-for="(item, index) in _.sortBy(consultationList, 'key')"
      :key="`consultDate-` + index"
    >
      <div class="secTitle">{{ item.key | reservationHeaderTitle }}</div>

      <div
        class="secBody"
        v-for="(consultItem, consultIndex) in item.list"
        :key="`consult-` + consultIndex"
      >
        <ul class="rsvLists">
          <li
            :class="{
              latest: isLastReservation,
              canceled: consultItem.state == 3,
            }"
          >
            <div
              class="reserveItem"
              @click="clickConsultDetail(consultItem.key, consultItem.state)"
            >
              <ScheduleListItem
                :consult="consultItem"
                :is-last-reservation="isLastReservation"
              ></ScheduleListItem>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import ScheduleListItem from "@/components/user/schedule/ScheduleListItem";

export default {
  components: {
    ScheduleListItem,
  },
  props: {
    consultationList: {
      type: Array,
    },
    isLastReservation: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  filters: {
    /**
     * 예약 머릿말 제목
     *
     * @method reservationHeaderTitle
     * @param {String} value 년.월.일 요일 정보
     * @return {String} result 년.월.일 예약 으로 변경
     */
    reservationHeaderTitle(value) {
      value = value.replaceAll(" ", "");
      return `${value.substring(0, 10)} 예약`;
    },
  },
  data() {
    return {};
  },
  mounted() {},
  watch: {},
  methods: {
    /**
     * 예약정보 단일 조회
     * @param consultKey 조회할 예약키
     * @param state 예약 상태
     */
    clickConsultDetail(consultKey, state) {
      this.$router.push({ path: `/user/scheduleList/${consultKey}/${state}`, query: { isLastReservation: this.isLastReservation }});
    },
  },
};
</script>