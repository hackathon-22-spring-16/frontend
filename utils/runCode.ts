import { transpile, TranspilerExpr } from './transpiler'
import { convertToTurtleCommand } from './convertToTurtleCommand'
import { TurtleCommand } from '@/components/TurtleCanvas.vue'

type Cell = number

const extendMemory = (memory: Cell[], minSize: number) => {
  while (minSize >= memory.length) {
    const extend = new Array(memory.length).fill(0)
    memory.push(...extend)
  }
}

interface State {
  ptr: number
  memory_non_negative: Cell[]
  memory_negative: Cell[]
  idx: number
  transpiled: TranspilerExpr[]
  inputIdx: number
}
export interface RunCodeOptions {
  cellMax?: number
}
export const runCode: (
  code: string,
  stdin: string,
  options?: RunCodeOptions
) => Generator<TurtleCommand, never, unknown> = function* (code, stdin, options) {
  const transpiled = transpile(code)
  if (typeof transpiled === 'string') {
    throw new TypeError(transpiled)
  }
  const { cellMax = 1024 } = options ?? {}
  const addCell = (cell: Cell, delta: number): Cell => {
    let result = cell + delta
    result %= cellMax
    if (result < 0) {
      result += cellMax
    }
    return result
  }
  const stdinAsBytes = new TextEncoder().encode(stdin)
  const state: State = {
    ptr: 0,
    memory_non_negative: new Array(cellMax).fill(0),
    memory_negative: new Array(cellMax).fill(0),
    idx: 0,
    transpiled,
    inputIdx: 0,
  }
  const getNowValue = () => {
    const ptr = state.ptr
    // 範囲外参照の場合は 0 埋めされるため、拡張せず 0 を返す
    if (ptr < 0) {
      const negPtr = -ptr - 1
      return negPtr < state.memory_negative.length
        ? state.memory_negative[negPtr]
        : 0
    }
    return ptr < state.memory_non_negative.length
      ? state.memory_non_negative[ptr]
      : 0
  }
  while (state.idx < state.transpiled.length) {
    const expr = state.transpiled[state.idx]
    switch (expr.type) {
      case 'inc-ptr': {
        state.ptr += expr.delta
        break
      }
      case 'inc-val': {
        if (state.ptr < 0) {
          const negPtr = -state.ptr - 1
          extendMemory(state.memory_negative, negPtr)
          state.memory_negative[negPtr] = addCell(
            state.memory_negative[negPtr],
            expr.delta
          )
        } else {
          extendMemory(state.memory_non_negative, state.ptr)
          state.memory_non_negative[state.ptr] = addCell(
            state.memory_non_negative[state.ptr],
            expr.delta
          )
        }
        break
      }
      case 'stdin': {
        if (state.inputIdx >= stdinAsBytes.length) {
          throw new Error('stdin: no more input')
        }
        if (state.ptr < 0) {
          const negPtr = -state.ptr - 1
          extendMemory(state.memory_negative, negPtr)
          state.memory_negative[negPtr] = stdinAsBytes[state.inputIdx]
        } else {
          extendMemory(state.memory_non_negative, state.ptr)
          state.memory_non_negative[state.ptr] = stdinAsBytes[state.inputIdx]
        }
        state.inputIdx++
        break
      }
      case 'loop-start': {
        const ptrVal = getNowValue()
        if (ptrVal === 0) {
          state.idx = expr.endIdx + 1
          continue
        }
        break
      }
      case 'loop-end': {
        const ptrVal = getNowValue()
        if (ptrVal !== 0) {
          state.idx = expr.startIdx + 1
          continue
        }
        break
      }
      case 'turtle-command': {
        const ptrVal = getNowValue()

        yield convertToTurtleCommand(expr.command, ptrVal)
        break
      }
      default: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const unhandled: never = expr
      }
    }
    state.idx++
  }
  return undefined as never
}
