<script setup>
// HACK: SSR の際に vuetify が崩れるときがあるので、mount されるまで待つ
// もし他のとこでやばいことになったら外す
const isLoading = ref(true)
onMounted(() => {
  isLoading.value = false
})
</script>

<template>
  <NuxtLayout v-if="!isLoading">
    <NuxtPage />
  </NuxtLayout>
</template>
