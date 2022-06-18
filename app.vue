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
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Roboto:ital,wght@0,400;0,700;1,400;1,700&display=swap');
body {
  font-family: 'Roboto', sans-serif;
}
.mono,
.mono-inherit input,
.mono-inherit textarea,
.mono-inherit * {
  font-family: 'Roboto Mono', monospace;
}
</style>
