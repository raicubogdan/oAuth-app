import { Inter } from '@next/font/google'
import styles from './page.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const microsoftUrl = getMicrosoftAuthUrl()

  return (
    <main className={styles.main}>
      {microsoftUrl ? (
        <a href={microsoftUrl}>
          <button>Login with microsoft</button>
        </a>
      ) : (
        <h1>
          check your env file and make sure the variables used for oAuth are set correctly
        </h1>
      )}
    </main>
  )
}

export const getMicrosoftAuthUrl = (): string | null => {
  let authLink = null

  const client_id = process.env['NEXT_PUBLIC_MICROSOFT_APP_CLIENT_ID']
  const redirect_uri = process.env['NEXT_PUBLIC_MICROSOFT_APP_REDIRECT_URI']
  const tenant_id = process.env['NEXT_PUBLIC_MICROSOFT_APP_TENANT_ID']

  if (client_id && redirect_uri && tenant_id) {
    authLink = `https://login.microsoftonline.com/${tenant_id}/oauth2/v2.0/authorize?${new URLSearchParams(
      {
        client_id,
        response_type: 'code',
        redirect_uri,
        scope: 'openid email',
      }
    ).toString()}`
  }

  return authLink
}
