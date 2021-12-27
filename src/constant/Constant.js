const PERSONA_SET_DATA_TYPE = {
    PERSONA_SET_ANSWER_SERVEY: "personaSetAnswerServey",
    PERSONA_SET_ANSWER_SERVEY_META: "personaSetAnswerServeyMeta",
    PERSONA_SET_QUESTION: "personaSetQuestion",
    PERSONA_SET_ANSWER: "personaSetAnswer",
    PERSONA_SET_ANSWER_PERSONA: "personaSetAnswerPersona",
};

const QUESTION_DISPLAY_TYPE = {
    USER_TEXT: "UserText",
    SELECT_BOX: "SelectBox",
    RADIO_1: "Radio-1",
    RADIO_2: "Radio-2",
    MULTI_SELECT_1: "MultiSelect-1",
    MULTI_SELECT_2: "MultiSelect-2",
    USER_TEXT_NUMBER: "UserTextNumber",
};

const USER_CHAT_STATUS = {
    NEW_ADDED: "added",     // chatList에 추가 된 상태 - 화면에 보여지지 않음
    READY: "ready",         // chatList에 추가 된 상태 - 화면에 보여짐
    START: "start",         // chat 프로세스 상태 - 시작됨
    END: "end",             // chat 프로세스 상태 - 완료됨
    EDIT: "edit",           // chat 프로세스 상태 - 수정중
}

const PERSONA_ANALYSIS_START_PAGE = {
    DEFAULT: "default",
    ONLY_PERSONA_LV01: "onlyPersonaLv01",
    MY_PAGE: "myPage",
    FIND_FC: "findFC"
}
export default { PERSONA_SET_DATA_TYPE, QUESTION_DISPLAY_TYPE, USER_CHAT_STATUS, PERSONA_ANALYSIS_START_PAGE }