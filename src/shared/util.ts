export function debounce(callback: any, delay = 250) {
  let timeoutId: number | undefined
  return (...args: any) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      timeoutId = undefined
      callback(...args)
    }, delay) as any
  }
}