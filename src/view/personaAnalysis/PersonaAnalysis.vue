<template>
  <div id="wrap" class="diagnosis">
    <!-- S: 앱 헤더 -->
    <v-app-bar app>
      <div class="routerBox" v-if="isPrevPageMyPage">
        <a @click="onClickBack" class="goBack">뒤로가기</a>
        <router-link :to="`/${userType}/feedMain`" class="goHome"
          >홈으로가기</router-link
        >
      </div>
      <v-toolbar-title>나의 페르소나 생성</v-toolbar-title>
      <v-app-bar-nav-icon
        v-if="isPrevPageMyPage"
        @click="drawer = !isShowSideMenu"
      />
      <!-- 햄버거 메뉴 컨트롤러 -->
    </v-app-bar>

    <!-- S: LnB 메뉴 -->
    <v-navigation-drawer v-model="isShowSideMenu" fixed temporary>
    </v-navigation-drawer>
    <!-- E: LnB 메뉴 -->
    <!-- E: 앱 헤더 -->

    <!-- S: 콘텐츠 -->
    <PersonaAnalysisDetail
      :questionAndAnswerList="questionAndAnswerList"
      :personaLv01="personaLv01"
      :personaLv02="personaLv02"
      :personaLv03="personaLv03"
      :startPage="startPage"
      :answerServeyTreeListLength="answerServeyTreeList.length"
      :userType="userType"
    />

    <!-- E: 콘텐츠 -->
  </div>
</template> 
<script>
import PersonaAnalysisDetail from "@/components/personaAnalysis/PersonaAnalysisDetail.vue";
import Constant from "@/constant/Constant.js";
import Storage from "@/utils/storage-utils";

export default {
  components: {
    PersonaAnalysisDetail,
  },
  props: {
    startPage: {
      type: String,
      default: Constant.PERSONA_ANALYSIS_START_PAGE.ONLY_PERSONA_LV01,
    },
    userType: {
      type: String,
      require: true,
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
  },
  created() {
    window.personaAnalysis = this;
    const personaListAPI = new Promise((resolve) => {
      this.$connect("/persona-set/persona", "GET").then((res) => {
        resolve(res.body.info.personaSetPersonaList);
      });
    });
    const personaSetQuestionAnswerAPI = new Promise((resolve) => {
      this.$connect(
        "/persona-set/question-and-answer",
        "GET",
        {},
        { userTypeKey: this.userTypeKey }
      ).then((res) => {
        resolve(res.body.list);
      });
    });
    const personaSetServeyAPI = new Promise((resolve) => {
      this.$connect(
        "/persona-set/servey",
        "GET",
        {},
        { userTypeKey: this.userTypeKey }
      ).then((res) => {
        resolve(res.body.list);
      });
    });
    Promise.all([
      personaListAPI,
      personaSetQuestionAnswerAPI,
      personaSetServeyAPI,
    ]).then((valueList) => {
      this.responsePersona = valueList[0];
      this.responseQuestionAndAnswer = valueList[1];
      this.responseServeyList = valueList[2];
      let start = new Date(); // 시작
      this.init();
      let end = new Date(); // 종료
      console.log("init", end - start, "ms");
    });
  },
  data() {
    return {
      responsePersona: [],
      responseQuestionAndAnswer: [],
      responseServeyList: [],
      isShowSideMenu: false,
      personaList: [],
      questionList: [],
      questionAnswerList: [],
      questionAnswerPersonaList: [],
      answerServeyList: [],
      answerServeyTreeList: [],
      questionAndAnswerList: [],
      backRouterPath: {
        UserProfileSelect: "/user/account",
        UserMyPMain: "/user/myPage",
        UserMyPDetail: "/user/mypDetail",
        UserRecommendFC: "/user/recommendFC",
        FcAccount: "/fc/account",
      },
      prevRoute: null,
    };
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  computed: {
    userTypeKey() {
      return this.userType == "user" ? 2 : 1;
    },
    isPrevPageMyPage() {
      if (this.prevRoute == null || this.prevRoute.path == "/") {
        return false;
      }
      return (
        this.prevRoute.path == "/fc/myPage" ||
        this.prevRoute.path == "/user/myPage"
      );
    },
  },
  methods: {
    onClickBack() {
      const preRouterName = Storage.getPreRouterName();

      console.log(
        "뒤로 갈 경로: ",
        preRouterName,
        this.backRouterPath[preRouterName]
      );
      let backRouterPath = this.backRouterPath[preRouterName];

      if (backRouterPath === undefined) {
        this.$router.go(-1);
      } else {
        this.$router.push({ path: this.backRouterPath[preRouterName] });
      }
    },
    init() {
      this.personaList = this.responsePersona;
      this.updateServeyList(this.responseServeyList);
      this.updateQuestionAndAnswerList(this.responseQuestionAndAnswer);
      this.updatePeterQuestionList();
    },
    updateServeyList(responseServeyDataList) {
      this.answerServeyList = this._.chain(responseServeyDataList)
        .map((d, idx, list) => {
          return Object.assign(d, {
            personaSetAnswerServeyMetaObject: this._.chain(list)
              .filter({
                personaSetAttrKey: d.personaSetAttrKey,
                personaSetAttrVersion: d.personaSetAttrVersion,
                personaSetAnswerServeyKey: d.personaSetAnswerServeyKey,
              })
              .map((meta) => {
                return JSON.parse(meta.personaSetAnswerServeyMeta);
              })
              .reduce(
                (result, obj) =>
                  Object.assign(result, obj, {
                    dataType:
                      Constant.PERSONA_SET_DATA_TYPE
                        .PERSONA_SET_ANSWER_SERVEY_META,
                  }),
                {}
              )
              .value(),
          });
        }) // PersonaSetAnswerServeyMeta 정보만 추출하여 객체로
        .uniqWith((a, b) => {
          return (
            a.personaSetAttrKey == b.personaSetAttrKey &&
            a.personaSetAttrVersion == b.personaSetAttrVersion &&
            a.personaSetAnswerServeyKey == b.personaSetAnswerServeyKey
          );
        }) // Meta 정보로 인해 중복된 정보 삭제
        .map((d) => {
          return {
            dataType: Constant.PERSONA_SET_DATA_TYPE.PERSONA_SET_ANSWER_SERVEY,
            personaSetAttrKey: d.personaSetAttrKey,
            personaSetAttrVersion: d.personaSetAttrVersion,
            personaSetAnswerServeyKey: d.personaSetAnswerServeyKey,
            personaSetAnswerServeyParentKey: d.personaSetAnswerServeyParentKey,
            personaSetAnswerServeyDepth: d.personaSetAnswerServeyDepth,
            personaSetAnswerServeySortIndex: d.personaSetAnswerServeySortIndex,
            personaSetAnswerServeyTitle: d.personaSetAnswerServeyTitle,
            personaSetAnswerServeyDesc: d.personaSetAnswerServeyDesc,
            personaSetAnswerServeyMetaObject:
              d.personaSetAnswerServeyMetaObject,
            qustionAnswerList: [],
            question: {},
          };
        })
        .map((d, idx, list) => {
          Object.assign(d, {
            parentAnser: this._.find(list, {
              personaSetAttrKey: d.personaSetAttrKey,
              personaSetAttrVersion: d.personaSetAttrVersion,
              personaSetAnswerServeyKey: d.personaSetAnswerServeyParentKey,
            }),
            childAnswerServeyList: this._.filter(list, {
              personaSetAttrKey: d.personaSetAttrKey,
              personaSetAttrVersion: d.personaSetAttrVersion,
              personaSetAnswerServeyParentKey: d.personaSetAnswerServeyKey,
            }),
          });
          return d;
        })
        .value();

      this.answerServeyTreeList = this._.filter(this.answerServeyList, {
        personaSetAnswerServeyDepth: 0,
      });
    },
    updateQuestionAndAnswerList(responseQuestionAndAnswer) {
      this.questionList = this._.chain(responseQuestionAndAnswer)
        .uniqWith((a, b) => {
          return (
            a.personaSetAttrKey == b.personaSetAttrKey &&
            a.personaSetAttrVersion == b.personaSetAttrVersion &&
            a.personaSetQuestionKey == b.personaSetQuestionKey
          );
        }) // Answer 정보로 인해 중복된 정보 삭제
        .map((d) => {
          return {
            dataType: Constant.PERSONA_SET_DATA_TYPE.PERSONA_SET_QUESTION,
            personaSetAttrKey: d.personaSetAttrKey,
            personaSetAttrVersion: d.personaSetAttrVersion,
            personaSetQuestionKey: d.personaSetQuestionKey,
            personaSetQuestionSortIndex: d.personaSetQuestionSortIndex,
            personaSetQuestionTitle: d.personaSetQuestionTitle,
            personaSetQuestionSubject: d.personaSetQuestionSubject,
            personaSetQuestionDisplayTypeKey:
              d.personaSetQuestionDisplayTypeKey,
            personaSetQuestionDisplayTypeMeta:
              d.personaSetQuestionDisplayTypeMeta,
            personaSetQuestionDisplayTypeName:
              d.personaSetQuestionDisplayTypeName,
            qustionAnswerList: [],
            isSkipQuestion: false,
          };
        })
        .value();

      this.questionAnswerList = this._.chain(responseQuestionAndAnswer)
        .uniqWith((a, b) => {
          return (
            a.personaSetAttrKey == b.personaSetAttrKey &&
            a.personaSetAttrVersion == b.personaSetAttrVersion &&
            a.personaSetQuestionKey == b.personaSetQuestionKey &&
            a.personaSetAnswerKey == b.personaSetAnswerKey
          );
        }) // PersonaSetAnswerPersona 정보로 인해 중복된 정보 삭제
        .map((d, idx) => {
          var findQuestion = this._.find(this.questionList, {
            personaSetAttrKey: d.personaSetAttrKey,
            personaSetAttrVersion: d.personaSetAttrVersion,
            personaSetQuestionKey: d.personaSetQuestionKey,
          });

          var result = {
            idx: idx,
            dataType: Constant.PERSONA_SET_DATA_TYPE.PERSONA_SET_ANSWER,
            personaSetAttrKey: d.personaSetAttrKey,
            personaSetAttrVersion: d.personaSetAttrVersion,
            personaSetQuestionKey: d.personaSetQuestionKey,
            personaSetAnswerKey: d.personaSetAnswerKey,
            personaSetAnswerSortIndex: d.personaSetAnswerSortIndex,
            personaSetAnswerTitle: d.personaSetAnswerTitle,
            personaSetAnswerValue: d.personaSetAnswerValue,
            personaSetAnswerServeyKey: d.personaSetAnswerServeyKey,
            personaSetAnswerServey: this._.find(this.answerServeyList, {
              personaSetAttrKey: d.personaSetAttrKey,
              personaSetAttrVersion: d.personaSetAttrVersion,
              personaSetAnswerServeyKey: d.personaSetAnswerServeyKey,
            }),
            question: findQuestion,
            answerPersonaList: [],
            userValue: "",
          };

          if (findQuestion) {
            findQuestion.qustionAnswerList.push(result);
          }

          var findAnswerServey = this._.find(this.answerServeyList, {
            personaSetAttrKey: d.personaSetAttrKey,
            personaSetAttrVersion: d.personaSetAttrVersion,
            personaSetAnswerServeyKey: d.personaSetAnswerServeyKey,
          });
          if (findAnswerServey) {
            findAnswerServey.qustionAnswerList.push(result);
            findAnswerServey.question = result.question;
          }

          return result;
        })
        .value();

      this.questionAnswerPersonaList = this._.chain(responseQuestionAndAnswer)
        .map((d) => {
          var findQuestionAnswer = this._.find(this.questionAnswerList, {
            personaSetAttrKey: d.personaSetAttrKey,
            personaSetAttrVersion: d.personaSetAttrVersion,
            personaSetQuestionKey: d.personaSetQuestionKey,
            personaSetAnswerKey: d.personaSetAnswerKey,
          });

          var result = {
            dataType: Constant.PERSONA_SET_DATA_TYPE.PERSONA_SET_ANSWER_PERSONA,
            personaSetAttrKey: d.personaSetAttrKey,
            personaSetAttrVersion: d.personaSetAttrVersion,
            personaSetQuestionKey: d.personaSetQuestionKey,
            personaSetAnswerKey: d.personaSetAnswerKey,
            personaSetAnswerPersonaKey: d.personaSetAnswerPersonaKey,
            persona: this._.find(this.personaList, {
              personaKey: d.personaSetAnswerPersonaKey,
            }),
            answer: findQuestionAnswer,
          };

          if (findQuestionAnswer) {
            // answerList에 퍼소나리스트 정보 주입 ( 양방향 참조 구조 )
            findQuestionAnswer.answerPersonaList.push(result);
          }

          return result;
        }) // PersonaSetAnswer 정보로 인해 중복된 정보 삭제
        .uniqWith((a, b) => {
          return (
            a.personaSetAttrKey == b.personaSetAttrKey &&
            a.personaSetAttrVersion == b.personaSetAttrVersion &&
            a.personaSetQuestionKey == b.personaSetQuestionKey &&
            a.personaSetAnswerKey == b.personaSetAnswerKey
          );
        })
        .value();
    },
    updatePeterQuestionList() {
      const extractData = (obj, serveyTreeIndex) => {
        var extractDataResult = [];

        const addExtractDataResult = (type, data, obj, meta, question) => {
          var isAdd =
            obj.dataType ==
            Constant.PERSONA_SET_DATA_TYPE.PERSONA_SET_ANSWER_SERVEY
              ? data.length > 0
              : Object.keys(data).length > 0;
          if (isAdd) {
            extractDataResult.push({
              serveyTreeIndex: serveyTreeIndex,
              type: type,
              data: data,
              dataType: obj.dataType,
              dataTitle:
                obj.dataType ==
                Constant.PERSONA_SET_DATA_TYPE.PERSONA_SET_ANSWER_SERVEY
                  ? obj.personaSetAnswerServeyTitle
                  : obj.personaSetQuestionTitle,
              dataKey:
                obj.dataType ==
                Constant.PERSONA_SET_DATA_TYPE.PERSONA_SET_ANSWER_SERVEY
                  ? `${obj.dataType}_${obj.personaSetAttrKey}_${obj.personaSetAttrVersion}_${obj.personaSetAnswerServeyKey}`
                  : `${obj.dataType}_${obj.personaSetAttrKey}_${obj.personaSetAttrVersion}_${obj.personaSetQuestionKey}`,
              chatStatus: Constant.USER_CHAT_STATUS.READY,
              serveyMeta: meta,
              question: question,
            });
          }
        };
        if (
          obj.dataType ==
            Constant.PERSONA_SET_DATA_TYPE.PERSONA_SET_ANSWER_SERVEY &&
          obj.personaSetAnswerServeyMetaObject.personaChatMsgBefore
        ) {
          addExtractDataResult(
            "personaChatMsgBefore",
            obj.personaSetAnswerServeyMetaObject.personaChatMsgBefore,
            obj,
            obj.personaSetAnswerServeyMetaObject,
            obj.question
          );
        }
        // childAnswerServeyList 체크
        this._.forEach(obj.childAnswerServeyList, (d) => {
          var tmpResult = extractData(d);
          extractDataResult = extractDataResult.concat(tmpResult);
        });

        // qustionAnswerList 체크
        if (Object.keys(obj.question).length > 0) {
          addExtractDataResult(
            "question",
            obj.question,
            obj.question,
            obj.personaSetAnswerServeyMetaObject,
            obj.question
          );
        }

        if (
          obj.dataType ==
            Constant.PERSONA_SET_DATA_TYPE.PERSONA_SET_ANSWER_SERVEY &&
          obj.personaSetAnswerServeyMetaObject.personaChatMsgAfter
        ) {
          addExtractDataResult(
            "personaChatMsgAfter",
            obj.personaSetAnswerServeyMetaObject.personaChatMsgAfter,
            obj,
            obj.personaSetAnswerServeyMetaObject,
            obj.question
          );
        }

        return extractDataResult;
      };

      this.questionAndAnswerList = this._.chain(this.answerServeyTreeList)
        .map((d, idx) => {
          return extractData(d, idx);
        })
        .map((d, idx) => {
          return this._.chain(d)
            .uniqWith((a, b) => {
              return a.dataKey == b.dataKey && a.type == b.type;
            })
            .forEach((data, dataIdx) => {
              data.key = `${idx}_${dataIdx + 1}`;
            })
            .value();
        })
        .value();
    },
  },
};
</script>