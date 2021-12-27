<template>
  <div class="sortUtil">
    <button
      type="button"
      :class="{ on: sortType === 'date_write' }"
      @click="clickSort('date_write')"
    >
      최신순
    </button>
    <span>|</span>
    <button type="button" :class="{ on: sortType === 'sort_index' }">
      인기순
    </button>
  </div>
</template>

<script>
export default {
  props: {
    sortType: {
      type: String,
      default: 'date_write'
    }
  },
  methods: {
    clickSort (value) {
      this.$emit('reloadContent', value)
    }
  }
};
</script>