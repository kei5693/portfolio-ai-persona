<template>
  <div id="wrap" class="salesLibrary fc">
    <!-- S: 앱 헤더 -->
    <commonHeaderFcFeedPsn></commonHeaderFcFeedPsn>
    <!-- E: 앱 헤더 -->

    <!-- S: 콘텐츠 -->
    <v-container>
      <div class="libraryBox">
        <h2>나만의 세일즈 라이브러리</h2>
        <ul>
          <li
            v-for="(sales, index) in libraryList"
            :key="`libraryList${index}`"
          >
            <a @click="onclickLibrary">
              <div class="visual"><img :src="`${sales.img}`" alt="" /></div>
              <div class="text">
                <strong>{{ sales.title }}</strong>
                <span>{{ sales.date }}</span>
                <button type="button" @click.stop="onClickMenuBtn">메뉴</button>
              </div>
            </a>
          </li>
        </ul>
        <div class="btnMenu">
          <button type="button" class="newBtn" @click="onClicknewBtn">
            신규
          </button>
          <button type="button" class="editBtn" @click="onClickeditBtn">
            편집
          </button>
        </div>
      </div>
    </v-container>
    <!-- E: 콘텐츠 -->

    <commonFooter crtPage="sales"></commonFooter>
  </div>
</template>

<script>
import commonHeaderFcFeedPsn from "@/components/include/FcAgentHeader";
import commonFooter from "@/components/include/FcCommonFooter";

export default {
  data() {
    return {
      drawer: null,
      libraryList: [
        {
          title:
            "1.건강하게 사는 이야기 건강하게 사는 이야기 건강하게 사는 이야기",
          date: "21.05.12",
          img: "https://via.placeholder.com/50",
        },
        {
          title: "2.암보험과 콘텐츠들",
          date: "21.05.13",
          img: "https://via.placeholder.com/50",
        },
        {
          title: "3.건강하게 사는 이야기",
          date: "21.05.14",
          img: "https://via.placeholder.com/50",
        },
        {
          title: "4.암보험과 콘텐츠들",
          date: "21.05.15",
          img: "https://via.placeholder.com/50",
        },
        {
          title: "5.건강하게 사는 이야기",
          date: "21.05.16",
          img: "https://via.placeholder.com/50",
        },
        {
          title: "6.암보험과 콘텐츠들",
          date: "21.05.17",
          img: "https://via.placeholder.com/50",
        },
        {
          title: "7.암보험과 콘텐츠들",
          date: "21.05.18",
          img: "https://via.placeholder.com/50",
        },
        {
          title: "8.암보험과 콘텐츠들",
          date: "21.05.19",
          img: "https://via.placeholder.com/50",
        },
        {
          title: "9.암보험과 콘텐츠들",
          date: "21.05.20",
          img: "https://via.placeholder.com/50",
        },
      ],
    };
  },
  components: {
    commonHeaderFcFeedPsn,
    commonFooter,
  },
  mounted() {},
  methods: {
    onclickLibrary() {
      console.log("onclick Library");
    },
    onClicknewBtn() {
      console.log("onClick newBtn");
    },
    onClickeditBtn() {
      console.log("onClick editBtn");
    },
    onClickMenuBtn() {
      console.log("onClick MenuBtn");
    },
  },
};
</script>