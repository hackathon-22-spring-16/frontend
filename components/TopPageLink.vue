<script setup lang="ts">
const props = defineProps<{
  to: string
}>()
</script>

<template>
  <nuxt-link :to="props.to" class="container">
    <slot /> <v-icon>mdi-arrow-right-thick</v-icon>
  </nuxt-link>
</template>

<style lang="scss" scoped>
.container {
  text-decoration: none;
  color: white;

  position: relative;
  padding: 12px 24px;
  outline: none;
  display: inline-block;
  border: solid white 2px;
  border-radius: 4px;
  opacity: 0.7;
  transition: opacity 0.3s;
  &:hover {
    opacity: 1;
  }
  &::before,
  &::after {
    content: '';
    position: absolute;
    border: solid #fafb02;
    width: 0;
    height: 0;
    opacity: 0;
    transition: all 0.3s ease-in-out;
    border-radius: 4px;
  }
  &::before {
    top: 0;
    left: 0;
    border-width: 2px 0 0 2px;
  }
  &::after {
    bottom: 0;
    right: 0;
    border-width: 0 2px 2px 0;
  }
  &:hover::before,
  &:hover::after {
    opacity: 1;
    width: calc(100% - 0px);
    height: calc(100% - 0px);
  }
}
</style>
