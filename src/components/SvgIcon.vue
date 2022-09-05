<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :href="iconName" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    size: {
      type: String,
      default: 'lg'
    },
    icon: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    iconName() {
      return `#ic-${this.icon}`
    },
    svgClass() {
      let size = this.size
      if (!['lg', 'md', 'sm'].includes(size)) {
        size = ''
      }
      if (this.className) {
        return ['svg-icon', this.className, size].join(' ')
      } else {
        return ['svg-icon', size].join(' ')
      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  fill: currentColor;
  overflow: hidden;
}

.lg {
  width: 2rem;
  height: 2rem;
}

.md {
  width: 1.5rem;
  height: 1.5rem;
}

.sm {
  width: 1rem;
  height: 1rem;
}
</style>
