<template>
  <div>
    <dl>
      <dt class="counselingDate">
        <span class="rsvDate">{{ consult.dateWeekDay }}</span>
        <span class="rsvTime">{{ consult.timeRange }}</span>
      </dt>
      <dd class="counselor">
        {{ consult.toUserName }}
      </dd>

      <dt class="counselingType">
        <span>{{ consult.type }}</span>
      </dt>
    </dl>
    <button type="button" class="arrow income" v-if="!isLastReservation">
      <img src="@/assets/img/icon_arrow.svg" alt="" />
    </button>
    <button type="button" class="arrow past" v-else>
      <img src="@/assets/img/icon_arrow_gray.svg" alt="" />
    </button>
    <span class="rsvCanceled">취소된 예약</span>
  </div>
</template>

<script>
export default {
  props: {
    consult: {
      type: Object,
    },
    isLastReservation: {
      type: Boolean,
      default: false,
      required: true
    }
  },
};
</script>