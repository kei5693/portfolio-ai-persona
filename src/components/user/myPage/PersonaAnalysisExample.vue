<template>
  <!-- 페르소나 진단 결과 예시 -->
  <div class="layerBox dark example on">
    <div class="layerContent">
      <button type="button" class="layerClose" @click="closeExample">
        <img src="@/assets/img/layerCloseBtn.png" alt="" />
      </button>
      <p class="exText">페르소나 결과 예시</p>

      <div class="psnResultExample">
        <img :src="require('@/assets/img/mypExample.png')" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    closeExample() {
      this.$emit("closeExample");
    },
  },
};
</script>