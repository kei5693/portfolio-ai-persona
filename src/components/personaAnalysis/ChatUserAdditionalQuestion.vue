<template>
  <div class="answer">
    <div
      class="toastBox"
      :class="{ on: isShowQuestion }"
      ref="chatUserQuestion"
      :data-is-show-question="isShowQuestion"
    >
      <div class="inner">
        <div class="inputBox">
          <p>🏆 3분 투자하고 페르소나 레벨 업!</p>
          <div>
            <div class="surveyBox">
              <span>
                <input
                  type="radio"
                  name="rdo1"
                  id="rdo1"
                  v-model="userSelected"
                  value="yes"
                />
                <label for="rdo1">
                  <span>추가 진단할게요!</span>
                </label>
              </span>
              <span>
                <input
                  type="radio"
                  name="rdo1"
                  id="rdo2"
                  v-model="userSelected"
                  value="no"
                />
                <label for="rdo2">
                  <span>나중에 할게요!</span>
                </label>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="confirmBox" :class="{ on: checkUserValue }" ref="confirmBox">
        <button type="button" class="send" @click="completeAnswer">
          <p>전송</p>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "PersonaAnalysisLastQuestion",
  props: {
    deleyTime: {
      type: Number,
      default: 800,
    },
  },
  data() {
    return {
      isShowQuestion: false,
      userSelected: "",
    };
  },
  watch: {
    isShowQuestion(status) {
      if (status) {
        setTimeout(() => {
          this.$emit("setChatUIscrollDown");
        }, 100);
      }
    },
  },
  computed: {
    checkUserValue() {
      return this.userSelected.length > 0;
    },
  },
  methods: {
    showQuestion() {
      setTimeout(() => {
        this.isShowQuestion = true;
      }, this.deleyTime);
    },
    completeAnswer() {
      this.isShowQuestion = false;
      if (this.userSelected == "yes") {
        this.$emit("chatUserAdditionalQuestionYes");
      } else {
        this.$emit("chatUserAdditionalQuestionNo");
      }
    },
  },
};
</script>
<style>
</style>