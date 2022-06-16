<script setup>
const res = await useFetch('https://back-end.hackathon-22-spring-16.trap.show/echo', {
  headers: useRequestHeaders([('cookie')])
})
onMounted(async () => {
  console.log('response', res.value)
  console.log('response.data', res.data.value)
  console.log('start refresh ...')
  await res.refresh()
  console.log('response', res.value)
  console.log('response.data', res.data.value)
})
</script>

<template>
  <div>
    <h1>This is Test Page</h1>
    <div>
      {{ res.data }}
    </div>
  </div>
</template>
