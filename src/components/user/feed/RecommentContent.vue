<template>
  <div class="recommendContents pd12">
    <div class="recommendTitle">{{ personaInfo.defaultPersonaName }}에게 추천하는 콘텐츠</div>
    <figure>
      <img src="https://via.placeholder.com/800x320/375989/?text=sampleImg" alt="">
    </figure>
  </div>
</template>
<script>
export default {
  props:{
    personaInfo: {
      type: Object,
      default: () => {
        return {}
      },
      required: true
    },
  }
}
</script>