import * as React from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { StreamLanguage } from '@codemirror/language'
import { yaml } from '@codemirror/legacy-modes/mode/yaml'
import axios from 'axios'
import { ImSpinner9 } from 'react-icons/im'
import { AiOutlineDeploymentUnit } from 'react-icons/ai'
import DeploymentToast from './overlays/DeploymentToast'

interface UserConfigProps {}
const initialYamlValue = `name: 'My LLM workflow'
description: 'Workflow that extracts information from customer support calls.'
tags: ['audio-pipelines']
frequency: '1d'
customer_id: 'IVqAyQJR4ugRGR8qL9UuB809OX82'

workflow:
  data_source_1: [llm_processor_1]
  llm_processor_1: [llm_processor_2, data_exporter_1, data_exporter_2]
  llm_processor_2: [data_exporter_1, data_exporter_2]


data_sources:
  # - name: data_source_1
  #   type: missive # s3, azure, google, missive
  #   data_type: json # mp3, wav, csv, txt, pdf
  #   keys: [text]
  #   missive_api_key: 7bc9e948-3e69-4c91-a830-660a4e1c39b7
  - name: data_source_1
    type: s3 # s3, azure, google, missive
    uri: tusol/b2b_emails
    data_type: txt # mp3, wav, csv, txt, pdf
    keys: [text]

llm_processors:
  - name: llm_processor_1
    type: column
    keys: [text]
    columns:
      - name: generated_email
        type: text # text, category, number, list, regex
        prompt_strategy: CoT # default, CoT, plan_and_solve
        model_name: gpt-3.5-turbo # gpt-3.5-turbo, gpt-4, text-davinci-003, azure-gpt-3.5-turbo, command, llama-2-7b-chat, mpt-7b
        instruction: |-
          You are Ilana, the manager responding to b2b outreach emails. Use the following email response templates to generate a response.
          -
          Sample request template:
          Hi,

          Please find attached additional product and integration information and let me know what might be a fit at your property.
          Generally, our Organic Protein Bars do well at spas, grab-and-go outlets, minibars and cafes, and the Smoothies are a great option for cafes and banquets.
          I'm looking forward to hearing your thoughts and sharing our collection with you!

          Thanks,
          Ilana
          -
          Inbound inquiry template:
          Hi,

          Thanks so much for your note, we'd love to discuss wholesale partnerships with you!
          We currently work with similar resorts - Four Seasons, Meadowood, Montage, Auberge - in a similar capacity and would love to work with you at Cliff House as well.
          Please find additional details attached and let me know what you have in mind for an initial order.
          Looking forward to our partnership!

          Warmly,
          Ilana
        prompt: Given an input email chain, generate a personalized response from Ilana using the templates in the instruction. Make sure to include the customer's name in the response.
      - name: intent
        type: category
        prompt_strategy: CoT # default, CoT, plan_and_solve
        model_name: gpt-3.5-turbo # gpt-3.5-turbo, gpt-4, text-davinci-003, azure-gpt-3.5-turbo, command, llama-2-7b-chat, mpt-7b
        instruction: |-
          You are Ilana, the manager responding to customer support emails. Answer the following questions about the email.
        prompt: Given the email, what is the intent of the original email from the options? If the intent is not listed, return OTHER.
        options: ['Sample request', 'Request more information', 'Follow up after product sample', 'OTHER']

  - name: llm_processor_2
    type: column
    keys: [generated_email]
    columns:
      - name: generated_subject
        type: text # text, category, number, list, regex
        prompt_strategy: CoT # default, CoT, plan_and_solve
        model_name: gpt-3.5-turbo # gpt-3.5-turbo, gpt-4, text-davinci-003, azure-gpt-3.5-turbo, command, llama-2-7b-chat, mpt-7b
        instruction: |-
          You are Ilana, the manager responding to customer service outreach emails.
        prompt: Return only the subject of the given email. If there is no subject, return 'Subject'.


data_exporters:
  - name: data_exporter_1
    type: email
    data_type: csv
    from_email: no-reply@flairlabs.ai
    to_emails: [trtets@gmail.com]
    email_password: flairlabs1234!
    content_key: generated_email
    subject_key: generated_subject
  - name: data_exporter_2
    type: google # azure, s3, google, email
    data_type: csv
    uri: llm_outputs

evaluators:
  - name: evaluator_1
    type: default
    `

const UserConfig: React.FunctionComponent<UserConfigProps> = props => {
  const [deploymentStatus, setDeploymentStatus] = React.useState<['success' | 'error', string]>()

  const [value, setValue] = React.useState<string>(initialYamlValue)
  const onChange = React.useCallback((val: string, viewUpdate: any) => {
    setValue(val)
  }, [])

  const [isLoading, setIsLoading] = React.useState(false)

  const uploadConfig = async () => {
    setIsLoading(true)
    const formData = new FormData()
    const yamlString = value

    const blob = new Blob([yamlString], { type: 'application/x-yaml' })
    formData.append('user_config_yaml', blob, 'b2b.yaml')

    try {
      const response = await axios.post(
        import.meta.env.MODE === 'development'
          ? '/api/v1/upload-user-config-yaml'
          : 'https://flair-api.flairlabs.ai/api/v1/upload-user-config-yaml',
        formData,
        {
          headers: {
            accept: 'application/json',
            // Content-Type will be set automatically by the browser when using FormData
          },
        },
      )

      console.log('response', response)
      console.log('response.data', response.data)
      setDeploymentStatus(['success', 'Your config has been deployed!'])
    } catch (error) {
      console.error('Error uploading the config:', error)
      setDeploymentStatus(['error', 'Sorry, something went wrong.'])
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        setDeploymentStatus(undefined)
      }, 3000)
    }
  }

  return (
    <>
      <div className="container relative mx-4 mb-9 mt-5 w-[calc(100%-2rem)] overflow-hidden rounded-md border">
        <CodeMirror
          value={value}
          height="80vh"
          extensions={[StreamLanguage.define(yaml)]}
          onChange={onChange}
        />
        <button
          className="btn absolute bottom-3 right-3 z-[5]"
          onClick={uploadConfig}
          disabled={isLoading}>
          {isLoading ? (
            <>
              <ImSpinner9 className="h-5 w-5 animate-spin" />
              Loading
            </>
          ) : (
            <>
              <AiOutlineDeploymentUnit className="h-5 w-5" />
              Deploy
            </>
          )}
        </button>
      </div>
      <DeploymentToast deploymentStatus={deploymentStatus} />
    </>
  )
}

export default UserConfig
