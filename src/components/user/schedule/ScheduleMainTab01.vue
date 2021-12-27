<template>
  <div class="contentBox consultBox">
    <p>원하는 상담 방법을 선택하세요.</p>
    <div class="inner">
      <div
        v-for="(consult, consultIdx) in scheduleTypeList"
        :key="`consult-` + consultIdx"
      >
        <input
          type="radio"
          name="rdo1"
          :ref="`rdo${consultIdx + 1}`"
          :id="`rdo${consultIdx + 1}`"
          :value="consult.title"
          v-model="consultDataType"
          @change="onChangeConsultWay"
        />
        <label
          :for="`rdo${consultIdx + 1}`"
          v-html="consult.description"
        ></label>
      </div>
    </div>
  </div>
</template> 
<script>
export default {
  data() {
    return {
      scheduleTypeList: [
        {
          title: "화상상담",
          description:
            "<span>얼굴을 노출하지 않고,<br>참고자료와 함께 대화할 수 있는</span>화상 상담",
        },
        {
          title: "전화상담",
          description:
            "<span>편하게 직접<br>이것 저것 물어볼 수 있는</span>전화 상담",
        },
        {
          title: "채팅상담",
          description:
            "<span>화상도 전화도 어려우시다면?<br>문자로 하는</span>채팅 상담",
        },
      ],
    };
  },
  props: {
    selectedConsultData: { type: Object, require: true },
  },
  computed: {
    consultDataType: {
      get: function () {
        return this.selectedConsultData.type;
      },
      set: function (data) {
        this.$emit("changeSelectedConsultData", {
          key: "type",
          value: data,
        });
      },
    },
  },
  mounted() {
    this.scrollTop();
  },
  methods: {
    /**
     * 상담 타입 변경 이벤트
     *
     * @method onChangeConsultWay
     */
    onChangeConsultWay() {
      this.$emit("selectType", this.selectedConsultWay);
    },
  },
};
</script>