<template>
  <div class="action-bar__btn" @click="handleClick">
    <sync-icon :icon="icon" :size="iconSize" />
    <span v-if="description.length > 0" class="action-bar__text">{{ description }}</span>
  </div>
</template>

<script>
export default {
  name: 'SyncActionBarBtn',
  props: {
    icon: {
      type: String,
      required: true
    },
    iconSize: {
      type: String,
      default: 'md'
    },
    description: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>
