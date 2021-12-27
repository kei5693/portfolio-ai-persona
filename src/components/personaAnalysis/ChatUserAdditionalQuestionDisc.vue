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
          <p>{{ title }}</p>
          <div>
            <div class="surveyBox">
              <span
                v-for="(answer, answerIdx) in _.filter(answerList, 'isEnable')"
                :key="`discLastQuestion-${answerIdx}`"
              >
                <input
                  type="radio"
                  name="discType"
                  :id="`discRadio${answerIdx + 1}`"
                  v-model="userSelected"
                  :value="answer.type"
                />
                <label :for="`discRadio${answerIdx + 1}`">
                  <span>{{ answer.answer }}</span>
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
  name: "ChatUserAdditionalQuestionDisc",
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
      title: "나를 한마디로 정의한다면?",
      answerList: [
        {
          answer: "주도적이고 자신감이 넘치며 결단력있다.",
          type: "D",
          isEnable: false,
        },
        {
          answer: "낙천적이고 대인관계가 좋으며 열정적이다.",
          type: "I",
          isEnable: false,
        },
        {
          answer: "겸손하고 협조적이며 일관적이다.",
          type: "S",
          isEnable: false,
        },
        {
          answer: "분석적이고 객관적이며 정확하다.",
          type: "C",
          isEnable: false,
        },
      ],
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
    showQuestion(discList) {
      this._.forEach(discList, (d) => {
        this._.find(this.answerList, { type: d }).isEnable = true;
      });

      setTimeout(() => {
        this.isShowQuestion = true;
      }, this.deleyTime);
    },
    completeAnswer() {
      this.isShowQuestion = false;
      this.$emit("completedChatUserAdditionalQuestionDisc", this.userSelected);
    },
  },
};
</script>
<style>
</style>