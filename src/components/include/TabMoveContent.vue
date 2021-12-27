<template>
  <!-- 추천 콘텐츠 이동하기 탭 버튼 -->
  <div class="recommendContentLink">
    <a href="javascript:void(0)" @click="onClickMove">
      <div class="linkTitle">
        {{ defaultPersona }}에게 추천하는<br />
        콘텐츠 보러가기🧾
      </div>
      <div class="counting">
        전체 글 <b>{{ contentTotalCount | comma }}</b
        >개
      </div>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    clickeRouterPath: {
      type: String,
      default: '/user/feedMain',
      required: false
    },
    routerParam: {
      type: Object,
      default: () => {
        return {}
      },
      required: false
    },
    defaultPersona: {
      type: String,
      default: ''
    },
    contentTotalCount: {
      type: Number,
      default: 0,
      required: false
    },
  },
  methods: {
    onClickMove () {
      let params = {}

      Object.keys(this.routerParam).forEach(v => {
        params[v] = this.routerParam[v]
      })

      this.$router.push({ path: this.clickeRouterPath, query: params })
    }
  }
};
</script>