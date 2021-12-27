<template>
    <div class="layerBox dark simpleType on">
        <div class="layerContent">
            <div class="titleBox">
                <h4>{{ title }}</h4>
                <p v-html="desc"></p>
            </div>

            <div class="btnBox">
                <button type="button" @click="clickConfirm">확인</button>
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
            this.$emit("closeAlert");
        },
    }
  }
</script>