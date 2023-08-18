import { AverageEvaluationData, EvaluationData } from 'Types/firebaseStructure'

export function getAverage(evaluationData: EvaluationData): AverageEvaluationData {
  const evaluationDataEntries = Object.values(evaluationData)

  // Initialize sum object
  const sum: AverageEvaluationData = {
    faithfulness: 0,
    average_latency_per_request: 0,
    context_relevancy: 0,
    answer_relevancy: 0,
    invalid_format_percentage: 0,
    average_tokens_per_request: 0,
  }

  // Count of valid entries for each field
  const fieldCounts: Partial<AverageEvaluationData> = {}

  // Iterate through each evaluation data
  evaluationDataEntries.forEach(data => {
    Object.keys(data).forEach(key => {
      const fieldKey = key as keyof AverageEvaluationData
      if (typeof data[fieldKey] === 'number') {
        sum[fieldKey] += data[fieldKey]!
        fieldCounts[fieldKey] = (fieldCounts[fieldKey] || 0) + 1
      }
    })
  })

  const defaultAverage = undefined
  // Compute averages
  const average: AverageEvaluationData = {
    faithfulness: sum.faithfulness
      ? sum.faithfulness / (fieldCounts.faithfulness || 1)
      : defaultAverage,
    average_latency_per_request: sum.average_latency_per_request
      ? sum.average_latency_per_request / (fieldCounts.average_latency_per_request || 1)
      : defaultAverage,
    context_relevancy: sum.context_relevancy
      ? sum.context_relevancy / (fieldCounts.context_relevancy || 1)
      : defaultAverage,
    answer_relevancy: sum.answer_relevancy
      ? sum.answer_relevancy / (fieldCounts.answer_relevancy || 1)
      : defaultAverage,
    invalid_format_percentage: sum.invalid_format_percentage
      ? sum.invalid_format_percentage / (fieldCounts.invalid_format_percentage || 1)
      : defaultAverage,
    average_tokens_per_request: sum.average_tokens_per_request
      ? sum.average_tokens_per_request / (fieldCounts.average_tokens_per_request || 1)
      : defaultAverage,
  }

  return average
}
