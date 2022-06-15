<script setup lang="ts">
const headers = useState('headers')
onMounted(() => {
  console.log(headers.value)
})
</script>

<template>
  <v-app>
    <v-app-bar class="app-bar">header
      <v-avatar>
        <img
          :src="`https://q.trap.jp/api/1.0/public/icon/${headers['X-Showcase-User'] ?? 'traP'}`"
          alt=""
          height="128"
          width="128"
          class="icon-img"
        />
      </v-avatar>
      to: {{ headers['host'] }}

    </v-app-bar>
    <v-main class="main"> content <slot /></v-main>
  </v-app>
</template>

<style lang="scss" scoped>
.icon-img {
  height: 100%;
  width: 100%;
}
</style>
