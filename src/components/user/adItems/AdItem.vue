<template>
  <div class="adItems">
    <router-link to="/user/contentViewer/adContentsView">
      <div class="itemBody">
        <div class="thumbImg">
          <img
            src="https://via.placeholder.com/702x372/bff0fd/?text=AD_Img"
            alt=""
          />
          <span>AD</span>
        </div>
        <dl>
          <dt>{{ this.adTitle }}</dt>
        </dl>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  data() {
    return {
      adTitle:
        "광고여도 쓸말은 많거든요? 하하하하하하하하하 광고여도 쓸말은 많거든요? 하하하하하하하하하 광고여도 쓸말은 많거든요? 하하하하하하하하하",
      personaMain: "아이엠싱글",
      personaType: "인생설계스타터",
      reply: 129,
      helpful: 59,
      view: 259,
      share: 43,
      latest: "6시간",
    };
  },
};
</script>