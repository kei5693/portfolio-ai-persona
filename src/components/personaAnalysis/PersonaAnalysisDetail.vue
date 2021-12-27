<template>
  <v-container>
    <div id="wrap" class="diagnosis-detail">
      <div class="chatBox" ref="chatListContainer">
        <template
          v-for="(chat, chatIdx) in chatList.filter(
            (d) => d.chatStatus != USER_CHAT_STATUS.NEW_ADDED
          )"
        >
          <ChatUser
            v-if="
              chat.type == 'question' &&
              chat.dataType != 'chatUserAdditional' &&
              chat.dataType != 'chatPeterAdditional'
            "
            :key="`chatUser${chatIdx}`"
            :ref="`chatUser${chatIdx}`"
            :chatData="chat"
            :chatListIdx="chatIdx"
            :serveyTreeStatusInfoList="serveyTreeStatusInfoList"
            :editModeChatKey="editModeChatKey"
            :deleyTime="deleyTime"
            :userPersonaLv01="userPersonaLv01"
            :progressBarPercent="progressBarPercent"
            @completedChatStatusEnd="completedChatStatusEnd"
            @editChatQuestion="editChatQuestion"
            @setChatUIscrollDown="
              setChatUIscrollDown('USER', `chatUser${chatIdx}`)
            "
          />
          <ChatPeter
            v-if="
              chat.type != 'question' &&
              chat.dataType != 'chatUserAdditional' &&
              chat.dataType != 'chatPeterAdditional' &&
              chat.dataType != 'finalDiscQuestion'
            "
            :key="`chatPeter${chatIdx}`"
            :ref="`chatPeter${chatIdx}`"
            :chatData="chat"
            :deleyTime="deleyTime"
            @completedChatStatusEnd="completedChatStatusEnd"
            @setChatUIscrollDown="setChatUIscrollDown('PETER')"
          />
          <ChatPeterAdditional
            v-if="chat.dataType == 'chatPeterAdditional'"
            :key="`chatPeterAdditional${chatIdx}`"
            :ref="`chatPeterAdditional${chatIdx}`"
            :chatData="chat"
            :deleyTime="deleyTime"
            @completedChatStatusEnd="completedChatStatusEnd"
            @setChatUIscrollDown="setChatUIscrollDown('PETER')"
          />
          <ChatUserAdditional
            v-if="chat.dataType == 'chatUserAdditional'"
            :key="`chatUserAdditional${chatIdx}`"
            :ref="`chatUserAdditional${chatIdx}`"
            :chatData="chat"
            :deleyTime="deleyTime"
            @completedChatStatusEnd="completedChatStatusEnd"
            @setChatUIscrollDown="setChatUIscrollDown('USER')"
          />
        </template>

        <ChatUserAdditionalQuestion
          :ref="`chatUserAdditionalQuestion`"
          :deleyTime="deleyTime"
          @chatUserAdditionalQuestionYes="chatUserAdditionalQuestionYes"
          @chatUserAdditionalQuestionNo="chatUserAdditionalQuestionNo"
          @setChatUIscrollDown="
            setChatUIscrollDown('USER', 'chatUserAdditionalQuestion')
          "
        />
        <ChatUserAdditionalQuestionDisc
          :ref="`chatUserAdditionalQuestionDisc`"
          :deleyTime="deleyTime"
          @completedChatUserAdditionalQuestionDisc="
            completedChatUserAdditionalQuestionDisc
          "
          @setChatUIscrollDown="
            setChatUIscrollDown('USER', 'chatUserAdditionalQuestionDisc')
          "
        />
      </div>
    </div>
    <div class="confirmBox on" v-if="isShowGotoPersonaInfo">
      <button @click="onClickGoToMyPage"><p>페르소나 결과 확인하기</p></button>
    </div>
  </v-container>
</template>

<script>
import ChatPeter from "@/components/personaAnalysis/ChatPeter.vue";
import ChatPeterAdditional from "@/components/personaAnalysis/ChatPeterAdditional.vue";
import ChatUser from "@/components/personaAnalysis/ChatUser.vue";
import ChatUserAdditional from "@/components/personaAnalysis/ChatUserAdditional.vue";
import ChatUserAdditionalQuestion from "@/components/personaAnalysis/ChatUserAdditionalQuestion.vue";
import ChatUserAdditionalQuestionDisc from "@/components/personaAnalysis/ChatUserAdditionalQuestionDisc.vue";
import Constant from "@/constant/Constant.js";
import { mapGetters } from "vuex";
import StorageUtils from "@/utils/storage-utils";

export default {
  components: {
    ChatPeter,
    ChatPeterAdditional,
    ChatUser,
    ChatUserAdditional,
    ChatUserAdditionalQuestion,
    ChatUserAdditionalQuestionDisc,
  },
  props: {
    questionAndAnswerList: {
      type: Array,
      required: true,
      default: new Array(),
    },
    answerServeyTreeListLength: {
      type: Number,
      default: 0,
    },
    personaLv01: {
      type: Number,
      default: -1,
    },
    personaLv02: {
      type: Number,
      default: -1,
    },
    personaLv03: {
      type: String,
      default: "",
    },
    startPage: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      chatList: [],
      deleyTime: 800,
      nowServeyTreeIndex: -1,
      isShowPersonaAnalysisLastQuestion: false,
      userFlowBeforeAfterChatKeys: {
        before: "Before",
        after: "After",
      },
      userFlowBeforeAfterChatList: {
        default: {
          before: [
            "자, ${profile.name}님의 페르소나를 더욱 발전시켜서 더 도움이 될 콘텐츠를 추천해드리려고해요.",
            "총 2개의 주제에 대한 질문을 드릴게요.<br/>정확한 페르소나 생성을 위해서 질문이 조금 많아도😂 꼭 답해주시길 바라요!",
            "모든 질문 답변 완료 후에는 답변 수정이 어려우니 신중히 선택해주세요!",
          ],
          after: [],
        },
        onlyPersonaLv01: {
          before: [],
          after: [
            "아쉬워요ㅠㅠ 참고로, Fitme의 설계사 추천 및 상담 예약 서비스는 페르소나 레벨업이 꼭 필요하답니다!",
            "my P 메뉴에서 페르소나 레벨 업을 진행할 수 있으니 나중에라도 꼭 레벨업! 해주세요 :)",
            "저는 여기서 이만 인사드릴게요. 만나서 반가웠어요 ${profile.name}님 😉❤ ",
          ],
        },
        myPage: {
          before: [
            "자, ${profile.name}님의 페르소나를 더욱 발전시켜서 맞춤 콘텐츠를 추천해드리려고해요.",
            "총 2개의 주제에 대한 질문을 드릴게요.<br/>정확한 페르소나 생성을 위해서 질문이 조금 많아도😂 꼭 답해주시길 바라요!",
            "모든 질문 답변 완료 후에는 답변 수정이 어려우니 신중히 선택해주세요!",
          ],
          after: [
            "앗 참고로! 페르소나 레벨 업까지 완료하셨으니,",
            "FIT ME가 제공하는 맞춤 설계사 추천 서비스도",
            "이용해보실 수 있어요 🙌  그럼 저는 이만 😍",
          ],
        },
        findFC: {
          before: [
            "안녕하세요. ${profile.name}님!<br/>설계사 추천을 위해 꼭 필요한 추가 진단이 아직 안되어있네요.",
            "설계와의 상담도 결국, 사람과 사람의 만남!<br/>이왕이면 잘맞는 설계사를 만나는게 좋죠.",
            "라이프스타일, 성향 진단을 먼저 진행한 후, <br/>${profile.name}님과 잘 맞을 설계사를 추천해드릴게요.",
          ],
          after: [
            "자! 이제 ${profile.name}님과 쿵짝이 잘 맞을 설계사를 만나보실까요? 🙌",
          ],
        },
      },
      isShowGotoPersonaInfo: false,
      userPersonaLv01: -1,
      userPersonaLv02: -1,
      userPersonaLv03: [],
      lastDiscType: "",
    };
  },
  created() {
    this.userPersonaLv01 = this.personaLv01
      ? this.personaLv01
      : this.userPersonaLv01;
    this.userPersonaLv02 = this.personaLv02
      ? this.personaLv02
      : this.userPersonaLv02;
    this.userPersonaLv03 = this.personaLv03
      ? this.personaLv03
      : this.userPersonaLv03;
  },
  mounted() {
    window.test = this;
    this.nowServeyTreeIndex = this.personaLv01 > 0 ? 1 : 0;

    this.settingByAddChatListToUserFlowBeforeAfterChat(
      this.userFlowBeforeAfterChatKeys.before
    );
  },
  watch: {
    isShowGotoPersonaInfo(status) {
      if (status) {
        setTimeout(() => {
          this.setChatUIscrollDown("PETER");
        }, 100);
      }
    },
    serveyTreeStatusInfoListJson() {
      const serveyTreeStatusInfoListJson = JSON.parse(
        this.serveyTreeStatusInfoListJson
      ).json;

      this._.chain(serveyTreeStatusInfoListJson)
        .forEach((d) => {
          if (d.serveyGroupCode == this.nowServeyTreeIndex) {
            if (d.stepStatusStart) {
              this.settingByAddChatListToQuestionAndAnswer(
                this.nowServeyTreeIndex
              );
              this.playChat();
            } else {
              var resultPersonaOrDisc = this.analysisQuestionAnswerPersonaData(
                d.serveyGroupCode
              );

              var totalQuestionAndAnswerList = this._.chain(
                this.questionAndAnswerList
              )
                .filter((d, k) => {
                  return this.nowServeyTreeIndex == 0 ? k == 0 : k > 0;
                })
                .flatMap()
                .value();

              var userSelectedAnswerList = this._.chain(
                totalQuestionAndAnswerList
              )
                .flatMap("question")
                .flatMap("qustionAnswerList")
                .filter("userValue")
                .map((d) => {
                  return this._.pick(d, [
                    "personaSetAttrKey",
                    "personaSetAttrVersion",
                    "personaSetQuestionKey",
                    "personaSetAnswerKey",
                    "personaSetAnswerTitle",
                    "personaSetAnswerValue",
                    "userValue",
                  ]);
                })
                .value();

              switch (this.nowServeyTreeIndex) {
                case 0:
                  this.userPersonaLv01 = resultPersonaOrDisc;
                  break;
                case 1:
                  this.userPersonaLv02 = resultPersonaOrDisc;
                  break;
                case 2:
                  this.userPersonaLv03 = resultPersonaOrDisc;
              }
              const checkUserValue = (answerData) => {
                var result = "";
                switch (typeof answerData.userValue) {
                  case "boolean":
                    result = answerData.personaSetAnswerValue
                      ? answerData.personaSetAnswerValue
                      : answerData.personaSetAnswerTitle;
                    break;
                  default:
                    result = answerData.userValue;
                    break;
                }
                return result;
              };

              const apiSendData = {
                userKey: this.storeUserInfo.userKey,
                personaSetKey: userSelectedAnswerList[0].personaSetAttrKey,
                personaSetVersion:
                  userSelectedAnswerList[0].personaSetAttrVersion,
                userPersona: {
                  personaKey:
                    this.userPersonaLv02 > 0
                      ? this.userPersonaLv02
                      : this.userPersonaLv01,
                  personaSetDiscContentKey:
                    this.userPersonaLv03.length > 1
                      ? this.lastDiscType
                      : this.userPersonaLv03[0],
                  completionPersonaLv1: this.userPersonaLv01 > 0 ? true : false,
                  completionPersonaLv2: this.userPersonaLv02 > 0 ? true : false,
                },
                userPersonaDetailLogList: this._.chain(userSelectedAnswerList)
                  .map((d) => {
                    return {
                      personaQuestionKey: d.personaSetQuestionKey,
                      personaAnswerKey: d.personaSetAnswerKey,
                      answerValue: checkUserValue(d),
                    };
                  })
                  .uniqWith((a, b) => {
                    return (
                      a.personaQuestionKey == b.personaQuestionKey &&
                      a.personaAnswerKey == b.personaAnswerKey
                    );
                  })
                  .value(),
              };

              const nextIdx = Math.min(
                this.nowServeyTreeIndex + 1,
                this.answerServeyTreeListLength - 1
              );

              switch (this.nowServeyTreeIndex) {
                case 0:
                  this.sendDataAPI(apiSendData);
                  this.userPersonaLv01 = resultPersonaOrDisc;
                  if (this.userType == "user") {
                    this.$refs.chatUserAdditionalQuestion.showQuestion();
                  } else {
                    this.nowServeyTreeIndex = nextIdx;
                    this.playChat();
                  }
                  break;
                case 1:
                  this.userPersonaLv02 = resultPersonaOrDisc;
                  this.nowServeyTreeIndex = nextIdx;
                  this.playChat();
                  break;
                case 2:
                  if (this.answerServeyTreeListLength == 3) {
                    this.sendDataAPI(apiSendData);
                    this.personaAnalysisEnd();
                  } else {
                    this.nowServeyTreeIndex = nextIdx;
                    this.playChat();
                  }

                  break;
                case 3:
                  this.sendDataAPI(apiSendData);
                  this.personaAnalysisEnd();

                  break;
              }
            }
          }
        })
        .value();
    },
  },
  computed: {
    ...mapGetters({ storeUserInfo: "getUserInfo" }),

    USER_CHAT_STATUS() {
      return Constant.USER_CHAT_STATUS;
    },
    editModeChatKey() {
      var returnKey = "";
      this._.chain(this.chatList)
        .filter({ chatStatus: Constant.USER_CHAT_STATUS.EDIT })
        .forEach((d) => {
          returnKey = d.key;
        })
        .value();
      return returnKey;
    },
    chatListLastIdx() {
      var lastChat = this._.chain(this.chatList)
        .filter({ chatStatus: Constant.USER_CHAT_STATUS.END })
        .last()
        .value();
      return lastChat ? lastChat.chatListIdx : -1;
    },
    serveyTreeStatusInfoList() {
      return this._.chain(this.questionAndAnswerList)
        .map((d, dIdx) => {
          return {
            serveyGroupCode: dIdx,
            dataList: d,
            isAllEnd: false,
          };
        })
        .map((d) => {
          d.isAllEnd =
            this._.filter(d.dataList, {
              chatStatus: Constant.USER_CHAT_STATUS.END,
            }).length == d.dataList.length;
          return d;
        })
        .reduce((r, d) => {
          if (d.serveyGroupCode <= this.nowServeyTreeIndex)
            r.push({
              serveyGroupCode: d.serveyGroupCode,
              enableEditMode: !d.isAllEnd,
              isAllEnd: d.isAllEnd,
              stepStatusStart: !d.isAllEnd,
              stepStatusEnd: d.isAllEnd,
            });
          return r;
        }, [])
        .value();
    },
    // 진행 단계별 상태를 구하는 computed 변수
    // (JSON 문자열로 만드는 이유는 문항의 상태가 계속 변하기에 지속적으로 호출이 되어 시작과 끝에 한번만 호출하는 로직이 필요해서임..)
    serveyTreeStatusInfoListJson() {
      return JSON.stringify({ json: this.serveyTreeStatusInfoList });
    },

    progressBarPercent() {
      var endCount = this._.filter(
        this.questionAndAnswerList[this.nowServeyTreeIndex],
        {
          chatStatus: Constant.USER_CHAT_STATUS.END,
          dataType: Constant.PERSONA_SET_DATA_TYPE.PERSONA_SET_QUESTION,
        }
      ).length;
      var totalCount = this._.filter(
        this.questionAndAnswerList[this.nowServeyTreeIndex],
        {
          dataType: Constant.PERSONA_SET_DATA_TYPE.PERSONA_SET_QUESTION,
        }
      ).length;

      return parseInt((endCount / totalCount) * 100);
    },
  },
  methods: {
    settingByAddChatListToUserFlowBeforeAfterChat(type) {
      if (
        Object.keys(this.userFlowBeforeAfterChatKeys).indexOf(
          type.toLowerCase()
        ) > -1 &&
        this.userType == "user"
      ) {
        const key = type.toLowerCase();
        const keyName = this.userFlowBeforeAfterChatKeys[key];
        if (
          this.userFlowBeforeAfterChatList[this.startPage][key].length > 0
          //
        ) {
          this.addChatList({
            data: this.userFlowBeforeAfterChatList[this.startPage][key],
            dataType: "chatPeterAdditional",
            key: `flowBefore${keyName}Chat_${this.startPage}`,
            type: `flowBefore${keyName}Chat`,
          });
        }
      }
    },
    settingByAddChatListToQuestionAndAnswer(serveyTreeIndex) {
      this._.chain(this.questionAndAnswerList[serveyTreeIndex])
        .forEach((d) => {
          this.addChatList(
            Object.assign(d, { serveyTreeIndex: this.nowServeyTreeIndex })
          );
        })
        .value();
    },
    addChatList(charDataObj) {
      this.chatList.push(
        Object.assign(charDataObj, {
          chatListIdx: this.chatList.length,
          chatStatus: Constant.USER_CHAT_STATUS.NEW_ADDED,
        })
      );
    },
    playChat() {
      if (this.nowServeyTreeIndex == 2 && this.userPersonaLv03.length == 0) {
        var personaLevel03LastKey = this._.chain(this.chatList)
          .filter({
            dataType: Constant.PERSONA_SET_DATA_TYPE.PERSONA_SET_QUESTION,
          })
          .filter((d) => {
            return d.serveyMeta.personaAnalysisType == "personaLevel03"; //성향진단 정보 질문
          })
          .last()
          .get("key")
          .value();
        var prevChatKey = this._.chain(this.chatList)
          .filter({ chatStatus: Constant.USER_CHAT_STATUS.END })
          .last()
          .get("key")
          .value();

        if (
          this.lastDiscType.length == 0 &&
          personaLevel03LastKey == prevChatKey
        ) {
          var lastDisc = this.analysisQuestionAnswerPersonaData(
            this.nowServeyTreeIndex
          );
          if (lastDisc.length > 1) {
            this.$refs.chatUserAdditionalQuestionDisc.showQuestion(lastDisc);
            return;
          }
        }
      }

      var target = this._.chain(this.chatList)
        .filter({ chatStatus: Constant.USER_CHAT_STATUS.NEW_ADDED })
        .head()
        .value();

      if (target && target.chatStatus) {
        var isSkip = false;
        //globalSaveData 값을 확인하여 SKIP 해야하는 CHAT은 SKIP알수있게 변경
        if (
          target.serveyMeta &&
          target.serveyMeta.hiddenTrigger == "globalSaveData"
        ) {
          var serveyMetaKey = target.serveyMeta.key;
          var serveyMetaValue = target.serveyMeta.value;
          if (this.$globalData.getData(serveyMetaKey) == serveyMetaValue) {
            this._.set(target, "question.isSkipQuestion", true);
            isSkip = true;
          }
        }
        target.isSkip = isSkip;

        if (target.isSkip) {
          target.chatStatus = Constant.USER_CHAT_STATUS.END;
        } else if (target.dataType == "chatUserAdditional") {
          target.chatStatus = Constant.USER_CHAT_STATUS.READY;
        } else {
          setTimeout(() => {
            target.chatStatus =
              target.chatStatus != Constant.USER_CHAT_STATUS.END
                ? Constant.USER_CHAT_STATUS.READY
                : target.chatStatus;
          }, this.deleyTime);
        }
      }
    },
    // CHAT 표현 및 선택 완료시
    completedChatStatusEnd(dataKey) {
      if (dataKey) {
        this._.chain(this.chatList).find({ key: dataKey }).value().chatStatus =
          Constant.USER_CHAT_STATUS.END;
      }
      this.playChat();
    },
    // 수정하기 선택시
    editChatQuestion(idx) {
      this._.chain(this.chatList)
        .filter({ chatStatus: Constant.USER_CHAT_STATUS.EDIT })
        .forEach((d) => {
          d.chatStatus = Constant.USER_CHAT_STATUS.END;
        })
        .value();

      this.$set(
        this.chatList[idx],
        "chatStatus",
        Constant.USER_CHAT_STATUS.EDIT
      );
    },
    // 채팅 UI가 보여질때마다 화면을 최 하단으로 내림
    setChatUIscrollDown(type, refKey) {
      var padding = 0;
      if (type == "USER" && refKey) {
        if (Object.keys(this.$refs).indexOf(refKey) >= 0) {
          const target = this.$refs[refKey][0]
            ? this.$refs[refKey][0].$refs.chatUserQuestion
            : this.$refs[refKey].$refs.chatUserQuestion;

          const questionHeight = target.$el
            ? target.$el.clientHeight
            : target.clientHeight;
          const isShowQuestion = target.$el
            ? target.isShowQuestion
            : Boolean(target.dataset.isShowQuestion);
          padding = isShowQuestion ? questionHeight - 78 : 0; //78 => 하단 전송 버튼 HEIGHT 값
        }
      }

      this.$refs.chatListContainer.style.paddingBottom = padding + "px";
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    },
    // 마지막 커스텀 질문 - 추가진단 진행시
    chatUserAdditionalQuestionYes() {
      this.addChatList({
        data: ["추가 진단할게요!"],
        dataType: "chatUserAdditional",
        key: `chatUserAdditional_${this.nowServeyTreeIndex}`,
        serveyTreeIndex: this.nowServeyTreeIndex,
        type: "chatUserAdditional",
      });
      
      this.$router.push({ 
        path: `/user/personaAnalysis?startPage=${Constant.PERSONA_ANALYSIS_START_PAGE.DEFAULT}` 
      });

      this.startPage = Constant.PERSONA_ANALYSIS_START_PAGE.DEFAULT

      this.addChatList({
        data: this.userFlowBeforeAfterChatList[this.startPage]['before'],
        dataType: "chatPeterAdditional",
        key: `flowBeforeBeforeChat_${this.startPage}`,
        type: `flowBeforeBeforeChat`,
      });

      var nextIdx = Math.min(
        this.nowServeyTreeIndex + 1,
        this.answerServeyTreeListLength - 1
      );

      this.nowServeyTreeIndex = nextIdx;

      this.playChat();
    },
    // 마지막 커스텀 질문 - 추가진단 거절시
    chatUserAdditionalQuestionNo() {
      this.addChatList({
        data: ["나중에 할게요!"],
        dataType: "chatUserAdditional",
        key: `chatUserAdditional_${this.nowServeyTreeIndex}`,
        serveyTreeIndex: this.nowServeyTreeIndex,
        type: "chatUserAdditional",
      });
      this.personaAnalysisEnd();
    },
    completedChatUserAdditionalQuestionDisc(lastDiscType) {
      this.lastDiscType = lastDiscType;
      this.playChat();
    },
    personaAnalysisEnd() {
      this.settingByAddChatListToUserFlowBeforeAfterChat(
        this.userFlowBeforeAfterChatKeys.after
      );

      const noEndQuestionCount =
        this._.filter(this.chatList, (d) => {
          return d.chatStatus != Constant.USER_CHAT_STATUS.END;
        }).length + 1;

      setTimeout(() => {
        this.isShowGotoPersonaInfo = true;
        this.setChatUIscrollDown();
      }, this.deleyTime * noEndQuestionCount);

      this.playChat();
      return noEndQuestionCount;
    },
    // 각 단계별 퍼소나 정보 분석
    analysisQuestionAnswerPersonaData(serveyGroupCode) {
      var qustionAnswerList = this._.chain(
        this.questionAndAnswerList[serveyGroupCode]
      )
        .filter({
          dataType: Constant.PERSONA_SET_DATA_TYPE.PERSONA_SET_QUESTION,
        })
        .flatMap("data")
        .flatMap("qustionAnswerList")
        .filter("userValue")
        .orderBy(["idx"], ["asc"])
        .map((d) => {
          return this._.pick(d, [
            "idx",
            "dataType",
            "personaSetAttrKey",
            "personaSetAttrVersion",
            "personaSetQuestionKey",
            "personaSetAnswerKey",
            "answerPersonaList",
            "personaSetQuestionTitle",
            "personaSetAnswerValue",
            "userValue",
          ]);
        })
        .value();

      var resultPersonaOrDisc = null;
      const searchPersonaParentKey =
        serveyGroupCode == 0 ? 0 : this.userPersonaLv01;
      switch (serveyGroupCode) {
        case 0:
        case 1:
          resultPersonaOrDisc = this.analysisPersonaInfo(
            qustionAnswerList,
            searchPersonaParentKey
          );
          break;
        case 2:
          resultPersonaOrDisc = this.analysisDiscInfo(qustionAnswerList);
          break;
      }

      return resultPersonaOrDisc;
    },
    analysisPersonaInfo(qustionAnswerList, searchPersonaParentKey) {
      return this._.chain(qustionAnswerList)
        .flatMap("answerPersonaList")
        .flatMap("persona")
        .filter((d) => (d ? true : false))
        .filter((d) => {
          return d.personaParentKey == searchPersonaParentKey;
        })
        .groupBy((d) => {
          return d.personaKey;
        })
        .map((d, k) => {
          return { persona: k, count: d.length };
        })
        .maxBy("count")
        .pick(["persona"])
        .map((d) => d)
        .join()
        .toNumber()
        .value();
    },
    analysisDiscInfo(qustionAnswerList) {
      // 동점여부 확인
      const discAnswerInfoList = this._.chain(qustionAnswerList)
        .groupBy((d) => {
          return d.personaSetAnswerValue;
        })
        .map((d, k) => {
          return { discType: k, count: d.length };
        })
        .value();

      const max = this._.maxBy(discAnswerInfoList, "count");
      const tieDiscList = this._.filter(discAnswerInfoList, {
        count: max.count,
      }).reduce((r, d) => {
        r.push(d.discType);
        return r;
      }, []);

      return tieDiscList;
    },
    sendDataAPI(apiSendData) {
      var disc = this._.get(
        apiSendData,
        "userPersona.personaSetDiscContentKey"
      );
      switch (this._.upperCase(disc)) {
        case "D":
          this._.set(apiSendData, "userPersona.personaSetDiscContentKey", 1);
          break;
        case "I":
          this._.set(apiSendData, "userPersona.personaSetDiscContentKey", 2);
          break;
        case "S":
          this._.set(apiSendData, "userPersona.personaSetDiscContentKey", 3);
          break;
        case "C":
          this._.set(apiSendData, "userPersona.personaSetDiscContentKey", 4);
          break;

        default:
          this._.set(apiSendData, "userPersona.personaSetDiscContentKey", "");
          break;
      }
      console.log("apiSendData", apiSendData);
      this.$connect("/user/persona", "POST", apiSendData)
        .then((res) => {
          console.log(">>>> sendDataAPI res", res);
          this.onGetUserInfo();
          this.onGetUserInfoMyP();
        })
        .catch((error) => {
          console.log(">>>> sendDataAPI error", error);
        });
    },
    async onGetUserInfo() {
      const response = await this.$connect("/user", "GET");
      this.$store.commit("setUserInfo", response.body.info.user);
    },
    async onGetUserInfoMyP () {
      const response = await this.$connect(
        `/user/persona/${this.storeUserInfo.userKey}`,
        "GET"
      );
      const userInfo = response.body.info.user;
      this.$store.commit("setUserInfoMyP", userInfo);
    },
    onClickGoToMyPage() {
      if (StorageUtils.getPreRouterName() === "UserRecommendFC") {
        this.$router.push("/user/mypDetail/true");
      } else if (this.userType == "user") {
        this.$router.push("/user/myPage");
      } else {
        this.$router.push("/fc/myPage");
      }
    },
  },
};
</script>