import { TurtleCommand } from '@/components/TurtleCanvas.vue.__VLS_script'

export const convertToTurtleCommand = (
  command: string,
  val: number
): TurtleCommand => {
  switch (command) {
    case 'f':
      return { type: 'moveForward', distance: val }
    case 'b':
      return { type: 'moveBackward', distance: val }
    case 'l':
      return { type: 'turnLeft', angleDeg: val }
    case 'r':
      return { type: 'turnRight', angleDeg: val }
    case 'x':
      return { type: 'setX', x: val }
    case 'y':
      return { type: 'setY', y: val }
    case 'h':
      return { type: 'home' }
    case 'd':
      return { type: 'setDirection', directionDeg: val }
    case 'U':
      return { type: 'penUp' }
    case 'D':
      return { type: 'penDown' }
    default:
      throw new Error(`Unknown command: ${command}`)
  }
}
