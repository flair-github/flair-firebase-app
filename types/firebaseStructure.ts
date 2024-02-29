import { Timestamp } from 'firebase/firestore'

interface FSCollections {
  [collectionName: string]: {
    [documentId: string]: {
      document: any
      collections: FSCollections
    }
  }
}

export interface FirestoreStruct extends FSCollections {
  users: {
    [userId: string]: {
      document: DocUser
      collections: {}
    }
  }
  workflows: {
    [workflowId: string]: {
      document: DocWorkflow
      collections: {}
    }
  }
  workflow_requests: {
    [workflowRequestId: string]: {
      document: DocWorkflowRequest
      collections: {}
    }
  }
  workflow_results: {
    [workflowResultId: string]: {
      document: DocWorkflowResult
      collections: {}
    }
  }
}

export interface DocRoot {
  docExists: boolean
  createdTimestamp: Timestamp
  updatedTimestamp: Timestamp
}

export interface DocUser extends DocRoot {
  /** Document Id */
  userId: string

  userName: string
  userPhotoUrl: string
}

export interface DocWorkflow extends DocRoot {
  /** Document Id */
  workflowId: string
  ownerUserId: string
  lastSaveTimestamp: Timestamp
  workflowTitle: string
  frontendConfig: string
  isToggleOn?: boolean
}

export interface DocWorkflowRequest extends DocRoot {
  /** Document Id */
  workflowRequestId: string

  executorUserId: string
  workflowId: string

  status: 'requested' | 'initiated' | 'completed'

  requestTimestamp: Timestamp

  frontendConfig: string
  generatedConfig: string
}

type Answer = string[] | number | string
type ColumnName = 'todos' | 'customer_age' | 'call_type' | 'customer_objections'

export interface DocLLMOutput {
  workflowId: string
  workflowRequestId?: string
  workflowResultId: string | null
  id: string
  columnName: ColumnName
  columnPrompt: string
  context: string
  instruction: string
  answer: Answer
  input: string
  output: string
  docExists: boolean
  latency: number
  createdTimestamp: Timestamp
  updatedTimestamp: Timestamp
}

export interface DocWorkflowResult {
  workflowId: string
  workflowName: string
  executorUserId: string
  workflowRequestId: string
  workflowResultId: string
  userConfig: string
  shared_token: string
  shared_expiry: string
  docExists: boolean
  requestType: null
  model: Model
  averageEvaluationData: AverageEvaluationData | number
  evaluationData: EvaluationData
  resultData: ResultData
  outputData: ResultData
  updatedTimestamp: Timestamp
  createdTimestamp: Timestamp
  completionTimestamp: Timestamp
  status?: string
  frontendConfig?: string

  /**
   * Inline output
   * For writing the outputs in this doc directly.
   * Must be less than 1 MB
   */
  inlineOutput?: Record<string, string>[]
}

export interface AverageEvaluationData {
  faithfulness?: number
  average_latency_per_request?: number
  context_relevancy?: number
  answer_relevancy?: number
  invalid_format_percentage?: number
  average_tokens_per_request?: number | null
}

export interface EvaluationData {
  name?: AverageEvaluationData
  email?: AverageEvaluationData
  address?: AverageEvaluationData
  phone_number?: AverageEvaluationData
  call_type?: AverageEvaluationData
}

type Model = 'llama-2-7b-chat' | 'gpt-3.5-turbo' | string

interface ResultData {
  phone_number?: string[]
  email?: string[]
  name?: string[]
  address?: string[]
  call_type?: string[]
}
