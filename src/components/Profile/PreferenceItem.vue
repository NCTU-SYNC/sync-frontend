<template>
  <b-container class="no-gutters pl-0 pr-0 pb-3 mt-2">
    <b-form-checkbox
      v-model="preference.status"
      switch
      class="switch float-right"
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

// FIXME: outline appears when toggling
.custom-switch {
  $width: 3rem;
  $height: calc(#{$width} / 2);

  width: $width;
  height: $height;

  & > input {
    & ~ label::before {
      border-color: $Neture-N-3 !important;
      background-color: $Neture-N-3 !important;
      width: $width !important;
      height: $height !important;
      border-radius: $width !important;
    }

    & ~ label::after {
      background-color: white !important;
      width: calc(#{$height} - 4px) !important;
      height: calc(#{$height} - 4px) !important;
      border-radius: 50% !important;
    }

    &:checked {
      & ~ label::before {
        border-color: $blue !important;
        background-color: $blue !important;
      }
      & ~ label::after {
        transform: translateX($height) !important;
      }
    }
  }
}

#description {
  color: rgba(0, 0, 0, 0.45);
  width: 320px;
  word-wrap: break-word;
}
</style>
