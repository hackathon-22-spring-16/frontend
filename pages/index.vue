vue
<script setup lang="ts">
import { ref } from "vue";
import CodeEditor from '@/components/CodeEditor.vue'


const count = ref(0)

const code = ref('')

const onClick = () => {
  console.log(code.value)
}

</script>

<template>
  <v-card>
    <v-card-title> counter </v-card-title>
    <v-card-text>
      <v-btn @click="onClick">ボタン</v-btn>
      <v-btn @click="count++"> count: {{ count }} </v-btn>
      <nuxt-link to="/editor">test</nuxt-link>
      <code-editor v-model="code"/>
    </v-card-text>
  </v-card>

  
</template>