export function findPercentagePosition(num: number, min: number, max: number) {
  if (max === min) {
    console.error('The min and max values cannot be the same.')
    return 1 // Avoid division by zero
  }
  return (num - min) / (max - min)
}

export function convertToKebab(str: string) {
  // Trim whitespace from both sides of the string
  const trimmed = str.trim()

  // Convert to lowercase
  const lowercase = trimmed.toLowerCase()

  // Replace spaces and non-alphanumeric characters (except for dashes) with a dash
  // This regex will find one or more spaces or non-alphanumeric characters (excluding dashes) and replace them with a single dash
  const hyphenated = lowercase.replace(/[\s\W-]+/g, '-')

  return hyphenated
}
