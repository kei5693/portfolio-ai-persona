<template>
  <div
    class="toastBox chatUserQuestion"
    ref="toastBox"
    :class="{
      on: isShowQuestion,
    }"
  >
    <div class="inner">
      <div class="progressBar" v-if="isShowProgressBar">
        <div class="numberTxt">{{ Math.min(progressBarPercent, 100) }}%</div>
        <span
          ><em :style="`width:${Math.min(progressBarPercent, 100)}%`"></em
        ></span>
      </div>
      <template v-if="displayTypeName == QUESTION_DISPLAY_TYPE.USER_TEXT">
        <div class="inputBox">
          <p v-html="title"></p>
          <div>
            <input
              :type="inputType"
              v-model="answerList[0].userValue"
              :placeholder="placeholderText"
            />
          </div>
        </div>
      </template>
      <template
        v-if="displayTypeName == QUESTION_DISPLAY_TYPE.USER_TEXT_NUMBER"
      >
        <div
          class="inputBox"
          :class="QUESTION_DISPLAY_TYPE.USER_TEXT_NUMBER | convertClassName"
        >
          <p v-html="title"></p>
          <div>
            <input
              :type="inputType"
              v-model="answerList[0].userValue"
              :placeholder="placeholderText"
            />
            <span>만원</span>
          </div>
        </div>
      </template>
      <template v-if="displayTypeName == QUESTION_DISPLAY_TYPE.SELECT_BOX">
        <div
          class="inputBox"
          :class="QUESTION_DISPLAY_TYPE.SELECT_BOX | convertClassName"
        >
          <p v-html="title"></p>
          <div>
            <v-select
              :items="
                _.map(answerList, (d) => {
                  return {
                    text: d.personaSetAnswerTitle,
                    value: d.personaSetAnswerValue,
                  };
                })
              "
              v-model="selectValue"
              solo
              outlined
              @change="changeSelectBoxAndRadio"
            ></v-select>
          </div>
        </div>
      </template>
      <template v-if="displayTypeName == QUESTION_DISPLAY_TYPE.RADIO_1">
        <div class="inputBox">
          <p v-html="title"></p>
          <div>
            <div class="surveyBox">
              <span
                v-for="(answer, answerIdx) in answerList"
                :key="`answer-${displayTypeName}-${answerIdx}`"
              >
                <input
                  type="radio"
                  :name="`${displayTypeName}-${questionKey}`"
                  :id="`${displayTypeName}-${questionKey}-${answerIdx}`"
                  v-model="radioValue"
                  :value="answer.personaSetAnswerValue"
                />
                <label :for="`${displayTypeName}-${questionKey}-${answerIdx}`">
                  <span>{{ answer.personaSetAnswerTitle }}</span>
                </label>
              </span>
            </div>
          </div>
        </div>
      </template>
      <template v-if="displayTypeName == QUESTION_DISPLAY_TYPE.RADIO_2">
        <div class="inputBox">
          <p v-html="title"></p>
          <div>
            <div class="surveyBox half">
              <span
                v-for="(answer, answerIdx) in answerList"
                :key="`answer-${displayTypeName}-${answerIdx}`"
              >
                <input
                  type="radio"
                  :name="`${displayTypeName}-${questionKey}`"
                  :id="`${displayTypeName}-${questionKey}-${answerIdx}`"
                  v-model="radioValue"
                  :value="answer.personaSetAnswerValue"
                />
                <label :for="`${displayTypeName}-${questionKey}-${answerIdx}`">
                  <span>{{ answer.personaSetAnswerTitle }}</span>
                </label>
              </span>
            </div>
          </div>
        </div>
      </template>
      <template
        v-if="
          displayTypeName == QUESTION_DISPLAY_TYPE.MULTI_SELECT_1 ||
          displayTypeName == QUESTION_DISPLAY_TYPE.MULTI_SELECT_2
        "
      >
        <div class="inputBox">
          <p v-html="title"></p>
          <div>
            <div
              class="surveyBox"
              :class="{
                harf: displayTypeName == QUESTION_DISPLAY_TYPE.MULTI_SELECT_2,
              }"
            >
              <template v-if="isPersonaQuestion && !isTiePersonaQuestion">
                <span
                  v-for="(answer, answerIdx) in personaQuestionAnswerListStep01"
                  :key="`answer-${displayTypeName}-${answerIdx}`"
                >
                  <input
                    type="checkbox"
                    :name="`${displayTypeName}-${questionKey}`"
                    :id="`${displayTypeName}-${questionKey}-${answerIdx}`"
                    v-model="answer.userValue"
                  />
                  <label
                    :for="`${displayTypeName}-${questionKey}-${answerIdx}`"
                  >
                    <span>{{ answer.personaSetAnswerTitle }}</span>
                  </label>
                </span>
              </template>
              <template v-if="isPersonaQuestion && isTiePersonaQuestion">
                <span
                  v-for="(answer, answerIdx) in personaQuestionAnswerListStep02"
                  :key="`answer-${displayTypeName}-${answerIdx}`"
                >
                  <input
                    type="radio"
                    :name="`${displayTypeName}-${questionKey}`"
                    :id="`${displayTypeName}-${questionKey}-${answerIdx}`"
                    v-model="personaQuestionStep02Value"
                    :value="answer.personaSetAnswerTitle"
                  />
                  <label
                    :for="`${displayTypeName}-${questionKey}-${answerIdx}`"
                  >
                    <span>{{ answer.personaSetAnswerTitle }}</span>
                  </label>
                </span>
              </template>

              <template v-if="!isPersonaQuestion">
                <span
                  v-for="(answer, answerIdx) in answerList"
                  :key="`answer-${displayTypeName}-${answerIdx}`"
                >
                  <input
                    type="checkbox"
                    :name="`${displayTypeName}-${questionKey}`"
                    :id="`${displayTypeName}-${questionKey}-${answerIdx}`"
                    v-model="answer.userValue"
                  />
                  <label
                    :for="`${displayTypeName}-${questionKey}-${answerIdx}`"
                  >
                    <span>
                      {{ answer.personaSetAnswerTitle }}
                    </span>
                  </label>
                </span>
              </template>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="confirmBox" :class="{ on: checkUserValue }">
      <button type="button" class="send" @click="completeAnswer">
        <p v-if="!isThisQuestionEditMode">전송</p>
        <p v-else>수정</p>
      </button>
    </div>
  </div>
</template>
<script>
import Constant from "@/constant/Constant.js";
export default {
  props: {
    thisChatData: {
      type: Object,
      require: true,
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
  },
  filters: {
    convertClassName(value) {
      return `class${value}`;
    },
  },
  created() {
    window.test2 = this;
  },
  mounted() {
    // 상태 시작으로 변경 start
    setTimeout(() => {
      this.$emit("startQuestion");
    }, 200);

    this.setDefaultValue();
  },
  data() {
    return {
      selectValue: "",
      radioValue: "",
      personaQuestionStep02Value: "",
      isTiePersonaQuestion: false, // 퍼소나 질문 동점 여부
      tiePersonaKeyList: [], //퍼소나 동점 퍼소나 키 목록
    };
  },
  watch: {
    radioValue(value) {
      this.changeSelectBoxAndRadio(value);
    },
    personaQuestionStep02Value(value) {
      this.chagePersonaQuestionStep02Value(value);
    },
    isShowQuestion() {
      this.$emit("setChatUIscrollDown");
    },
  },
  computed: {
    QUESTION_DISPLAY_TYPE() {
      return Constant.QUESTION_DISPLAY_TYPE;
    },
    isThisQuestionEditMode() {
      return this.editModeChatKey == this.thisChatData.key;
    },
    isShowQuestion() {
      var result = false;
      if (this.thisChatData.key == this.editModeChatKey) {
        result = true;
        if (this.isPersonaQuestion) {
          this.resetAnswerUserValue();
        }
      } else {
        result =
          this.editModeChatKey.length == 0 &&
          this.thisChatData.chatStatus == Constant.USER_CHAT_STATUS.START;
      }

      return result;
    },
    question() {
      return this.thisChatData.data;
    },
    questionKey() {
      return `${this.thisChatData.data.personaSetAttrKey}-${this.thisChatData.data.personaSetAttrVersion}-${this.thisChatData.data.personaSetQuestionKey}`;
    },
    questionObjKeys() {
      return Object.keys(this.question);
    },
    displayTypeName() {
      return this.questionObjKeys.length > 0
        ? this.question.personaSetQuestionDisplayTypeName
        : "";
    },
    inputType() {
      return this.displayTypeName ==
        Constant.QUESTION_DISPLAY_TYPE.USER_TEXT_NUMBER
        ? "number"
        : "text";
    },
    placeholderText() {
      var text =
        this.displayTypeName == Constant.QUESTION_DISPLAY_TYPE.USER_TEXT_NUMBER
          ? "예) 2500"
          : "${title}을 입력해 주세요.";
      return this.questionObjKeys.length > 0
        ? text.replace(
            "${title}",
            this.question.qustionAnswerList[0].personaSetAnswerTitle
          )
        : "";
    },
    title() {
      return this.questionObjKeys.length > 0
        ? this.question.personaSetQuestionTitle
        : "";
    },
    // 질문에 퍼소나 정보가 있다면 userPersonaLv01퍼소나 정보에 연관된 문항 정보 리턴
    personaQuestionAnswerList() {
      return this._.chain(this.question.qustionAnswerList)
        .filter((qustionAnswer) => {
          // 퍼소나 Lv1 에 연결되는 Answer 인지 확인
          return (
            this._.filter(qustionAnswer.answerPersonaList, (answerPersona) => {
              if (answerPersona.persona == undefined) {
                return false;
              }
              return (
                answerPersona.persona.personaParentKey == this.userPersonaLv01
              );
            }).length > 0
          );
        })
        .groupBy((d) => {
          var findPersonaKey = this._.chain(d.answerPersonaList)
            .find((answerPersona) => {
              return (
                answerPersona.persona.personaParentKey == this.userPersonaLv01
              );
            })
            .get("persona.personaKey")
            .value();
          var personaStringKey = `personaKey_${findPersonaKey}`;
          this._.set(d, "personaStringKey", personaStringKey);
          return personaStringKey;
        })
        .map((d) => {
          const maxAnswerCount =
            d[0].personaSetAnswerServey.personaSetAnswerServeyMetaObject
              .maxAnswerCount;
          this._.forEach(d.slice(0, maxAnswerCount), (d) => {
            d.personaQuestionStep = 1;
          });
          this._.forEach(d.slice(maxAnswerCount), (d) => {
            d.personaQuestionStep = 2;
          });
          return d;
        })
        .reduce((r, d) => {
          return r.concat(d);
        }, [])
        .value();
    },
    personaQuestionAnswerListStep01() {
      return this._.filter(this.personaQuestionAnswerList, {
        personaQuestionStep: 1,
      });
    },
    personaQuestionAnswerListStep02() {
      return this._.chain(this.personaQuestionAnswerList)
        .filter({
          personaQuestionStep: 2,
        })
        .filter((d) => {
          var result = false;
          this._.forEach(this.tiePersonaKeyList, (tiePersonaKey) => {
            result = !result
              ? this._.chain(d.answerPersonaList)
                  .flatMap("persona")
                  .flatMap("personaKey")
                  .value()
                  .includes(parseInt(tiePersonaKey))
              : result;
          });

          return result;
        })
        .value();
    },
    // 퍼소나 분석용 질문 여부
    isPersonaQuestion() {
      return this.personaQuestionAnswerList.length > 0;
    },
    answerList() {
      var result = [];
      if (this.questionObjKeys.length > 0) {
        if (this.thisChatData.serveyTreeIndex == 1) {
          if (this.isPersonaQuestion) {
            // 퍼소나 질문에 동점 여부 확인
            if (!this.isTiePersonaQuestion) {
              result = this.personaQuestionAnswerListStep01;
            } else {
              result = this.personaQuestionAnswerListStep02;
            }
          } else {
            result = this.question.qustionAnswerList;
          }
        } else {
          result = this.question.qustionAnswerList;
        }
      }

      if (
        this.thisChatData.serveyMeta.personaAnalysisType == "personaLevel03"
      ) {
        return this._.shuffle(result);
      }

      return result;
    },
    checkUserValue() {
      var result = false;

      if (this.questionObjKeys.length > 0) {
        switch (this.displayTypeName) {
          case Constant.QUESTION_DISPLAY_TYPE.USER_TEXT: // OR 연산을 위한 ...
          case Constant.QUESTION_DISPLAY_TYPE.USER_TEXT_NUMBER:
            result = this.answerList[0].userValue.length >= 1;
            break;
          case Constant.QUESTION_DISPLAY_TYPE.SELECT_BOX:
            result =
              this._.filter(this.answerList, (d) => {
                return d.userValue.length >= 1;
              }).length >= 1;
            break;
          case Constant.QUESTION_DISPLAY_TYPE.RADIO_1:
          case Constant.QUESTION_DISPLAY_TYPE.RADIO_2:
            result =
              this._.filter(this.answerList, (d) => {
                return d.userValue.length >= 1;
              }).length >= 1;
            break;
          case Constant.QUESTION_DISPLAY_TYPE.MULTI_SELECT_1:
          case Constant.QUESTION_DISPLAY_TYPE.MULTI_SELECT_2:
            if (this.thisChatData.serveyTreeIndex == 1) {
              var minCount = 1;
              // 퍼소나 분석용 질문 여부
              if (this.isPersonaQuestion) {
                // 퍼소나 동점인 경우
                if (this.isTiePersonaQuestion) {
                  minCount = 1;
                } else {
                  minCount = 1;
                }
              } else {
                minCount = 1;
              }
              result =
                this._.filter(this.answerList, (d) => {
                  return d.userValue;
                }).length >= minCount;
            } else {
              result =
                this._.filter(this.answerList, (d) => {
                  return d.userValue;
                }).length >= 1;
            }
            break;
          default:
            break;
        }
      }
      return result;
    },
    isShowProgressBar() {
      return this.thisChatData.serveyTreeIndex > 0;
    },
  },
  methods: {
    setDefaultValue() {
      switch (this.displayTypeName) {
        case Constant.QUESTION_DISPLAY_TYPE.SELECT_BOX:
          this.changeSelectBoxAndRadio(
            this.answerList[0].personaSetAnswerValue
          );
          break;
      }
    },
    changeSelectBoxAndRadio(value) {
      this._.forEach(this.thisChatData.data.qustionAnswerList, (d) => {
        if (d.personaSetAnswerValue == value) {
          d.userValue = value;
          this.selectValue = value;
        } else {
          d.userValue = "";
        }
      });
    },
    chagePersonaQuestionStep02Value(value) {
      this._.forEach(this.personaQuestionAnswerListStep02, (d) => {
        if (d.personaSetAnswerTitle == value) {
          d.userValue = true;
        } else {
          d.userValue = false;
        }
      });
    },
    completeAnswer() {
      if (this.checkUserValue) {
        switch (this.thisChatData.serveyTreeIndex) {
          case 1:
            // 퍼소타 분석용 질문인 경우 동점이 나올수있으므로 해당 부분 중복 제거용 질문 노출하는 로직
            if (this.isPersonaQuestion) {
              const personaQuestionAnswerInfo =
                this.getPersonaQuestionAnswerInfo();
              this.isTiePersonaQuestion =
                personaQuestionAnswerInfo.isTiePersonaQuestion;
              this.tiePersonaKeyList =
                personaQuestionAnswerInfo.tiePersonaKeyList;

              if (
                this.isTiePersonaQuestion &&
                personaQuestionAnswerInfo.userValueCount > 1
              ) {
                return;
              }
            }
            this.updateGlobalSaveData();
            this.$emit("completedAnswer");
            break;
          default:
            this.updateGlobalSaveData();
            this.$emit("completedAnswer");
            break;
        }
      } else {
        alert(this.thisChatData.dataTitle.appendEulReul() + " 확인해 주세요.");
      }
    },
    updateGlobalSaveData() {
      this._.chain(this.answerList)
        .filter((d) => d.userValue.length > 0)
        .map((d) => {
          var result = {};
          result[
            d.personaSetAnswerServey.personaSetAnswerServeyMetaObject.globalSaveData
          ] = d.userValue;
          return result;
        })
        .groupBy((obj) => Object.keys(obj)[0])
        .reduce((result, list, key) => {
          var tmpArr = [];
          this._.forEach(list, (d) => {
            tmpArr.push(d[key]);
          });
          result[key] = tmpArr.join(",");
          return result;
        }, {})
        .forEach((data, key) => {
          console.log(data, key);
          this.$globalData.setData(key, data);
        })
        .value();
    },
    getPersonaQuestionAnswerInfo() {
      var result = {
        isTiePersonaQuestion: false,
        min: -1,
        max: -1,
        personaList: [],
        lastPersonaKey: -1,
        tiePersonaKeyList: [],
        userValueCount: 0,
      };
      if (this.isPersonaQuestion) {
        var countList = this._.chain(this.personaQuestionAnswerList)
          .filter("userValue")
          .flatMap("answerPersonaList")
          .flatMap("persona")
          .filter((d) => {
            return d.personaParentKey == this.userPersonaLv01;
          })
          .groupBy((d) => {
            return d.personaKey;
          })
          .map((d, k) => {
            return { personaKey: k, count: d.length };
          })
          .value();
        var min = this._.minBy(countList, "count");
        var max = this._.maxBy(countList, "count");
        var tiePersonaKeyList = this._.filter(countList, {
          count: max.count,
        }).reduce((r, d) => {
          r.push(d.personaKey);
          return r;
        }, []);
        Object.assign(result, {
          isTiePersonaQuestion: tiePersonaKeyList.length > 1,
          min: min,
          max: max,
          personaList: countList,
          lastPersonaKey:
            tiePersonaKeyList.length > 1
              ? -1
              : this._.find(countList, { count: max.count }).personaKey,
          tiePersonaKeyList: tiePersonaKeyList,
          userValueCount: this._.chain(this.personaQuestionAnswerList)
            .filter("userValue")
            .value().length,
        });
      }
      return result;
    },
    resetAnswerUserValue() {
      this._.forEach(this.personaQuestionAnswerList, (d) => {
        d.userValue = "";
        this.radioValue = "";
        this.personaQuestionStep02Value = "";
      });
    },
  },
};
</script>