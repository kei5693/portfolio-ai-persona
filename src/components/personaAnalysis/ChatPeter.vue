<template>
  <div v-if="isSkip == false" :data-dataType="chatData.dataType">
    <h2>피터(Peter)</h2>
    <ul>
      <li
        v-for="(chat, chatIdx) in chatList"
        :key="`chat-peter-${chatIdx}-${getRandomNum()}`"
      >
        <span v-html="convertGlobalData(chat)"></span>
      </li>
    </ul>
  </div>
</template>
<script>
import Constant from "@/constant/Constant.js";
export default {
  props: {
    chatData: {
      type: Object,
      require: true,
    },
    deleyTime: {
      type: Number,
      default: 800,
    },
  },
  data() {
    return {
      thisChatData: {},
      chatList: [],
    };
  },
  created() {
    this.$set(this, "thisChatData", this.chatData);
    if (this.isSkip) {
      this.$set(this.thisChatData, "chatStatus", Constant.USER_CHAT_STATUS.END);
    }
  },
  computed: {
    isSkip() {
      return this.thisChatData.isSkip;
    },
    thisChatDataKeys() {
      return Object.keys(this.thisChatData);
    },
    isPlayCompleted() {
      var result = false;
      if (
        this.thisChatDataKeys.length > 0 &&
        this.thisChatData.data.length == this.chatList.length
      ) {
        result = true;
      }
      return result;
    },
    chatStatus() {
      return this.thisChatData.chatStatus;
    },
  },
  watch: {
    isPlayCompleted(status) {
      if (status) {
        this.$set(
          this.thisChatData,
          "chatStatus",
          Constant.USER_CHAT_STATUS.END
        );
      }
    },
    chatList() {
      this.$emit("setChatUIscrollDown");
    },
    chatStatus(status) {
      if (status == Constant.USER_CHAT_STATUS.READY) {
        this.runPlayChat();
      }
      if (status == Constant.USER_CHAT_STATUS.END) {
        this.$emit("completedChatStatusEnd", this.thisChatData.key);
      }
    },
  },
  methods: {
    removeEmojis(str) {
      const regex =
        /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
      return str.replace(regex, "");
    },
    getRandomNum() {
      return Math.random() * 10000000000000000;
    },
    convertGlobalData: function (chat) {
      const regExp = new RegExp(/\$\{(.+?)\}/gi);
      const noEmosiChat = this.removeEmojis(chat);
      const regData = regExp.exec(noEmosiChat);
      var result = chat;
      if (regData != null) {
        const replaceKeyword = regData[0];
        const globalDataKey = regData[1];
        const globalDataValue = this.$globalData.getData(globalDataKey);
        result = chat.replace(replaceKeyword, globalDataValue);
      }
      return result;
    },
    runPlayChat() {
      if (!this.isPlayCompleted) {
        this.chatList.push(this.thisChatData.data[this.chatList.length]);
        setTimeout(() => {
          this.runPlayChat();
        }, this.deleyTime);
      }
    },
  },
};
</script>
