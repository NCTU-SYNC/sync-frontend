<template>
  <button :class="[variant, size, {pill: pill}, {block: block}, {squared: squared}]" @click="handleClick">
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
      default: 'md'
    },
    to: {
      type: [String, Object],
      default: ''
    },
    block: {
      type: Boolean,
      default: false
    },
    squared: {
      type: Boolean,
      default: false
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
.md {
  padding: 0.5rem 1rem; // 8px 16px
}
.lg {
  padding: 1rem 2rem; // 16px 32px
  font-size: 18px;
}
.block {
  width: 100%;
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

.tertiary {
  background-color: transparent;
  color: $text-1;

  &:hover {
    background-color: $gray-2;
  }
  &:disabled {
    color: $text-4;
  }
  &:focus, &:focus-within, &:active {
    box-shadow: 0px 0px 0px 4px $gray-4 !important;
  }
}

.nav {
  background-color: transparent;
  color: $text-1;
  font-weight: bold;

  &:hover {
    color: $blue-4;
  }
  &:disabled {
    color: $text-4;
  }
  &:focus, &:focus-within, &:active {
    color: $blue-5;
    box-shadow: none !important;
    // box-shadow: 0px 0px 0px 4px $blue-2 !important;
  }
}

.pill {
  border-radius: 1.25rem; // 20px
  &.lg {
    border-radius: 50px;
  }
}

.squared {
  border-radius: 0;
}

</style>
