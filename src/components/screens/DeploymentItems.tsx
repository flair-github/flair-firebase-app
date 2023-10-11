import * as React from 'react'
import { AiOutlineExport } from 'react-icons/ai'
import { MdForwardToInbox } from 'react-icons/md'
import { BsReplyAll } from 'react-icons/bs'
import { ImSpinner9 } from 'react-icons/im'

interface DeploymentItemsProps {}

function downloadJSON(jsonData: any, filename: string = 'data'): void {
  // Convert the JSON data to a string
  const jsonString: string = JSON.stringify(jsonData, null, 2)

  // Create a Blob containing the JSON string
  const blob: Blob = new Blob([jsonString], { type: 'application/json' })

  // Create a URL for the Blob
  const url: string = URL.createObjectURL(blob)

  // Create an anchor element and programmatically click it to start the download
  const a: HTMLAnchorElement = document.createElement('a')
  a.href = url
  a.download = `${filename}.json`
  a.click()

  // Optionally, revoke the object URL after the download is complete
  // to free up resources
  URL.revokeObjectURL(url)
}

const complaints = [
  {
    id: 1,
    email: 'john.doe@example.com',
    subject: 'Faulty Product Received',
    message:
      'I recently purchased a product from your website and it arrived faulty. Please assist.',
    date: '2023-10-01',
  },
  {
    id: 2,
    email: 'jane.smith@example.com',
    subject: 'Late Delivery',
    message:
      'I ordered a product two weeks ago and it still hasn’t arrived. Kindly update me on the status.',
    date: '2023-10-02',
  },
  {
    id: 3,
    email: 'mary.jones@example.com',
    subject: 'Incorrect Item Sent',
    message: 'The item I received does not match the one I ordered. Please rectify this mistake.',
    date: '2023-10-03',
  },
  {
    id: 4,
    email: 'paul.brown@example.com',
    subject: 'Damaged Package',
    message: 'My order arrived with the package damaged. This is not acceptable.',
    date: '2023-10-04',
  },
  {
    id: 5,
    email: 'susan.clark@example.com',
    subject: 'Missing Components',
    message:
      'The product I ordered was supposed to come with additional components, but they were missing. Please send them as soon as possible.',
    date: '2023-10-05',
  },
  {
    id: 6,
    email: 'robert.johnson@example.com',
    subject: 'Refund Not Processed',
    message:
      'I returned an item last month and am still waiting for my refund. Please process this immediately.',
    date: '2023-10-06',
  },
  {
    id: 7,
    email: 'linda.wilson@example.com',
    subject: 'Overcharged on My Order',
    message:
      'I was charged more than the displayed price on your website. Kindly check and correct this.',
    date: '2023-10-07',
  },
  {
    id: 8,
    email: 'james.white@example.com',
    subject: 'Product Not As Described',
    message:
      'The product I received looks and functions differently than described on the site. Please address this discrepancy.',
    date: '2023-10-08',
  },
  {
    id: 9,
    email: 'patricia.harris@example.com',
    subject: 'Customer Service Complaint',
    message:
      'I had a very unsatisfactory experience with one of your customer service representatives. I expect better from your company.',
    date: '2023-10-09',
  },
  {
    id: 10,
    email: 'michael.martin@example.com',
    subject: 'Website Glitches',
    message:
      'I faced multiple issues while trying to place an order on your website. It was quite frustrating. Please look into it.',
    date: '2023-10-10',
  },
]

const forwards = [
  {
    id: 1,
    email: 'alice.walker@example.com',
    subject: 'Bulk Purchase Inquiry',
    message:
      'I am interested in making a bulk purchase for my company. Can you provide a discount or a special quote?',
    date: '2023-10-01',
  },
  {
    id: 2,
    email: 'brian.hall@example.com',
    subject: 'Partnership Opportunity',
    message:
      'Our firm is keen to explore partnership opportunities. Could someone from sales discuss this with us?',
    date: '2023-10-02',
  },
  {
    id: 3,
    email: 'claire.adams@example.com',
    subject: 'New Product Inquiry',
    message:
      'I heard rumors about a new product release next month. Can I pre-order or get more details?',
    date: '2023-10-03',
  },
  {
    id: 4,
    email: 'david.lee@example.com',
    subject: 'Custom Product Request',
    message:
      'Is it possible to customize a product according to our specific requirements? We’re interested in a long-term contract.',
    date: '2023-10-04',
  },
  {
    id: 5,
    email: 'erica.jenkins@example.com',
    subject: 'Reseller Program',
    message:
      'We’re interested in becoming a reseller for your products. Could you provide more information?',
    date: '2023-10-05',
  },
  {
    id: 6,
    email: 'frank.miller@example.com',
    subject: 'Product Demo Request',
    message:
      'Our team would like to see a demo of your software solution. Can we schedule one for next week?',
    date: '2023-10-06',
  },
  {
    id: 7,
    email: 'grace.roberts@example.com',
    subject: 'Licensing Questions',
    message:
      'We need clarity on the licensing model for your software. Can we discuss the different packages?',
    date: '2023-10-07',
  },
  {
    id: 8,
    email: 'harry.jackson@example.com',
    subject: 'Affiliate Program',
    message:
      'I have a significant online following and I’m interested in your affiliate program. What are the terms and potential earnings?',
    date: '2023-10-08',
  },
  {
    id: 9,
    email: 'isabel.green@example.com',
    subject: 'Upgrade Possibilities',
    message:
      'We’re current customers and want to understand the benefits of upgrading to the premium version. Can someone guide us?',
    date: '2023-10-09',
  },
  {
    id: 10,
    email: 'jack.turner@example.com',
    subject: 'Group Discounts',
    message:
      'We’re planning to onboard our entire department with your solution. Are there any group discounts available?',
    date: '2023-10-10',
  },
]

const flaggeds = [
  {
    id: 1,
    email: 'laura.morris@example.com',
    subject: 'Data Breach Concern',
    message:
      'I received an email from your company that looks suspicious. Is my data safe? This needs to be reviewed immediately.',
    date: '2023-10-01',
  },
  {
    id: 2,
    email: 'michael.barnes@example.com',
    subject: 'Copyright Infringement',
    message:
      'I noticed one of your products uses my copyrighted artwork. This needs urgent attention.',
    date: '2023-10-02',
  },
  {
    id: 3,
    email: 'nancy.cooper@example.com',
    subject: 'Potential Safety Issue',
    message:
      'I believe there might be a safety issue with one of your products. It caused a minor accident at my home.',
    date: '2023-10-03',
  },
  {
    id: 4,
    email: 'oliver.nelson@example.com',
    subject: 'Unauthorized Transactions',
    message:
      'There are multiple unauthorized charges on my card from your website. I need this to be investigated and resolved.',
    date: '2023-10-04',
  },
  {
    id: 5,
    email: 'patricia.parker@example.com',
    subject: 'Sensitive Information Disclosure',
    message:
      'A representative from your company shared my private information without my consent. This is a serious violation of my privacy.',
    date: '2023-10-05',
  },
  {
    id: 6,
    email: 'quentin.russell@example.com',
    subject: 'Suspected Fraudulent Activity',
    message:
      'I received an order confirmation for a purchase I never made. Is my account compromised?',
    date: '2023-10-06',
  },
  {
    id: 7,
    email: 'rebecca.sanders@example.com',
    subject: 'Defamatory Content',
    message:
      'There are false claims being made about me in one of your platform’s user reviews. Please review and take appropriate action.',
    date: '2023-10-07',
  },
  {
    id: 8,
    email: 'steven.taylor@example.com',
    subject: 'Harassment Report',
    message:
      'I faced harassment from one of your employees during a recent interaction. This needs to be addressed.',
    date: '2023-10-08',
  },
  {
    id: 9,
    email: 'theresa.wood@example.com',
    subject: 'Legal Action Warning',
    message:
      'If my previous complaints are not addressed, I will be forced to take legal action. Please take this seriously.',
    date: '2023-10-09',
  },
  {
    id: 10,
    email: 'victor.young@example.com',
    subject: 'Ethical Concerns',
    message:
      'I have come across certain practices in your company that raise ethical concerns. These should be reviewed and addressed.',
    date: '2023-10-10',
  },
]

const DeploymentItems: React.FunctionComponent<DeploymentItemsProps> = props => {
  return (
    <>
      {/* Complaint Emails */}
      <div className="container mx-4 mb-9 mt-5 w-[calc(100%-2rem)] rounded-md border">
        <div className="flex items-center justify-between border-b p-3">
          <h4 className="pl-3 text-xl font-medium ">Complaint Emails</h4>
          <div className="space-x-3">
            <form className="join">
              <select
                className={' join-item ' + 'select select-bordered '}
                // value={}
                // onChange={event => {}}
              >
                <option disabled value="">
                  Column
                </option>
                <option value="email">Email</option>
                <option value="subject">Subject</option>
                <option value="message">Message</option>
              </select>
              <input
                className="input join-item input-bordered"
                // value={substring}
                // onChange={event => setSubstring(event.target.value)}
                placeholder="Filter"
              />
              <button
                className="btn join-item"
                onClick={e => {
                  e.preventDefault()
                }}>
                Search
              </button>
            </form>
            <button
              className="btn bg-slate-200"
              onClick={() => {
                downloadJSON(complaints, 'complaints')
              }}>
              <AiOutlineExport /> Export
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 p-3">
          {complaints.map(complaint => (
            <div
              key={complaint.id}
              className="card card-side rounded-md border bg-base-100 shadow-sm">
              <div className="card-body px-6 py-3">
                <h2 className="card-title">{complaint.subject}</h2>
                <p>{complaint.message}</p>
                <div className="card-actions items-center justify-between text-sm">
                  <p>{complaint.email}</p>
                  <span className="join">
                    <div className="tooltip tooltip-bottom" data-tip="Reply">
                      <button className="btn join-item btn-sm">
                        <BsReplyAll />
                      </button>
                    </div>
                    <div className="tooltip tooltip-bottom" data-tip="Forward">
                      <button className="btn join-item btn-sm">
                        <MdForwardToInbox />
                      </button>
                    </div>
                  </span>
                </div>
              </div>
            </div>
          ))}
          {true ? (
            <button className="btn col-span-2 mx-auto my-1 block w-36" onClick={() => {}}>
              {false ? (
                <ImSpinner9 className="animate mx-auto h-5 w-5 animate-spin" />
              ) : (
                'Load More'
              )}
            </button>
          ) : null}
        </div>
      </div>

      {/* Forward to Sales */}
      <div className="container mx-4 mb-9 mt-5 w-[calc(100%-2rem)] rounded-md border">
        <div className="flex items-center justify-between border-b p-3">
          <h4 className="pl-3 text-xl font-medium ">Forward to Sales</h4>
          <div className="space-x-3">
            <form className="join">
              <select
                className={' join-item ' + 'select select-bordered '}
                // value={}
                // onChange={event => {}}
              >
                <option disabled value="">
                  Column
                </option>
                <option value="email">Email</option>
                <option value="subject">Subject</option>
                <option value="message">Message</option>
              </select>
              <input
                className="input join-item input-bordered"
                // value={substring}
                // onChange={event => setSubstring(event.target.value)}
                placeholder="Filter"
              />
              <button
                className="btn join-item"
                onClick={e => {
                  e.preventDefault()
                }}>
                Search
              </button>
            </form>
            <button
              className="btn bg-slate-200"
              onClick={() => {
                downloadJSON(forwards, 'forwards')
              }}>
              <AiOutlineExport /> Export
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 p-3">
          {forwards.map(complaint => (
            <div
              key={complaint.id}
              className="card card-side rounded-md border bg-base-100 shadow-sm">
              <div className="card-body px-6 py-3">
                <h2 className="card-title">{complaint.subject}</h2>
                <p>{complaint.message}</p>
                <div className="card-actions items-center justify-between text-sm">
                  <p>{complaint.email}</p>
                  <span className="join">
                    <div className="tooltip tooltip-bottom" data-tip="Reply">
                      <button className="btn join-item btn-sm">
                        <BsReplyAll />
                      </button>
                    </div>
                    <div className="tooltip tooltip-bottom" data-tip="Forward">
                      <button className="btn join-item btn-sm">
                        <MdForwardToInbox />
                      </button>
                    </div>
                  </span>
                </div>
              </div>
            </div>
          ))}
          {true ? (
            <button className="btn col-span-2 mx-auto my-1 block w-36" onClick={() => {}}>
              {false ? (
                <ImSpinner9 className="animate mx-auto h-5 w-5 animate-spin" />
              ) : (
                'Load More'
              )}
            </button>
          ) : null}
        </div>
      </div>

      {/* Flagged for Review */}
      <div className="container mx-4 mb-9 mt-5 w-[calc(100%-2rem)] rounded-md border">
        <div className="flex items-center justify-between border-b p-3">
          <h4 className="pl-3 text-xl font-medium ">Flagged for Review</h4>
          <div className="space-x-3">
            <form className="join">
              <select
                className={' join-item ' + 'select select-bordered '}
                // value={}
                // onChange={event => {}}
              >
                <option disabled value="">
                  Column
                </option>
                <option value="email">Email</option>
                <option value="subject">Subject</option>
                <option value="message">Message</option>
              </select>
              <input
                className="input join-item input-bordered"
                // value={substring}
                // onChange={event => setSubstring(event.target.value)}
                placeholder="Filter"
              />
              <button
                className="btn join-item"
                onClick={e => {
                  e.preventDefault()
                }}>
                Search
              </button>
            </form>
            <button
              className="btn bg-slate-200"
              onClick={() => {
                downloadJSON(flaggeds, 'flaggeds')
              }}>
              <AiOutlineExport /> Export
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 p-3">
          {flaggeds.map(complaint => (
            <div
              key={complaint.id}
              className="card card-side rounded-md border bg-base-100 shadow-sm">
              <div className="card-body px-6 py-3">
                <h2 className="card-title">{complaint.subject}</h2>
                <p>{complaint.message}</p>
                <div className="card-actions items-center justify-between text-sm">
                  <p>{complaint.email}</p>
                  <span className="join">
                    <div className="tooltip tooltip-bottom" data-tip="Reply">
                      <button className="btn join-item btn-sm">
                        <BsReplyAll />
                      </button>
                    </div>
                    <div className="tooltip tooltip-bottom" data-tip="Forward">
                      <button className="btn join-item btn-sm">
                        <MdForwardToInbox />
                      </button>
                    </div>
                  </span>
                </div>
              </div>
            </div>
          ))}
          {true ? (
            <button className="btn col-span-2 mx-auto my-1 block w-36" onClick={() => {}}>
              {false ? (
                <ImSpinner9 className="animate mx-auto h-5 w-5 animate-spin" />
              ) : (
                'Load More'
              )}
            </button>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default DeploymentItems
