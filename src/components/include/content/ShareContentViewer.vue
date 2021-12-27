<template>
  <div class="shareContentViewer" ref="shareContentViewer">
    <content-view
      ref="contentView"
      :content="contentInfo"
      :shareMode="true"
      v-if="isShowContentView"
      @onCloseContentView="() => {}"
    />
  </div>
</template>

<script>
import ContentView from "@/components/include/content/ContentView";
import StorageUtils from "@/utils/storage-utils";
export default {
  components: {
    ContentView,
  },
  props: {
    contentKey: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      contentInfo: null,
    };
  },
  computed: {
    isShowContentView() {
      return this.contentInfo != null;
    },
  },
  created() {
    this.$connect(`/content/${this.contentKey}/one`, "GET").then(
      (contentResponse) => {
        if (contentResponse.success) {
          const isTemplatesData =
            StorageUtils.get(StorageUtils.KEYS.templates).length > 0;

          if (isTemplatesData) {
            this.contentInfo = contentResponse.body.info.content;
          } else {
            this.$connect("/templates", "GET").then((templateResponse) => {
              if (templateResponse.success) {
                StorageUtils.saveTemplate(templateResponse.body.list);
              }
              this.contentInfo = contentResponse.body.info.content;
            });
          }
        } else {
          alert("컨텐츠 정보를 불러올 수 없습니다.");
        }
      }
    );
    // if (contentResponse.success) {
    //   this.contentInfo = contentResponse.body.info.content;
    // }
  },
  mounted() {},
  methods: {},
};
</script>
