<template>
  <div class="jobSelectorWrap on">
    <div class="secHeader">
      <span class="notUse"></span>
      <p class="mg0">직업 입력</p>
      <button type="button" @click="onClickClose">
        <img src="@/assets/img/closeBtn_x.svg" alt="" />
      </button>
    </div>
    <div class="secBody">
      <div class="expText">
        😉 현재 종사하고있는 직종을 입력하고<br />
        관련 콘텐츠를 추천받으세요!
      </div>
      <div class="masks">
        <ul>
          <li v-for="(jobItem, jobIdx) in jobList" :key="`joblist-${jobIdx}`">
            <label
              :for="`joblist-${jobIdx}`"
              :class="{ on: jobItem === selectedJobName }"
            >
              <input
                type="checkbox"
                :id="`joblist-${jobIdx}`"
                value="jobItem"
                @click="onClickJob(jobItem)"
              />
              <span>{{ jobItem }}</span>
            </label>
          </li>
        </ul>
      </div>
    </div>

    <div class="confirmBox" :class="{ on: !!selectedJobName }">
      <a v-if="!!selectedJobName" @click="onClickSaveJob">
        <p>선택 완료</p>
      </a>
      <a v-else>
        <p>선택 완료</p>
      </a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      selectedJobName: '',
      jobList: ["경영/비즈니스", "마케팅/광고", "개발", "고객서비스/리테일", "영업", "미디어", "인사", "게임 제작", "금융", "엔지니어링/설계", "물류/무역", "제조/생산", "의료/제약/바이오", "교육", "식/음료", "법률/법집행기관", "건설/시설", "공공/복지"]
    }
  },
  computed: {
    ...mapGetters({ storeUserInfo: 'getUserInfo' }),
  },
  mounted () {
    this.selectedJobName = this.storeUserInfo.job
  },
  methods: {
    onClickJob (job) {
      this.selectedJobName = job
    },
    onClickSaveJob () {
      this.$connect(`/user/${this.storeUserInfo.userKey}`, 'PUT', { job: this.selectedJobName }).then(res => {
        if (res.success) {
          this.$store.commit('setUserJob', this.selectedJobName)
          this.$emit('closeLayer', this.selectedJobName)
        }
      })
    },
    onClickClose () {
      this.$emit('closeLayer', null)
    }
  },
}
</script>