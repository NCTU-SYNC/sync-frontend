<template>
  <button
    v-b-tooltip.hover.bottom.v-secondary="tooltip"
    class="menu-item"
    :class="{ 'is-active': isActive ? isActive(): null }"
    :title="title"
    @click="action"
  >
    <icon :icon="icon" size="sm" />
  </button>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true
    },

    action: {
      type: Function,
      required: true
    },

    isActive: {
      type: Function,
      default: null
    },

    tooltip: {
      type: String,
      default: null
    }
  },
  methods: {
    getIconUrl(icon) {
      return require(`@/assets/icons/editor/ic-${icon}.svg`)
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-item {
  width: 1.5rem;
  height: 1.5rem;
  border: none;
  background-color: transparent;
  border-radius: 0.25rem;
  margin-left: 0.5rem;
  padding: 0;

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  &.is-active,
  &:hover {
    color: #FFF;
    background-color: $blue;
  }
}
</style>
