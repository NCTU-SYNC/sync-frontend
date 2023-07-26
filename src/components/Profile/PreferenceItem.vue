<template>
  <b-container class="no-gutters pl-0 pr-0 pb-3 mt-2">
    <b-form-checkbox
      v-if="!sm"
      :checked="status"
      switch
      size="lg"
      class="switch--color float-right"
      @change="$emit('changeStatus', option, $event)"
    />
    <div>
      <div id="title">{{ title }}</div>
      <div id="description">{{ description }}</div>
      <b-form-checkbox
        v-if="sm"
        :checked="status"
        switch
        size="lg"
        class="switch--color"
        @change="$emit('changeStatus', title, $event)"
      />
    </div>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    option: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapGetters(['windowWidth']),
    sm() {
      return this.windowWidth < 680
    }
  }
}
</script>

<style lang="scss">
/*
  custom color variables
  TODO: merge into custom.scss
*/
$Neture-N-3: #ededf0;

#description {
  color: rgba(0, 0, 0, 0.45);
  width: 320px;
  word-wrap: break-word;
}

.switch--color {
  & > .custom-control-label {
    &::before {
      background-color: $Neture-N-3;
      border: 0;
    }

    &::after {
      background-color: #fff;
    }
  }

  .custom-control-input:checked ~ .custom-control-label {
    &::before {
      background-color: $blue;
    }
  }
}
</style>
