import { plainCommands } from "./convertToTurtleCommand"

export interface IncPtr {
  type: 'inc-ptr'
  delta: number
}
export interface IncVal {
  type: 'inc-val'
  delta: number
}
export interface StdIn {
  type: 'stdin'
}
export interface LoopStart {
  type: 'loop-start'
  endIdx: number
}
export interface LoopEnd {
  type: 'loop-end'
  startIdx: number
}
export interface TurtleCommandLike {
  type: 'turtle-command'
  command: string
}
export type TranspilerExpr =
  | IncPtr
  | IncVal
  | StdIn
  | LoopStart
  | LoopEnd
  | TurtleCommandLike

export const transpile = (code: string): TranspilerExpr[] | string => {
  const transpiled: TranspilerExpr[] = []
  const loopStack: number[] = []
  let lastExpr: TranspilerExpr | null = null
  const popLastExpr = () => {
    if (lastExpr !== null) {
      // delta が 0 の場合は何もしなくてよい
      if ((lastExpr.type === 'inc-ptr' || lastExpr.type === 'inc-val') && lastExpr.delta === 0) {
        lastExpr = null
        return
      }
      transpiled.push(lastExpr)
      lastExpr = null
    }
  }
  // {...comment...} か # comment でコメントを書けるようにした
  let isInComment = false
  let isOneLineComment = false
  for (let i = 0; i < code.length; i++) {
    const c = code[i]
    if (isInComment) {
      if (c === '}') {
        isInComment = false
      }
      continue
    }
    if (isOneLineComment) {
      if (c === '\n') {
        isOneLineComment = false
      }
      continue
    }
    switch (c) {
      case '{': {
        isInComment = true
        break
      }
      case '#': {
        isOneLineComment = true
        break
      }
      case '>': {
        if (lastExpr?.type === 'inc-ptr') {
          lastExpr.delta++
          continue
        }
        popLastExpr()
        lastExpr = { type: 'inc-ptr', delta: 1 }
        break
      }
      case '<': {
        if (lastExpr?.type === 'inc-ptr') {
          lastExpr.delta--
          continue
        }
        popLastExpr()
        lastExpr = { type: 'inc-ptr', delta: -1 }
        break
      }
      case '+': {
        if (lastExpr?.type === 'inc-val') {
          lastExpr.delta++
          continue
        }
        popLastExpr()
        lastExpr = { type: 'inc-val', delta: 1 }
        break
      }
      case '-': {
        if (lastExpr?.type === 'inc-val') {
          lastExpr.delta--
          continue
        }
        popLastExpr()
        lastExpr = { type: 'inc-val', delta: -1 }
        break
      }
      case ',': {
        // この前が inc-val なら上書きされるため無視できる
        if (lastExpr?.type === 'inc-val') {
          lastExpr = null
        }
        popLastExpr()
        transpiled.push({ type: 'stdin' })
        break
      }
      case '[': {
        popLastExpr()
        loopStack.push(transpiled.length)
        transpiled.push({ type: 'loop-start', endIdx: -1 })
        break
      }
      case ']': {
        popLastExpr()
        const startIdx = loopStack.pop()
        if (startIdx === undefined) {
          return `Error: ] without matching [ at ${i}`
        }
        const endIdx = transpiled.length
        transpiled[startIdx] = { type: 'loop-start', endIdx }
        transpiled.push({ type: 'loop-end', startIdx })
        break
      }
      case '.': {
        return 'Error: . is not supported'
      }
      default: {
        if (plainCommands.has(c)) {
          popLastExpr()
          transpiled.push({ type: 'turtle-command', command: c })
        } else if (/^\s$/.test(c)) {
          continue
        } else {
          return `Error: Unknown character ${c} at ${i}`
        }
      }
    }
  }
  popLastExpr()
  if (loopStack.length !== 0) {
    return `Error: [ without matching ] at ${loopStack.join(',')}`
  }
  return transpiled
}
