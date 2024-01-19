export const simpleHash = (str: string) => {
  if (typeof str !== 'string') {
    return 0
  }

  return str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
}
