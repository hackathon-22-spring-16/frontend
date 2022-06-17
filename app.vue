<script setup>
// HACK: SSR の際に vuetify が崩れるときがあるので、mount されるまで待つ
// もし他のとこでやばいことになったら外す
const isLoading = ref(true)
onMounted(() => {
  isLoading.value = false
})
const { data: serverHeaders } = await useAsyncData(
  'get-request-header',
  async () => {
    const headers = useRequestHeaders()
    await null
    return headers
  }
)
useHeadersWithDefault(serverHeaders)
</script>

<template>
  <NuxtLayout v-show="!isLoading">
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss">
body {
  font-family: 'Roboto', sans-serif;
}
.mono {
  font-family: 'Roboto Mono', monospace;
}
</style>
