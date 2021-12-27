<template>
  <div class="answer" v-if="isSkip == false" :data-dataType="chatData.dataType">
    <template v-if="showChat">
      <ul>
        <li>
          <span v-html="userValues"> </span>
        </li>
      </ul>
      <button
        type="button"
        v-if="
          serveyTreeStatusInfoList[thisChatData.serveyTreeIndex].enableEditMode
        "
        @click="editQuestion"
      >
        {{
          chatData.serveyMeta.personaAnalysisType == "personaLevel02"
            ? "다시하기"
            : "수정하기"
        }}
      </button>
    </template>
    <ChatUserQuestion
      ref="chatUserQuestion"
      :thisChatData="thisChatData"
      :editModeChatKey="editModeChatKey"
      :userPersonaLv01="userPersonaLv01"
      :progressBarPercent="progressBarPercent"
      @completedAnswer="completedAnswer"
      @startQuestion="startQuestion"
      @setChatUIscrollDown="$emit('setChatUIscrollDown')"
    />
  </div>
</template>
<script>
import ChatUserQuestion from "@/components/personaAnalysis/ChatUserQuestion.vue";
import Constant from "@/constant/Constant.js";
export default {
  components: {
    ChatUserQuestion,
  },
  props: {
    chatData: {
      type: Object,
      require: true,
    },
    chatListIdx: {
      type: Number,
      require: true,
      default: -1,
    },
    editModeChatKey: {
      type: String,
      require: true,
      default: "",
    },
    userPersonaLv01: {
      type: Number,
      default: -1,
    },
    progressBarPercent: {
      type: Number,
      default: 0,
    },
    serveyTreeStatusInfoList: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {
      thisChatData: {},
    };
  },
  created() {
    this.$set(this, "thisChatData", this.chatData);
    if (this.isSkip) {
      this.$set(this.thisChatData, "chatStatus", Constant.USER_CHAT_STATUS.END);
      this.$emit("completedChatStatusEnd");
    }
  },
  computed: {
    isSkip() {
      return this.thisChatData.isSkip;
    },
    userValues() {
      return this._.chain(this.thisChatData.data.qustionAnswerList)
        .filter("userValue")
        .reduce((r, d, i) => {
          var result = "";

          switch (
            d.personaSetAnswerServey.personaSetAnswerServeyMetaObject
              .personaAnalysisType
          ) {
            case "personaLevel01":
            case "personaLevel02":
              if (i > 0) {
                result = result.concat("</br>");
              }
              result = result.concat(d.personaSetAnswerTitle);
              break;
            case "personaLevel03":
              if (i > 0) {
                result = result.concat("</br>");
              }
              result = result.concat(d.personaSetAnswerTitle);
              break;

            default:
              if (i > 0) {
                result = result.concat(", ");
              }
              result = result.concat(
                typeof d.userValue == "boolean"
                  ? d.personaSetAnswerTitle
                  : d.userValue
              );
              break;
          }

          return r.concat(result);
        }, "")
        .value();
    },
    showChat() {
      return (
        this.thisChatData.chatStatus == Constant.USER_CHAT_STATUS.END ||
        this.thisChatData.chatStatus == Constant.USER_CHAT_STATUS.EDIT
      );
    },
    chatStatus() {
      return this.thisChatData.chatStatus;
    },
  },
  methods: {
    completedAnswer() {
      if (this.thisChatData.chatStatus == Constant.USER_CHAT_STATUS.EDIT) {
        this.$set(
          this.thisChatData,
          "chatStatus",
          Constant.USER_CHAT_STATUS.END
        );
        return;
      }
      this.$set(this.thisChatData, "chatStatus", Constant.USER_CHAT_STATUS.END);
      this.$emit("completedChatStatusEnd");
    },
    editQuestion() {
      this.$emit("editChatQuestion", this.chatListIdx);
    },
    startQuestion() {
      this.$set(
        this.thisChatData,
        "chatStatus",
        Constant.USER_CHAT_STATUS.START
      );
    },
  },
};
</script>