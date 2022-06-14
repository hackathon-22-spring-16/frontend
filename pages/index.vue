<script setup lang="ts">
const count = ref(0)
</script>

<template>
  <v-card>
    <v-card-title> counter </v-card-title>
    <v-card-text>
      <v-btn @click="count++"> count: {{ count }} </v-btn>
      <nuxt-link to="/editor">test</nuxt-link>
    </v-card-text>
  </v-card>
</template>
