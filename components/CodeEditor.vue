<script setup lang="ts">
import { Codemirror } from 'vue-codemirror'
// import { showPanel } from '@codemirror/view'
import { getSupport } from '@/utils/language/nodeData'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', text: string): string
}>()

const code = computed({
  get: () => props.modelValue,
  set: value => {
    emit('update:modelValue', value)
  },
})

// const showCharCount = () => showPanel.of()
</script>

<template>
  <codemirror
    v-model="code"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="[getSupport()]"
  />
</template>

<style lang="scss" scoped></style>
