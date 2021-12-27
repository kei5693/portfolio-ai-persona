<template>
  <div class="commonFooter" :class="crtPage">
    <router-link to="/fc/feedMain" class="home">
      <img src="@/assets/img/home_on.svg" class="on" alt="" />
      <img src="@/assets/img/home_off.svg" class="off" alt="" />
    </router-link>
    <router-link to="/fc/scheduleMain" class="rsv">
      <img src="@/assets/img/rsv_on.svg" class="on" alt="" />
      <img src="@/assets/img/rsv_off.svg" class="off" alt="" />
      <div class="ribbon" v-if="consultingBadgeTodayCount > 0">
        <span>{{ consultingBadgeTodayCount }}</span>
      </div>
    </router-link>
    <router-link to="/fc/myPage" class="myp">
      <img src="@/assets/img/myp_on.svg" class="on" alt="" />
      <img src="@/assets/img/myp_off.svg" class="off" alt="" />
    </router-link>
    <router-link to="/fc/salesLibrary" class="sales">
      <img src="@/assets/img/salesLib_on.svg" class="on" alt="" />
      <img src="@/assets/img/salesLib_off.svg" class="off" alt="" />
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
    }
  },
  props: ["crtPage"],
  computed: {
    ...mapGetters({ consultingBadgeTodayCount: 'getFcConsultingBadgeTodayCount' }),
  },
  mounted () {
    var target = document.querySelector("a." + this.$props.crtPage);
    target.classList.add("on");
  },
};
</script>