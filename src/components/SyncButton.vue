<template>
  <button :class="[variant, {pill: pill}, size]" @click="handleClick">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'SyncButton',
  props: {
    variant: {
      type: String,
      default: 'primary'
    },
    pill: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'default'
    },
    to: {
      type: [String, Object],
      default: ''
    }
  },
  methods: {
    routerPush() {
      if (this.to === '') return
      this.$router.push(this.to)
    },
    handleClick() {
      // Handle parent 'click' event first, then navigation
      this.$emit('click')
      this.routerPush()
    }
  }
}
</script>

<style scoped lang="scss">

button {
  border: none;
  padding: 0.5rem 1rem; // 8px 16px
  border-radius: 0.25rem; // 4px
  &:focus, &:focus-within, &:active {
    box-shadow: 0px 0px 0px 4px $gray-4 !important;
  }
}

// Sizing
.sm {
  padding: 0.25rem 1rem;
  font-size: 14px;
}
.default {
  padding: 0.5rem 1rem; // 8px 16px
}
.lg {
  padding: 1rem 2rem; // 16px 32px
  font-size: 18px;
}

.primary {
  background-color: $blue-4;
  color: $white;

  &:hover {
    background-color: $blue-5;
  }
  &:disabled {
    background-color: $blue-2;
  }
  &:focus, &:focus-within, &:active {
    box-shadow: 0px 0px 0px 4px $blue-1 !important;
  }
}

.pill {
  border-radius: 1.25rem; // 20px
  &.lg {
    border-radius: 50px;
  }
}

</style>
