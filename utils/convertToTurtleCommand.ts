import { TurtleCommand } from '@/components/TurtleCanvas.vue.__VLS_script'

export const convertToTurtleCommand = (
  command: string,
  val: number
): TurtleCommand => {
  const func = command !== '_NEVER_USED_' ? convertMap.get(command) : undefined
  if (func === undefined) {
    throw new Error(`Unknown command: ${command}`)
  }
  return func(val)
}

export const convertMap: Map<string, (val: number) => TurtleCommand> = new Map([
  ['f', val => ({ type: 'moveForward', distance: val })],
  ['b', val => ({ type: 'moveBackward', distance: val })],
  ['l', val => ({ type: 'turnLeft', angleDeg: val })],
  ['r', val => ({ type: 'turnRight', angleDeg: val })],
  ['x', val => ({ type: 'setX', x: val })],
  ['y', val => ({ type: 'setY', y: val })],
  ['h', _val => ({ type: 'home' })],
  ['d', val => ({ type: 'setDirection', directionDeg: val })],
  ['U', _val => ({ type: 'penUp' })],
  ['D', _val => ({ type: 'penDown' })],
  /* HACK: :tabun: 共変性とかの関係で、これがないと TypeScript はエラーになる */
  [
    '_NEVER_USED_',
    _val => ({ type: '_NEVER_USED_' } as unknown as TurtleCommand),
  ],
])
