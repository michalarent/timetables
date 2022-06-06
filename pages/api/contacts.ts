// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { google, Auth, oauth2_v2, } from 'googleapis'
import { env } from 'process';


type Data = {
    name: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // res.status(200).json({ name: 'John Doe' })

    const _url = 'https://sheets.googleapis.com/$discovery/rest?version=v4';



    const oauth = new google.auth.GoogleAuth({
        credentials: {
            client_email: env.GCP_AUTH_EMAIL,
            client_id: env.GCP_CLIENT_ID,
            private_key: env.GCP_PK?.replace(/\\n/g, '\n'),
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
        spreadsheetId: env.SPREADSHEET_ID,
        range: `Kontakty!A1:I300`,
    })

    res.status(200).json({ data: result.data.values })


}
