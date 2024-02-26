import { CSV } from '../others/sampleCSV'
import Papa from 'papaparse'

export const dataSourceS3 = () => {
  const result = Papa.parse(CSV, {
    header: true,
  })

  return result.data.slice(0, 10) as Record<string, string>[]
}
