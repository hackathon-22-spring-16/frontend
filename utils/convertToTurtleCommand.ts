import { TurtleCommand } from '@/components/TurtleCanvas.vue.__VLS_script'

export const convertToTurtleCommand = (
  command: string,
  val: number
): TurtleCommand => {
  const func = convertMap.get(command)
  if (func === undefined) {
    throw new Error(`Unknown command: ${command}`)
  }
  return func(val)
}

export const convertMap: Map<string, (val: number) => TurtleCommand> = new Map([
  // HACK: どれかひとつに型注釈をつけるとエラーが消える
  ['f', (val): TurtleCommand => ({ type: 'moveForward', distance: val })],
  ['b', val => ({ type: 'moveBackward', distance: val })],
  ['l', val => ({ type: 'turnLeft', angleDeg: val })],
  ['r', val => ({ type: 'turnRight', angleDeg: val })],
  ['x', val => ({ type: 'setX', x: val })],
  ['y', val => ({ type: 'setY', y: val })],
  ['h', _val => ({ type: 'home' })],
  ['d', val => ({ type: 'setDirection', directionDeg: val })],
  ['U', _val => ({ type: 'penUp' })],
  ['D', _val => ({ type: 'penDown' })],
])
export const plainCommands = new Set(convertMap.keys())
