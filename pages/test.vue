<script setup>
const res = await useFetch('https://back-end.hackathon-22-spring-16.trap.show/echo', {
  headers: useRequestHeaders([('cookie')]) || useCookies()
})
onMounted(async () => {
  console.log('response', res.value)
  console.log('response.data', res.data.value)
  console.log('start refresh ...')
  await res.refresh()
  console.log('response', res.value)
  console.log('response.data', res.data.value)
})
const onClick = async () => {
  const { data } = await useFetch('https://back-end.hackathon-22-spring-16.trap.show/echo')
  console.log('response', data.value)
}
</script>

<template>
  <div>
    <h1>This is Test Page</h1>
    <div>
      {{ res.data }}
    </div>
    <v-btn @click="onClick">click</v-btn>
  </div>
</template>
