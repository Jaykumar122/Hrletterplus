import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { SignInPage } from "@/components/login-form"

export default function Login() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/dashboard', { replace: true })
    }
  }, [])

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        navigate('/dashboard', { replace: true }) // ← replace:true is key!
      } else {
        alert(data.message)
      }
    } catch (error) {
      alert('Server error!')
    }
  }

  return (
    <SignInPage
      onSwitchToRegister={() => navigate('/signup')}
      onLogin={handleLogin}
    />
  )
}