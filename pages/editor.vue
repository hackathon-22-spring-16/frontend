<script setup lang="ts">
import { sleep } from '@/utils/sleep'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasTopRef = ref<HTMLCanvasElement | null>(null)

const nowRunning = ref(0)
const drawInterval = ref(100)

const isRunning = ref(false)

const start = () => {
  isRunning.value = true
  const myNumber = nowRunning.value + 1
  nowRunning.value = myNumber
  if (canvasRef.value !== null && canvasTopRef.value !== null) {
    const ctx = canvasRef.value.getContext('2d')
    const ctxTop = canvasTopRef.value.getContext('2d')
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    ctxTop.clearRect(0, 0, canvasTopRef.value.width, canvasTopRef.value.height)

    let nowDirection = 0
    let nowCount = 100
    let nowPos = { x: 200, y: 320 }
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
    const cm = colorManagers()
    const draw = async () => {
      if (nowRunning.value !== myNumber) {
        return
      }
      ctx.beginPath()
      ctx.moveTo(nowPos.x, nowPos.y)
      const nextPos = {
        x: nowPos.x + nowCount * Math.cos(nowDirection * Math.PI / 180),
        y: nowPos.y + nowCount * Math.sin(nowDirection * Math.PI / 180),
      }
      ctx.strokeStyle = cm.next()
      ctx.lineTo(nextPos.x, nextPos.y)
      ctx.stroke()

      nowDirection += 170
      nowDirection %= 360
      nowCount += 10
      nowPos = nextPos

      ctxTop.clearRect(0, 0, canvasTopRef.value.width, canvasTopRef.value.height)
      ctxTop.fillStyle = '#000000'
      ctxTop.beginPath()
      ctxTop.moveTo(nowPos.x, nowPos.y)
      ctxTop.lineTo(nowPos.x + 10 * Math.cos((nowDirection + 150) * Math.PI / 180), nowPos.y + 10 * Math.sin((nowDirection + 150) * Math.PI / 180))
      ctxTop.lineTo(nowPos.x + 10 * Math.cos((nowDirection + 210) * Math.PI / 180), nowPos.y + 10 * Math.sin((nowDirection + 210) * Math.PI / 180))
      ctxTop.lineTo(nowPos.x, nowPos.y)
      ctxTop.fill()

      if (drawInterval.value === 0) {
        await null
      } else {
        await sleep(drawInterval.value)
      }
      requestAnimationFrame(draw)
    }
    draw()
  } else {
    console.log('canvas not found')
    isRunning.value = false
  }
}
// 現状だと再開はできず、start を押して最初からしかない
// ここらへんをちゃんと読めばいい感じにできそう
// https://qiita.com/Yametaro/items/b6e035fe06530a9f47bc#%E3%81%BE%E3%81%A8%E3%82%81
const stop = () => {
  nowRunning.value += 1
}
</script>

<template>
  <v-card class="pa-12">
    <v-card-text>
      <v-row class="button-container">
        <v-btn @click="start">{{ isRunning ? 'restart' : 'start' }}</v-btn>
        <v-btn @click="stop">stop</v-btn>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-slider v-model="drawInterval" :min="0" :max="1000" :step="100" thumb-label>
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
        <div class="canvas-container">
          <canvas ref="canvasRef" width="640" height="480" class="canvas" />
          <canvas ref="canvasTopRef" width="640" height="480" class="canvas top-layer" />
        </div>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.button-container {
  gap: 32px;
}

.canvas-container {
  position: relative;
  width: 640px;
  height: 480px;
  & > canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
}
.canvas {
  border: 1px solid #ccc;
}
</style>
