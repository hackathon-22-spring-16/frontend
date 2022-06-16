<script setup lang="ts">
import { runCode } from '@/utils/runCode';
import TurtleCanvas from '@/components/TurtleCanvas.vue';

const turtleCanvas = ref<InstanceType<typeof TurtleCanvas> | null>(null)

const drawInterval = ref(100)

const isRunning = ref(false)

const colorManagers = () => {
  let arg = Math.floor(Math.random() * 360)
  const next = () => {
    arg += 1
    arg %= 360
    return `hsl(${arg}, 50%, 70%)`
  }
  return {
    next,
  }
}
const nextCommand = () => runCode(
  'D,>,[-<+>]+++++++++++++++++++++++++++++++++++++++[f<l>+]',
  'Fd'
)

const stop = () => {
  isRunning.value = false
  turtleCanvas.value?.end()
}
const toggleRunning = () => {
  if (turtleCanvas.value === null) {
    return
  }
  if (!isRunning.value) {
    turtleCanvas.value.start()
    isRunning.value = true
    return
  }
  if (turtleCanvas.value.isPause) {
    turtleCanvas.value.resume()
  } else {
    turtleCanvas.value.pause()
  }
}
</script>

<template>
  <v-card class="pa-12">
    <v-card-text>
      <v-row class="button-container">
        <v-btn
          :icon="isRunning && !turtleCanvas.isPause ? 'mdi-pause' : 'mdi-play'"
          color="primary"
          @click="toggleRunning"
        />
        <v-btn icon="mdi-stop" :disabled="!isRunning" outlined @click="stop" />
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-slider
            v-model="drawInterval"
            :min="0"
            :max="1000"
            :step="100"
            thumb-label
          >
            <template #append>
              <v-text-field
                v-model="drawInterval"
                label="drawInterval"
                type="number"
                step="100"
                min="0"
                max="1000"
              />
            </template>
          </v-slider>
        </v-col>
      </v-row>
      <v-row>
        <turtle-canvas
          ref="turtleCanvas"
          :width="640"
          :height="480"
          :algorithm="nextCommand"
          :interval-ms="drawInterval"
        />
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.button-container {
  gap: 16px;
}
</style>
