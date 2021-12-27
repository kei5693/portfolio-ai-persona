<template>
  <div class="commonHeader">
    <v-app-bar app>
      <div class="tabBox">
        <router-link to="/user/feedMain" class="tabLinkFeed">Feed</router-link>
        <router-link to="/user/myPage" class="tabLinkMyp">my P</router-link>
      </div>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon
      ><!-- 햄버거 메뉴 컨트롤러 -->
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: null,
    };
  },
  mounted() {
    var targetHeader = document.querySelector("#wrap"),
      targetHeaderAttr = targetHeader.getAttribute("class"),
      onTarget = document.querySelectorAll(".tabBox a");

    if (targetHeaderAttr === "feedMain") {
      onTarget[0].classList.add("on");
    }
    if (targetHeaderAttr === "mypMain") {
      onTarget[1].classList.add("on");
    }
  },
};
</script>