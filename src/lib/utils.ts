export function findPercentagePosition(num: number, min: number, max: number) {
  if (max === min) {
    console.error('The min and max values cannot be the same.')
    return 1 // Avoid division by zero
  }
  return (num - min) / (max - min)
}
