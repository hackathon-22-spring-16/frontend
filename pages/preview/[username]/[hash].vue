<script setup lang="ts">
import { runCode } from '~~/utils/runCode'
import TurtleCanvas from '@/components/TurtleCanvas.vue'

const route = useRoute()
const router = useRouter()
const {
  data,
}: {
  data: {
    plainCode: string
    stdin: string
    title: string
    options: string
  }
} = await useFetch(
  `http://brain-t.api.trap.games/get-code/${route.params.username}/${route.params.hash}`
)
// const data = reactive({
//   plainCode: `{
// 90 60 20+ 5+
// long 60deg normarl short
// }
// ,r++>,rfDll>++++++++++f<rr>+++++++++++++++++++++++++f<r>>++++++++++f<<r>>f<<r>f<rr>>f<<l<f
// # ptr on 100
// >l>>+++++f<<rr>----------f<r>>f<<r>>f<<r>f<rr>>f<<l<f
// # ptr on 100
// >l>>f<<rr>f<r>>f<<r>>f<<r>f<rr>>f<<l<f
// # ptr on 100
// >l>>+++++f<<rr>++++++++++f<r>>f<<r>>f<<r>f<rr>>f<<l<f
// # ptr on 100
// >l>>-----f<<rr>----------f<r>>f<<r>>f<<r>f<rr>>f<<l<f
// # ptr on 100
// >l>>f<<rr>f<r>>f<<r>>f<<r>f<rr>>f<<l<f

// # right push 25
// >>>>>+++++[-<+++++>]<--
// {
// now 92 60 20+ 5 23
//                 ^
// }
// <<<l>>>f<<<l>>>
// f<<<r>>>f<<<r>>>f

// D<<<l>>>f<<<l>>>f<<<l>>>D
// f<<<l>>>f<<<l>>>f
// <<<r>>>f<<<r>>>
// f<<<l>>>f<<<l>>>f

// <<<rr>>>ff<<<rr>>>f<<<r>>>f
// <<<l>>>f<<<l>>>
// f<<<r>>>f<<<r>>>f
// <<<l>>>f<<<l>>>
// f<<<r>>>f

// b<<<ll>>>

// f<<<l>>>f<<<l>>>f
// <<<r>>>f<<<r>>>
// f<<<l>>>f<<<l>>>f

// U<<<rr>>>ffD<<<rr>>>f<<<r>>>f
// <<<l>>>f<<<l>>>
// f<<<r>>>f<<<r>>>f
// <<<l>>>f<<<l>>>
// f<<<r>>>f


// b<<<ll>>>

// f<<<l>>>f<<<l>>>f
// <<<r>>>f<<<r>>>
// f<<<l>>>f<<<l>>>f

// b<<<rr>>>fb
// <<<rr>>>f<<<l>>>
// f<<<l>>>fb<<<r
// r>>>f<<<l>>>fb<<<r
// r>>>f
// <<<l>>>f
// <<<l>>>f
// `,
//   stdin: 'Z<d',
//   title: 'dummy',
// })

const nextCommand = () => runCode(data.plainCode, data.stdin)

const toEditor = () => {
  localStorage.setItem('braint-code', data.plainCode)
  localStorage.setItem('braint-stdin', data.stdin)
  router.push('/editor')
}

const previewCanvasRef = ref<InstanceType<typeof TurtleCanvas> | null>(null)
onMounted(() => {
  previewCanvasRef.value?.start()
})
</script>

<template>
  <v-card class="pa-12 page-container">
    <v-card-title class="title-wrapper">
      <h1>
        {{ data.title }}
      </h1>
      <v-btn type="link" color="primary" @click="toEditor">
        コードを見る
        <v-icon left>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text class="content-wrapper">
      <turtle-canvas
        ref="previewCanvasRef"
        :width="800"
        :height="600"
        :algorithm="nextCommand"
        :interval-ms="10"
        is-rainbow
      />
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.title-wrapper {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  column-gap: 128px;
  row-gap: 32px;
}
.content-wrapper {
  display: grid;
  justify-items: center;
}
</style>
