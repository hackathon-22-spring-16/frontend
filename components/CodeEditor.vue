<script setup lang="ts">
import { Codemirror } from 'vue-codemirror'

const props = withDefaults(
  defineProps<{
    modelValue: string
  }>(),
  {
    modelValue: '', // デフォルト値を指定
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', text: string): string
}>()

const code = computed({
  get: () => props.modelValue,
  set: value => {
    // 値に変更があると呼ばれるsetter
    emit('update:modelValue', value)
  },
})

const onClick = () => {
  console.log(code.value)
  emit('update:modelValue', code.value)
}
</script>

<template>
  <div id="app">
    <v-toolbar
      color="green"
      dark
      prominent
      src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
    >
      <v-toolbar-title>Code Editor</v-toolbar-title>

      <v-btn icon>
        <v-icon>mdi-export</v-icon>
      </v-btn>
    </v-toolbar>

    <codemirror
      v-model="code"
      :style="{ height: '400px', width: '700px', color: 'green' }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="1"
    />

    <div>
      <v-btn
        class="exe_button"
        rounded
        color="primary"
        padding="100px"
        @click="onClick"
        >実行</v-btn
      >
    </div>
  </div>
</template>

<style scoped>
.exe_button {
  padding-right: 40px;
  padding-left: 40px;
}
</style>
