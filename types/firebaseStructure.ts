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
}

export interface DocWorkflowRequest extends DocRoot {
  /** Document Id */
  workflowRequestId: string

  executorUserId: string
  workflowId: string

  requestTimestamp: Timestamp

  frontendConfig: string
  generatedConfig: string
}

export interface DocWorkflowResult extends DocRoot {
  /** Document Id */
  workflowResultId: string

  workflowId: string
  workflowRequestId: string
  executorUserId: string

  completionTimestamp: Timestamp
  resultStatus: string
  resultData: any
}
