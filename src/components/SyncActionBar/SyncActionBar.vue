<template>
  <div class="action-bar__container">
    <slot />
  </div>
</template>

<style lang="scss">
.action-bar__container {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.16);

  @media screen and (max-width: 679px) {
    padding: 0.5rem 1rem;
  }

  .action-bar__btn {
    display: flex;
    flex-direction: row;
    gap: .25rem;
    padding-right: 1rem;
    border-right: 1px solid rgba(0, 163, 255, 0.3);
    color: $gray-8;

    &:last-of-type {
      border: 0;
      padding-right: 0;
    }

    &:hover {
      cursor: pointer;

      .action-bar__text {
        display: inline;
        cursor: pointer;
      }
    }

    &:active {
      color: $blue-4;

      .action-bar__text {
        display: inline;
        cursor: pointer;
        color: $blue-4;
      }
    }
  }

  .action-bar__text {
    display: none;
    color: $gray-8;
    font-size: 0.875rem;
    line-height: 1.5rem;
  }
}
</style>
