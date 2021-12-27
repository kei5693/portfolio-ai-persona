<template>
  <div class="commonHeader fc">
    <v-app-bar app>
      <div class="title">
        <h1>Fit Me</h1> <span>for Agent</span>
      </div>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon><!-- 햄버거 메뉴 컨트롤러 -->
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: null,
    }
  },
  mounted() {
    var targetHeader = document.querySelector('#wrap'),
        targetHeaderAttr = targetHeader.getAttribute('class'),
        onTarget = document.querySelectorAll('.tabBox a');

    if (targetHeaderAttr === 'feedMain') {
      onTarget[0].classList.add('on');
    }
    if (targetHeaderAttr === 'mypMain') {
      onTarget[1].classList.add('on');
    }
  }
}
</script>