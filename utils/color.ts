export const makeRainbow = (argDelta = 10) => {
  let arg = Math.floor(Math.random() * 360)
  const next = () => {
    arg += argDelta
    arg %= 360
    return `hsl(${arg}, 50%, 70%)`
  }
  return next
}
