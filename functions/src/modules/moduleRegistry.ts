import { dataSourceS3 } from './dataSourceS3'
import { emailSender } from './emailSender'
import { googleSheetsExporter } from './googleSheetsExporter'
import { llmProcessorOpenAI } from './llmProcessorOpenAI'

export const moduleRegistry: Record<string, (...args: any[]) => void> = {
  LLMProcessorHop: llmProcessorOpenAI,
  DataSourceS3Hop: dataSourceS3,
  DataDestinationGmailHop: emailSender,
  DataDestinationSheetsHop: googleSheetsExporter,
  ConditionalHop: () => {},
}
