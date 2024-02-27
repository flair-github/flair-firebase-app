import { GoogleAuth } from 'google-auth-library'
import { google } from 'googleapis'

const auth = new GoogleAuth({
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
  credentials: {
    type: 'service_account',
    project_id: 'flair-labs',
    private_key_id: '75714b4a4fe408d73d5aae027469f078d4291c5a',
    private_key:
      '-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQCq1DY0Ha9qMI9g\n4RmI9K56ET2TfF7gyW6vbhmSJ+FrySFUlTUe0iyvTdYMiyclMPahQjO4QNbyXc3T\nSrhly5mSJF8zKhw5x8NwGCTrk6IfuXzGG5SQmQQyFEWkqwx41lW5hqzXBhn5ww7U\nQZe216iMm6YQ1y5Y/dFNUvziXBAMg5P11dTzKqn0pTGuLvQvcZmtH9xZA7No02X8\n5DnWK4fIzt0bSuFmuflrHgOIyNATriUBsc3mKGGaxMBhlRl86WjsEEFV/huGJ7bx\nhWmhXBvPqQXNBJ/fjr2YomwH2uYHHbfz6Z6GA6FlgOiI3Qx87iWZ6smkii2yuCts\nSt+TFSDXAgMBAAECgf9ZYa/Bf/DpfD+/FRds5DkbI/M2n/wTtorIgdGLAHD/mLct\noQhrCmkUucrXgxK3kaAoaJ3LO1UL9rR6PleLfDPWolVppKBoZ+WZrYbdDUJe248C\nnXS5ePxFDYaEHEaoDj44wN+3kAXCEQaXsSmvAYUqo3M5CzOo4QEZWqVx7ubFGgsf\nvyv3YeT45rJgrBkdBdE4pltGnI9zBRMRErENhKIFyo8PrPkVBeUSlOF2YgL+i4/G\nQlsFwyUXUhBQW9MYtThcfcFmEhElpcdzkY1d9ORdmvXDoA+mVo7dH6xLqf3PG4sb\nkWUw5Jno+6PnTV3WPncboIELWpFP2718VmwiZRkCgYEA2yzjErqIMdzdB7c+FTA/\nA3ZueDusuCFehamAXkbUY+35UWFKk5kdjkhkSDbIhPCScyNbICgYe0DqLHwoiDvE\nTatQf4D5NzFLrYaC6yFV2oLt8JLiChcYW/8HAFQu5UP2R5W9m6rrixraOPtVSiBL\nWQU/V4i8hX60g2TuMRpjGm8CgYEAx4fcxtbbglqXrbLCRdu4y7uvgtA+jNpJO6DZ\nYunmz6Z9Dw+RgE5Mft/YRsyLjqVu+PkFm9tngab5nUM+aU5WbbfoWuTJkGVehZ1F\n8P3pLozFubGf7EMePMQ0nhwIC+67OI3UQkBXxHx8LA3e6TsOqmImbPJsCgVmEtkn\nRqsHNBkCgYEA0F+NhwnGYDmN/j7tjDFxRzZ6cl6xp+E5vzPWMkt+s37VMNShlU/V\n9KbIiItk+lbJtSNhCGJ2W//sYtyroFHKINmFz6LrzNhWDaS7pRXtTLB7zOOoeVVZ\nuGTu4BYo+5kwdQBc4rmN9JNT8yaoALBRUlIV1X/PU8+RiPYVKqPeoosCgYBptn+w\nEXGnNJwb+ROYs3rK5hts8SvSsGwQXX4PO+F/rrOfYR4znkhFCA+sIv7lipyq6DSi\niLHkLTUertvIKyr7Ym6GiaSJDkvv+o1tyvjaItc3NPaH1F+WzlUaV7ujps4mfm4w\n06osfc/D/21UoGd6uhmlqyK2hHm6DrcSZ9afMQKBgFOxEALdxin/lsNyNblYQZt1\nTX49cyjNQwn+FrrOfsJwPbff+2NZwklr4rCbSh+jOFa3XtHdP9rbOdqYqe0+JpJm\nbSOa2XDuweuWFPAJiiN3OKIAEcAQiMQlrCpFyS+4KkTBBSaGA0g363yGNErO8tdF\n896hhD0I/YNgcRhvc5mz\n-----END PRIVATE KEY-----\n',
    client_email: 'flair-labs-sheets@flair-labs.iam.gserviceaccount.com',
    client_id: '109464049018802301398',
    // auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    // token_uri: 'https://oauth2.googleapis.com/token',
    // auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    // client_x509_cert_url:
    // 'https://www.googleapis.com/robot/v1/metadata/x509/flair-labs-sheets%40flair-labs.iam.gserviceaccount.com',
    universe_domain: 'googleapis.com',
  },
})

const sheets = google.sheets({ version: 'v4', auth })

export const googleSheetsExporter = async (table: Record<string, string>[]) => {
  const spreadsheetId = '1ey04b4cJNy6VZLa74pW7HTaukZ9rFZsRX0lgQ_Ou_bA' // Replace with your Google Sheet ID
  const range = 'Sheet1'

  // Convert JSON to array of arrays
  const arrayData = table.map(obj => Object.values(obj))

  // Include headers
  const headers = Object.keys(table[0])
  const data = [headers, ...arrayData]

  // Clear existing content
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range,
  })

  // Update sheet with new data
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      majorDimension: 'ROWS',
      values: data,
    },
  })
}

export const googleSheetsCleaner = async () => {
  const spreadsheetId = '1ey04b4cJNy6VZLa74pW7HTaukZ9rFZsRX0lgQ_Ou_bA' // Replace with your Google Sheet ID
  const range = 'Sheet1'

  // Clear existing content
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range,
  })
}
