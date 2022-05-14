// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { google, Auth, oauth2_v2, } from 'googleapis'
import { env } from 'process';
import auth from "../../auth/gcp.json";

type Data = {
  name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // res.status(200).json({ name: 'John Doe' })

  const _url = 'https://sheets.googleapis.com/$discovery/rest?version=v4';

  const oauth = new google.auth.GoogleAuth({
    credentials: {
      client_email: auth.client_email,
      client_id: auth.client_id,
      private_key: auth.private_key.replace(/\\n/g, '\n'),
    },
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });


  const api = google.sheets({
    version: 'v4',
    auth: oauth,
  })

  const result = await api.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: `Główne!A:ZZ`,
  })

  res.status(200).json({ data: result.data.values })


}
