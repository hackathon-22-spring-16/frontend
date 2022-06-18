vue
<script setup lang="ts">
import { loadFull } from 'tsparticles'
import { Engine } from 'tsparticles-engine'
import { runCode } from '@/utils/runCode'
import TurtleCanvas from '@/components/TurtleCanvas.vue'
import { startParticleOptions } from '~~/utils/startParticle'
import { TopTitle } from '~~/.nuxt/components'

definePageMeta({
  layout: false,
})

const topCanvasRef = ref<InstanceType<typeof TurtleCanvas> | null>(null)

// TODO
const topCode = ref(`{
90 60 20+ 5+
long 60deg normarl short
}
,r++>,rfDll>++++++++++f<rr>+++++++++++++++++++++++++f<r>>++++++++++f<<r>>f<<r>f<rr>>f<<l<f
# ptr on 100
>l>>+++++f<<rr>----------f<r>>f<<r>>f<<r>f<rr>>f<<l<f
# ptr on 100
>l>>f<<rr>f<r>>f<<r>>f<<r>f<rr>>f<<l<f
# ptr on 100
>l>>+++++f<<rr>++++++++++f<r>>f<<r>>f<<r>f<rr>>f<<l<f
# ptr on 100
>l>>-----f<<rr>----------f<r>>f<<r>>f<<r>f<rr>>f<<l<f
# ptr on 100
>l>>f<<rr>f<r>>f<<r>>f<<r>f<rr>>f<<l<f

# right push 25
>>>>>+++++[-<+++++>]<--
{
now 92 60 20+ 5 23
                ^
}
<<<l>>>f<<<l>>>
f<<<r>>>f<<<r>>>f

D<<<l>>>f<<<l>>>f<<<l>>>D
f<<<l>>>f<<<l>>>f
<<<r>>>f<<<r>>>
f<<<l>>>f<<<l>>>f

<<<rr>>>ff<<<rr>>>f<<<r>>>f
<<<l>>>f<<<l>>>
f<<<r>>>f<<<r>>>f
<<<l>>>f<<<l>>>
f<<<r>>>f

b<<<ll>>>

f<<<l>>>f<<<l>>>f
<<<r>>>f<<<r>>>
f<<<l>>>f<<<l>>>f

U<<<rr>>>ffD<<<rr>>>f<<<r>>>f
<<<l>>>f<<<l>>>
f<<<r>>>f<<<r>>>f
<<<l>>>f<<<l>>>
f<<<r>>>f


b<<<ll>>>

f<<<l>>>f<<<l>>>f
<<<r>>>f<<<r>>>
f<<<l>>>f<<<l>>>f

b<<<rr>>>fb
<<<rr>>>f<<<l>>>
f<<<l>>>fb<<<r
r>>>f<<<l>>>fb<<<r
r>>>f
<<<l>>>f
<<<l>>>f
`)
const topStdIn = ref(`Z<d`)
const intervalMs = ref(30)
let count = 0
const runCodeMiddleware = function* () {
  const runCodeContent = runCode(topCode.value, topStdIn.value)
  while (true) {
    const next = runCodeContent.next()
    if (next.done) {
      break
    }
    if (
      next.value.type === 'moveForward' ||
      next.value.type === 'moveBackward'
    ) {
      count++
      if (count > 10) {
        count = 0
        intervalMs.value -= 10
      }
    }
    yield next.value
  }
  endTurtleAnimationHandler()
  return undefined as never
}
const nextCommand = () => {
  return runCodeMiddleware()
}

const particlesInit = async (engine: Engine) => {
  await loadFull(engine)
}

const titleAnimationStart = ref(false)
const endTurtleAnimationHandler = () => {
  titleAnimationStart.value = true
}

const isLoading = ref(true)
onMounted(() => {
  isLoading.value = false
})

const loadingBgRef = ref<HTMLDivElement | null>(null)
const transitioned = ref(false)
onMounted(() => {
  loadingBgRef.value?.addEventListener('transitionend', () => {
    topCanvasRef.value?.start()
    transitioned.value = true
  })
})
</script>

<template>
  <div class="page-container">
    <div class="page-top-container">
      <div class="bg-layer layer-0" />
      <div class="bg-layer layer-1" />
      <div class="bg-layer layer-2" />
      <div
        ref="loadingBgRef"
        class="bg-layer layer-loading"
        :class="{
          'is-load': !isLoading,
          'is-transitioned': transitioned,
        }"
      >
        <div />
        <div />
      </div>
      <Particles
        id="star-particle"
        :options="startParticleOptions"
        :particles-init="particlesInit"
      />

      <turtle-canvas
        ref="topCanvasRef"
        class="top-main-canvas"
        :width="800"
        :height="600"
        :interval-ms="intervalMs"
        :algorithm="nextCommand"
        is-rainbow
        :is-hidden-turtle="titleAnimationStart"
      />
      <top-title :animation-start="titleAnimationStart" />
      <div class="top-main-container"></div>
      <div class="top-main-canvas-container">
        <nuxt-link to="/editor"> コードを見る </nuxt-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#star-particle {
  pointer-events: none;
  & > canvas {
    pointer-events: none !important;
  }
}
</style>

<style lang="scss" scoped>
@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.25;
  }
}

.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  color: #eee;

  .page-top-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;

    padding: {
      top: 36px;
    }

    height: 100vh;
    /* position: relative; */

    .top-main-container {
      margin-top: 64px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 64px;
    }

    .bg-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      max-height: 100vh;
      z-index: -1;


      &.layer-0 {
        background-color: #08083c;
      }
      &.layer-loading {
        z-index: 100;
        opacity: 1;
        transition: opacity 0.5s ease-in;
        &.is-transitioned {
          display: none;
        }
        &.is-load {
          opacity: 0;
          & > div {
            animation-play-state: paused;
          }
        }

        & > div {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        & > div:nth-child(1) {
          background-color: #08083c;
        }
        & > div:nth-child(2) {
          background-image: linear-gradient(#08083c, #000);
          animation: fadeInOut 1s infinite alternate both;
        }
      }
      &.layer-1 {
        background-image: linear-gradient(#f6bbff, #08083c);
        animation: fadeInOut 10s infinite alternate both;
      }
      &.layer-2 {
        background-image: linear-gradient(/* to top, */ #593b9d, #08083c);
        animation: fadeInOut 10s infinite alternate-reverse both;
      }
    }

    .top-main-canvas-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin: {
        top: 16px;
      }
    }
  }
}
</style>
