<script setup lang="ts">
import { sleep } from '@/utils/sleep'
import { makeRainbow } from '@/utils/color'

export interface MoveForward {
  type: 'moveForward'
  distance: number
}
export interface MoveBackward {
  type: 'moveBackward'
  distance: number
}
export interface TurnRight {
  type: 'turnRight'
  angleDeg: number
}
export interface TurnLeft {
  type: 'turnLeft'
  angleDeg: number
}
export interface SetPos {
  type: 'setPos'
  x: number
  y: number
}
export interface SetX {
  type: 'setX'
  x: number
}
export interface SetY {
  type: 'setY'
  y: number
}
export interface Home {
  type: 'home'
}
export interface SetDirection {
  type: 'setDirection'
  directionDeg: number
}
export interface PenUp {
  type: 'penUp'
}
export interface PenDown {
  type: 'penDown'
}
export interface PenColor {
  type: 'penColor'
  color: string
}

export type TurtleCommand =
  | MoveForward
  | MoveBackward
  | TurnRight
  | TurnLeft
  | SetPos
  | SetX
  | SetY
  | Home
  | SetDirection
  | PenUp
  | PenDown
  | PenColor

export type TurtleCommandGenerator = () => Generator<
  TurtleCommand,
  never,
  unknown
>

export interface Props {
  width: number
  height: number
  algorithm: TurtleCommandGenerator
  intervalMs: number
  isRainbow?: boolean
}
const props = defineProps<Props>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasTopRef = ref<HTMLCanvasElement | null>(null)

const isPause = ref(false)
const pauseResolve = ref<((value: boolean) => void) | null>(null)

interface TurtleState {
  x: number
  y: number
  directionDeg: number
  penDown: boolean
  color: string
}
const cosDeg = (deg: number) => Math.cos((deg * Math.PI) / 180)
const sinDeg = (deg: number) => Math.sin((deg * Math.PI) / 180)
let runningJobNumber = 0
const homePos = {
  x: 320,
  y: 320,
}
const start = () => {
  runningJobNumber += 1
  const selfJobNumber = runningJobNumber
  const colorNext = props.isRainbow ? makeRainbow() : () => 'black'
  const turtleState: TurtleState = {
    x: 0,
    y: 0,
    directionDeg: 0,
    penDown: false,
    color: colorNext(),
  }
  const distanceMag = 2
  const algorithm = props.algorithm()
  if (canvasRef.value === null || canvasTopRef.value === null) {
    return
  }
  const ctx = canvasRef.value.getContext('2d')
  const ctxTop = canvasTopRef.value.getContext('2d')
  if (ctx === null || ctxTop === null) {
    return
  }
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  ctxTop.clearRect(0, 0, canvasTopRef.value.width, canvasTopRef.value.height)

  const next = async () => {
    if (selfJobNumber !== runningJobNumber) {
      return
    }
    const nextCommandResult = algorithm.next()
    if (selfJobNumber !== runningJobNumber) {
      return
    }
    if (nextCommandResult.done) {
      return
    }
    const nextCommand = nextCommandResult.value

    turtleState.color = colorNext()

    switch (nextCommand.type) {
      case 'penColor': {
        turtleState.color = nextCommand.color
        next()
        return
      }
      case 'penDown': {
        turtleState.penDown = true
        next()
        return
      }
      case 'penUp': {
        turtleState.penDown = false
        next()
        return
      }
      case 'turnRight': {
        turtleState.directionDeg += nextCommand.angleDeg
        turtleState.directionDeg %= 360
        if (turtleState.directionDeg < 0) {
          turtleState.directionDeg += 360
        }
        break
      }
      case 'turnLeft': {
        turtleState.directionDeg -= nextCommand.angleDeg
        turtleState.directionDeg %= 360
        if (turtleState.directionDeg < 0) {
          turtleState.directionDeg += 360
        }
        break
      }
      case 'setDirection': {
        turtleState.directionDeg = nextCommand.directionDeg
        turtleState.directionDeg %= 360
        if (turtleState.directionDeg < 0) {
          turtleState.directionDeg += 360
        }
        break
      }
      case 'moveForward':
      case 'moveBackward':
      case 'setPos':
      case 'setX':
      case 'setY':
      case 'home': {
        const nextPos = {
          x: turtleState.x,
          y: turtleState.y,
        }
        switch (nextCommand.type) {
          case 'moveForward': {
            nextPos.x += cosDeg(turtleState.directionDeg) * nextCommand.distance
            nextPos.y += sinDeg(turtleState.directionDeg) * nextCommand.distance
            break
          }
          case 'moveBackward': {
            nextPos.x -= cosDeg(turtleState.directionDeg) * nextCommand.distance
            nextPos.y -= sinDeg(turtleState.directionDeg) * nextCommand.distance
            break
          }
          case 'setPos': {
            nextPos.x = nextCommand.x
            nextPos.y = nextCommand.y
            break
          }
          case 'setX': {
            nextPos.x = nextCommand.x
            break
          }
          case 'setY': {
            nextPos.y = nextCommand.y
            break
          }
          case 'home': {
            nextPos.x = 0
            nextPos.y = 0
            break
          }
          default: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const unhandledCommand: never = nextCommand
          }
        }

        ctx.beginPath()
        ctx.strokeStyle = turtleState.color
        ctx.moveTo(
          homePos.x + turtleState.x * distanceMag,
          homePos.y + turtleState.y * distanceMag
        )
        if (turtleState.penDown) {
          ctx.lineTo(
            homePos.x + nextPos.x * distanceMag,
            homePos.y + nextPos.y * distanceMag
          )
        } else {
          ctx.moveTo(
            homePos.x + nextPos.x * distanceMag,
            homePos.y + nextPos.y * distanceMag
          )
        }
        ctx.stroke()

        turtleState.x = nextPos.x
        turtleState.y = nextPos.y
        break
      }
      default: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const unhandledCommand: never = nextCommand
      }
    }

    ctxTop.clearRect(
      0,
      0,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      canvasTopRef.value!.width,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      canvasTopRef.value!.height
    )
    ctxTop.fillStyle = '#000000'
    ctxTop.beginPath()
    ctxTop.moveTo(
      homePos.x + turtleState.x * distanceMag,
      homePos.y + turtleState.y * distanceMag
    )
    ctxTop.lineTo(
      homePos.x +
        turtleState.x * distanceMag +
        10 * cosDeg(turtleState.directionDeg + 150),
      homePos.y +
        turtleState.y * distanceMag +
        10 * sinDeg(turtleState.directionDeg + 150)
    )
    ctxTop.lineTo(
      homePos.x +
        turtleState.x * distanceMag +
        10 * cosDeg(turtleState.directionDeg - 150),
      homePos.y +
        turtleState.y * distanceMag +
        10 * sinDeg(turtleState.directionDeg - 150)
    )
    ctxTop.lineTo(
      homePos.x + turtleState.x * distanceMag,
      homePos.y + turtleState.y * distanceMag
    )
    ctxTop.fill()

    if (props.intervalMs === 0) {
      await null
    } else {
      await sleep(props.intervalMs)
    }
    if (isPause.value) {
      const pausePromise = new Promise<boolean>(resolve => {
        pauseResolve.value = resolve
      })
      const isContinue = await pausePromise
      if (!isContinue) {
        return
      }
    }
    requestAnimationFrame(next)
  }
  next()
}
const end = () => {
  runningJobNumber += 1
  pauseResolve.value?.(false)
  pauseResolve.value = null
  isPause.value = false
}
const pause = () => {
  isPause.value = true
}
const resume = () => {
  isPause.value = false
  pauseResolve.value?.(true)
  pauseResolve.value = null
}

defineExpose({
  start,
  end,
  pause,
  resume,
  isPause,
})
</script>

<template>
  <div class="turtle-canvas-wrapper">
    <canvas
      ref="canvasRef"
      :width="props.width"
      :height="props.height"
      class="canvas"
    />
    <canvas
      ref="canvasTopRef"
      :width="props.width"
      :height="props.height"
      class="canvas top-layer"
    />
  </div>
</template>

<style lang="scss" scoped>
.turtle-canvas-wrapper {
  position: relative;
  width: v-bind('`${width}px`');
  height: v-bind('`${height}px`');
  & > canvas {
    position: absolute;
    top: 0;
    left: 0;

    border: 1px solid #ccc;
    &.top-layer {
      pointer-events: none;
    }
  }
}
</style>
