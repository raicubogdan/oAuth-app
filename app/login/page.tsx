'use client'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import styles from '../page.module.css'

const LoginCallback = ({ request, params }: any) => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const searchParams = useSearchParams()

  const authorization_code = searchParams.get('code')

  useEffect(() => {
    axios
      .post('http://localhost:3000/api/login', null, {
        params: {
          authorization_code,
        },
      })
      .then((res) => {
        setIsLoading(false)
        setEmail(res.data.email)
      })
      .catch((err) => {
        setIsLoading(false)
        console.log(err)
      })
  }, [])

  if (!authorization_code) return <h1>code key is missing in url params</h1>

  if (isLoading) return <h1>loading...</h1>

  if (!email)
    return (
      <main className={styles.main}>
        <div>
          <h1>no email was provided. check client/server console for errors</h1>
          <a href="/" style={{ textDecoration: 'underline', color: 'blue' }}>
            <h1>go back home</h1>
          </a>
        </div>
      </main>
    )

  return (
    <main className={styles.main}>
      <div>
        <h1>{`Hello ${email}!`} </h1>
        <a href="/" style={{ textDecoration: 'underline', color: 'blue' }}>
          <h1>go back home</h1>
        </a>
      </div>
    </main>
  )
}

export default LoginCallback
