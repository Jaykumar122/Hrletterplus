import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { RegisterPage } from "@/components/ui/registerpage"

export default function Signup() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/dashboard', { replace: true })
    }
  }, [])

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      if (res.ok) {
        alert('Account created! Please login.')
        navigate('/login', { replace: true }) // ← replace:true
      } else {
        alert(data.message)
      }
    } catch (error) {
      alert('Server error!')
    }
  }

  return (
    <RegisterPage
      onSwitchToSignIn={() => navigate('/login')}
      onRegister={handleRegister}
    />
  )
}