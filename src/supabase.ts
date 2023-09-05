export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      workflow_results: {
        Row: {
          added_by: string | null
          averageEvaluationData: Json | null
          columnModel: Json | null
          completionTimestamp: Json | null
          createdTimestamp: Json | null
          dagRunId: string | null
          docExists: boolean | null
          errorException: Json | null
          evaluation_data: Json | null
          evaluationData: Json | null
          executorUserId: string | null
          firestore_id: string | null
          id: string
          model: string | null
          outputData: Json | null
          requestType: string | null
          resultData: Json | null
          status: string | null
          tags: Json | null
          updatedTimestamp: Json | null
          userConfig: string | null
          workflowId: string | null
          workflowName: string | null
          workflowRequestId: string | null
          workflowResultId: string | null
        }
        Insert: {
          added_by?: string | null
          averageEvaluationData?: Json | null
          columnModel?: Json | null
          completionTimestamp?: Json | null
          createdTimestamp?: Json | null
          dagRunId?: string | null
          docExists?: boolean | null
          errorException?: Json | null
          evaluation_data?: Json | null
          evaluationData?: Json | null
          executorUserId?: string | null
          firestore_id?: string | null
          id: string
          model?: string | null
          outputData?: Json | null
          requestType?: string | null
          resultData?: Json | null
          status?: string | null
          tags?: Json | null
          updatedTimestamp?: Json | null
          userConfig?: string | null
          workflowId?: string | null
          workflowName?: string | null
          workflowRequestId?: string | null
          workflowResultId?: string | null
        }
        Update: {
          added_by?: string | null
          averageEvaluationData?: Json | null
          columnModel?: Json | null
          completionTimestamp?: Json | null
          createdTimestamp?: Json | null
          dagRunId?: string | null
          docExists?: boolean | null
          errorException?: Json | null
          evaluation_data?: Json | null
          evaluationData?: Json | null
          executorUserId?: string | null
          firestore_id?: string | null
          id?: string
          model?: string | null
          outputData?: Json | null
          requestType?: string | null
          resultData?: Json | null
          status?: string | null
          tags?: Json | null
          updatedTimestamp?: Json | null
          userConfig?: string | null
          workflowId?: string | null
          workflowName?: string | null
          workflowRequestId?: string | null
          workflowResultId?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
// etc.
