<template>
  <b-container class="no-gutters pl-0 pr-0 pb-3 mt-2">
    <b-form-checkbox
      v-model="preference.status"
      switch
      size="lg"
      class="switch--color float-right"
    />
    <div>
      <div id="title">{{ preference.title }}</div>
      <div id="description">{{ preference.description }}</div>
    </div>
  </b-container>
</template>

<script>
export default {
  props: {
    preference: {
      type: Object,
      required: true
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
