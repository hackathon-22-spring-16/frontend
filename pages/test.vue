<script setup>
const res = await useFetch(
  `https://brain-t.api.trap.games/get-code/SSlime/GjCDrRju`
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
