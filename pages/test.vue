<script setup>
const res = useFetch('https://back-end.hackathon-22-spring-16.trap.show/echo')
onMounted(() => {
  console.log(res)
  console.log(res.data)
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
