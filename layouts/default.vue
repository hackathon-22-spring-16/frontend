<script setup lang="ts">
const headers = useHeaders()
</script>

<template>
  <v-app>
    <v-app-bar class="app-bar">
      <div class="app-bar-contents">
        <nuxt-link to="/" class="top-link">
          <img src="@/assets/Title.svg" draggable="false" />
        </nuxt-link>

        <v-avatar v-if="headers['x-showcase-user'] !== '-'" class="right-icon">
          <img
            :src="`https://q.trap.jp/api/1.0/public/icon/${
              headers['x-showcase-user'] ?? 'traP'
            }`"
            alt=""
            height="128"
            width="128"
            class="icon-img"
          />
        </v-avatar>
      </div>
    </v-app-bar>
    <v-main class="main">
      <slot />
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>
.app-bar {
  background-image: linear-gradient(
    to left,
    #2e2069,
    #08083c,
  );
}
.app-bar-contents {
  display: flex;
  width: 100%;
  max-height: 100%;
  justify-content: space-between;
  align-items: center;
}
.top-link {
  max-height: 32px;
  & > img {
    max-height: 32px;
  }
}
.icon-img {
  height: 100%;
  width: 100%;
}
</style>
