// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { stringify } from 'querystring'
import { decode } from 'jsonwebtoken'

type Data = {
  email: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const authorization_code = req.query.authorization_code as string

  if (!authorization_code) throw new Error('No authorization code provided')

  const token_response = await getMicrosoftTokenResponse(authorization_code)
  const { email } = token_response as { email: string }

  if (!email) throw new Error('Could not get email from token response')

  res.status(200).json({ email })
}

const getMicrosoftTokenResponse = async (microsoftAuthCode: string) => {
  const client_id = process.env['NEXT_PUBLIC_MICROSOFT_APP_CLIENT_ID']
  const client_secret = process.env['MICROSOFT_APP_CLIENT_SECRET']
  const redirect_uri = process.env['NEXT_PUBLIC_MICROSOFT_APP_REDIRECT_URI']
  const tenant_id = process.env['NEXT_PUBLIC_MICROSOFT_APP_TENANT_ID']

  return axios
    .post(
      `https://login.microsoftonline.com/${tenant_id}/oauth2/v2.0/token`,
      // axios doesn't convert post body to application/x-www-form-urlencoded content type by default, so we need to stringify it
      stringify({
        code: microsoftAuthCode,
        client_id,
        client_secret,
        redirect_uri,
        grant_type: 'authorization_code',
      }),
      // for microsoft we should use application/x-www-form-urlencoded content type
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )
    .then((res) => decode(res.data.id_token) as { email: string })
}
