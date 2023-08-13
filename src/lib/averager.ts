interface InnerObject {
  [key: string]: number
}

interface MainObject {
  [key: string]: InnerObject
}

export function getAverage(obj: MainObject): InnerObject {
  const result: InnerObject = {} // This will hold the summed values
  const counts: { [key: string]: number } = {} // This will hold the count of values for each key

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const innerObj = obj[key]

      for (const innerKey in innerObj) {
        if (innerObj.hasOwnProperty(innerKey)) {
          // If the result object doesn't have the key, initialize it
          if (!result[innerKey]) {
            result[innerKey] = 0
            counts[innerKey] = 0
          }

          result[innerKey] += innerObj[innerKey]
          counts[innerKey]++
        }
      }
    }
  }

  for (const key in result) {
    if (result.hasOwnProperty(key)) {
      result[key] /= counts[key]
    }
  }

  return result
}
