<template>
  <div class="layerBox dark simpleType on">
      <div class="layerContent">
        <div class="titleBox">
          <h4>{{ title }}</h4>
          <p v-html="desc"></p>
        </div>

        <div class="btnBox half">
          <button type="button" @click="clickConfirm">예</button>
          <button type="button" @click="clickClose">아니오</button>
        </div>
      </div>
  </div>
</template>

<script>
  export default {
    props:{
      title:{
        type: String,
        default: ''
      },
      desc: {
        type: String,
        default: ''
      }
    },
    methods:{
      clickConfirm() {
        this.$emit("confirmBtn", true);
      },
      clickClose() {
        this.$emit("confirmBtn", false);
      },
    }
  }
</script>