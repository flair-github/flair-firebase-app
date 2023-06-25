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
  // Rename to users
  user_data: {
    [userId: string]: {
      document: DocUserData
      collections: {}
    }
  }
  // Rename to workflows
  flow_data: {
    [flowDataId: string]: {
      document: DocFlowData
      collections: {}
    }
  }
  // Rename to workflow_requests
  flow_exec_requests: {
    [flowExecRequestId: string]: {
      document: DocFlowExecRequest
      collections: {}
    }
  }
  // Rename to workflow_results
  flow_exec_results: {
    [flowExecResultId: string]: {
      document: DocFlowExecResult
      collections: {}
    }
  }
}

export interface DocRoot {
  docExists: boolean
  createdTimestamp: Timestamp
  updatedTimestamp: Timestamp
}

export interface DocUserData extends DocRoot {
  /** Document Id */
  userId: string

  userName: string
  userPhotoUrl: string
}

export interface DocFlowData extends DocRoot {
  /** Document Id */
  // TODO: Rename to workflowId
  flowDataId: string

  ownerUserId: string

  lastSaveTimestamp: Timestamp

  // TODO: Rename to workflowTitle
  flowDataTitle: string
  // TODO: Rename to workflowJson
  flowDataJson: string
}

export interface DocFlowExecRequest extends DocRoot {
  /** Document Id */
  // TODO: Rename to workflowRequestId
  flowExecRequestId: string

  executorUserId: string
  // TODO: workflowId
  flowDataId: string

  requestTimestamp: Timestamp

  // TODO: Rename to workflowConfig
  flowDataJson: string

  // TODO: Rename to generatedConfig
}

export interface DocFlowExecResult extends DocRoot {
  /** Document Id */
  // workflowResultId
  flowExecResultId: string

  // workflowRequestId
  flowExecRequestId: string
  executorUserId: string

  resultTimestamp: Timestamp
  resultStatus: string
  resultData: any
}
