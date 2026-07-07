import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'

function AuthModal() {
  const { signIn, register: createAccount } = useAuth()
  const [mode, setMode] = useState('signin')
  const [serverError, setServerError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const isRegister = mode === 'register'

  const submitAuth = async (data) => {
    setServerError('')
    setIsSubmitting(true)

    try {
      if (isRegister) {
        await createAccount(data)
      } else {
        await signIn(data)
      }
    } catch (error) {
      setServerError(error.response?.data?.message || 'Authentication failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const changeMode = (nextMode) => {
    setMode(nextMode)
    setServerError('')
    reset()
  }

  return (
    <div className="auth-overlay">
      <section className="auth-modal" aria-modal="true" role="dialog">
        <div className="auth-tabs">
          <button
            className={mode === 'signin' ? 'active' : ''}
            type="button"
            onClick={() => changeMode('signin')}
          >
            Sign in
          </button>
          <button
            className={mode === 'register' ? 'active' : ''}
            type="button"
            onClick={() => changeMode('register')}
          >
            Register
          </button>
        </div>

        <h2>{isRegister ? 'Create account' : 'Sign in'}</h2>
        <p>Enter your username and password to continue.</p>

        <form className="auth-form" onSubmit={handleSubmit(submitAuth)}>
          <label>
            <input
              placeholder="Username"
              autoComplete="username"
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Use at least 3 characters',
                },
              })}
            />
            {errors.username && (
              <span className="form-error">{errors.username.message}</span>
            )}
          </label>

          <label>
            <input
              type="password"
              placeholder="Password"
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Use at least 6 characters',
                },
              })}
            />
            {errors.password && (
              <span className="form-error">{errors.password.message}</span>
            )}
          </label>

          {serverError && <span className="form-error">{serverError}</span>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : isRegister ? 'Create account' : 'Sign in'}
          </button>
        </form>
      </section>
    </div>
  )
}

export default AuthModal
