<script setup>
const res = await useFetch('https://back-end.hackathon-22-spring-16.trap.show/echo')
onMounted(async () => {
  console.log('response', res)
  console.log('response.data', res.data)
  console.log('start refresh ...')
  await res.refresh()
  console.log('response', res)
  console.log('response.data', res.data)
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
