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
      // TODO: Inc が 0 なら消せそう
      transpiled.push(lastExpr)
      lastExpr = null
    }
  }
  for (let i = 0; i < code.length; i++) {
    const c = code[i]
    switch (c) {
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
        // TODO: もしこれより前が val-inc なら、val-inc は消せそう
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
        if (loopStack.length === 0) {
          return `Error: ] without matching [ at ${i}`
        }
        const startIdx = loopStack.pop()
        const endIdx = transpiled.length
        transpiled[startIdx] = { type: 'loop-start', endIdx }
        transpiled.push({ type: 'loop-end', startIdx })
        break
      }
      case '.': {
        return 'Error: . is not supported'
      }
      default: {
        if (/^[a-zA-Z]$/.test(c)) {
          popLastExpr()
          transpiled.push({ type: 'turtle-command', command: c })
        } else {
          return `Error: unknown character ${c} at ${i}`
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
