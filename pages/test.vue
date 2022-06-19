<script setup>
const res = await useFetch(
  `http://brain-t.api.trap.games/get-code/${route.params.username}/${route.params.hash}`
)
onMounted(() => {
  console.log(res)
})
</script>

<template>
  <div>
    <h1>This is Test Page</h1>
    <div>
      {{ res }}
    </div>
    <v-btn @click="onClick">click</v-btn>
  </div>
</template>
