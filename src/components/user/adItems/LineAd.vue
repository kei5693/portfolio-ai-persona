<template>
  <div class="lineAd">
    <div class="adsCopy flexBox">
      <router-link to="">
        <dl>
          <dt>{{this.lineTitle}}</dt>
          <dd>{{this.lineSubTitle}}</dd>
        </dl>
      </router-link>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        lineTitle: "새내기 직장인의 이야기 궁금하지 않으세요?",
        lineSubTitle: "그들의 이야기 읽어보기  >"
      }
    }
  }
</script>
