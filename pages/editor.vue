<script setup lang="ts">
import { runCode } from '@/utils/runCode'
import TurtleCanvas from '@/components/TurtleCanvas.vue'

const turtleCanvas = ref<InstanceType<typeof TurtleCanvas> | null>(null)
const headers = useHeaders()

const drawInterval = ref(50)

const isRunning = ref(false)

const code = ref(
  'D,>,[-<+>]{F + d で 170 が入る (角度として使う)}++++++++++++++++++++{+20}rrr{位置調整}[f<l>+++++]{長さを増やしながら回転}\n'
)
const stdin = ref('Fd')

const nextCommand = () => {
  return runCodeMiddleware()
}
const errorMessage = ref('')
const runCodeMiddleware = function* () {
  const runCodeContent = runCode(code.value, stdin.value)
  while (true) {
    let next: ReturnType<typeof runCodeContent.next> | null = null
    try {
      next = runCodeContent.next()
    } catch (e) {
      const err = e as Error
      nextTick(() => {
        errorMessage.value = err.message
        stop()
      })
      return undefined as never
    }
    if (next.done) {
      break
    }
    yield next.value
  }
  nextTick(() => {
    stop()
  })
  return undefined as never
}

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
    errorMessage.value = ''
    return
  }
  if (turtleCanvas.value.isPause) {
    turtleCanvas.value.resume()
  } else {
    turtleCanvas.value.pause()
  }
}

const isShareLoading = ref(false)
const shareUrl = ref('')
const share = async () => {
  if (isShareLoading.value) {
    return
  }
  isShareLoading.value = true
  try {
    const {
      data,
    }: {
      data: {
        userName: string
        hash: string
      }
    } = await $fetch(`${process.env.apiBaseUrl}/share`, {
      method: 'POST',
      body: {
        code: code.value,
        stdin: stdin.value,
      },
    })
    shareUrl.value = `${process.env.baseUrl}/preview/${data.userName}/${data.hash}`
    console.log(shareUrl.value)
  } catch (e) {
    console.error(e)
  } finally {
    isShareLoading.value = false
  }
}
const loginConfirmDialog = ref(false)
const tryShare = () => {
  if (isShareLoading.value) {
    return
  }
  if (!headers.value['x-showcase-user']) {
    loginConfirmDialog.value = true
    return
  }
  share()
}

const loginRedirect = () => {
  localStorage.setItem('braint-code', code.value)
  localStorage.setItem('braint-stdin', stdin.value)
  window.location.href =
    'https://portal.trap.jp/pipeline?redirect=brain-t.trap.games'
}
onMounted(() => {
  const codeStorage = localStorage.getItem('braint-code')
  const stdinStorage = localStorage.getItem('braint-stdin')
  if (codeStorage) {
    code.value = codeStorage
  }
  if (stdinStorage) {
    stdin.value = stdinStorage
  }
  localStorage.removeItem('braint-code')
  localStorage.removeItem('braint-stdin')
})

const mediaQuery = ref<MediaQueryList | null>(null)
const mediaQuerySmall = ref<MediaQueryList | null>(null)
const isMedium = ref(false)
const isSmall = ref(false)
onMounted(() => {
  mediaQuery.value = window.matchMedia('(max-width: 1040px)')
  mediaQuerySmall.value = window.matchMedia('(max-width: 700px)')
  isMedium.value = mediaQuery.value.matches
  isSmall.value = mediaQuerySmall.value.matches
  mediaQuery.value.addEventListener('change', () => {
    isMedium.value = mediaQuery.value?.matches ?? false
  })
  mediaQuerySmall.value.addEventListener('change', () => {
    isSmall.value = mediaQuerySmall.value?.matches ?? false
  })
})
</script>

<template>
  <v-card class="pa-12 page-container">
    <v-card-text class="editor-whole-container">
      <div class="controller-container">
        <div class="button-container">
          <v-btn
            :icon="
              isRunning && !turtleCanvas?.isPause ? 'mdi-pause' : 'mdi-play'
            "
            color="primary"
            @click="toggleRunning"
          />
          <v-btn
            icon="mdi-stop"
            :disabled="!isRunning"
            outlined
            @click="stop"
          />
        </div>
        <v-slider
          v-if="!isMedium"
          v-model="drawInterval"
          class="align-center interval-slider"
          :min="0"
          :max="500"
          :step="50"
          thumb-label
          hide-details
        >
          <template #append>
            <v-text-field
              v-model="drawInterval"
              class="mt-0 pt-0"
              type="number"
              :step="50"
              :min="0"
              :max="500"
              hide-details
              single-line
            />
          </template>
        </v-slider>
        <v-btn
          :loading="isShareLoading"
          color="primary"
          size="large"
          @click.stop="tryShare"
        >
          Share
          <v-icon right> mdi-share </v-icon>
        </v-btn>

        <v-dialog v-model="loginConfirmDialog" max-width="500px">
          <v-card>
            <v-card-title> コードの共有は traP 部員のみです </v-card-title>
            <v-card-text>
              もし traP 部員の場合は下のボタンからログインしてください
              (現時点でのコードは保存されます)
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="loginConfirmDialog = false">
                キャンセル
              </v-btn>
              <v-spacer />
              <v-btn color="primary" @click="loginRedirect">
                ログイン処理を行う
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <v-slider
        v-if="isMedium"
        v-model="drawInterval"
        class="align-center mt-4"
        :min="0"
        :max="500"
        :step="50"
        thumb-label
        hide-details
      >
        <template #append>
          <v-text-field
            v-model="drawInterval"
            class="mt-0 pt-0"
            type="number"
            :step="50"
            :min="0"
            :max="500"
            hide-details
            single-line
          />
        </template>
      </v-slider>

      <v-alert
        :style="
          errorMessage === ''
            ? {
                opacity: 0,
                transform: 'translateY(30%)',
                pointerEvent: 'none',
              }
            : {
                opacity: 1,
              }
        "
        icon="mdi-alert-octagon-outline"
        type="error"
        class="error-message"
        dense
      >
        {{ errorMessage }}
      </v-alert>

      <div class="editor-main-container">
        <code-editor
          v-model="code"
          class="code-editor"
          :style="
            isSmall ? { width: '300px' } : isMedium ? { width: '600px' } : {}
          "
        />
        <div class="editor-main-right">
          <turtle-canvas
            ref="turtleCanvas"
            :width="800"
            :height="600"
            :algorithm="nextCommand"
            :interval-ms="drawInterval"
            is-rainbow
            bordered
          />
          <v-textarea
            v-model="stdin"
            label="標準入力"
            class="mono-inherit stdin-input"
            auto-grow
            solo
            :rows="5"
          />
        </div>
        <div />
      </div>
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.error-message {
  background-color: #ff5252 !important;
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
  margin: {
    top: 8px;
    bottom: 8px;
  }
}
.stdin-input {
  padding: 8px;
}
.page-container {
  min-height: 100%;
}
.controller-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.button-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}
.editor-whole-container {
  display: grid;
  grid-template-rows: 60px 1fr;
  row-gap: 0px;
  width: 100%;
  min-height: 100%;
  height: 100%;
}
.editor-main-container {
  display: grid;
  grid-template-columns: calc(50% - 8px) calc(50% - 8px);
  column-gap: 16px;
  flex: 1;
}
.interval-slider {
  margin-right: 360px !important;
}
@media screen and (max-width: 1040px) {
  .interval-slider {
    margin-right: 16px !important;
  }
  .editor-main-container {
    grid-template-columns: 100%;
    justify-items: center;
    gap: 16px;
  }
}
</style>
