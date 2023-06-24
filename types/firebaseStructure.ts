interface FSCollections {
  [collectionName: string]: {
    [documentId: string]: {
      document: any
      collections: FSCollections
    }
  }
}

export interface FirestoreStruct extends FSCollections {
  user_data: {
    [userId: string]: {
      document: {
        userId: string
        userName: string
      }
      collections: {}
    }
  }
  flow_data: {
    [flowDataId: string]: {
      document: {
        ownerUserId: string
        flowJson: string
      }
      collections: {}
    }
  }
  flow_execution_requests: {
    [flowExecutionRequestId: string]: {
      document: {
        date: any
        executorUserId: string
        flowDataId: string
        flowJson: string
      }
      collections: {}
    }
  }
  flow_execution_results: {
    [flowExecutionRequestId: string]: {
      document: {
        date: any
        flowExecutionRequestId: string
        executorUserId: string
        flowDataId: string
        /** history */
        flowJson: string

        resultData: string
      }
      collections: {}
    }
  }
}
