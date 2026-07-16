import { useState } from 'react'
import './SettingsForm.css'

export default function SettingsForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [theme, setTheme] = useState('light')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !email) {
      setError('Please fill in all fields')
      return
    }

    if (!email.includes('@')) {
      setError('Invalid email')
      return
    }

    setError('')
    alert(`Settings saved for ${name}`)
  }

  return (
    <div className="settings">
      <h1>Settings</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <span>Name</span>
          <input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <span>Email</span>
          <input
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <span>Theme</span>
          <input
            placeholder="light, dark, or system"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Save</button>
      </form>
    </div>
  )
}
