import { useState } from 'react'
import { useForm } from 'react-hook-form'

function AuthModal({ onAuth }) {
  const [mode, setMode] = useState('signin')
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const isRegister = mode === 'register'

  const submitAuth = (data) => {
    const displayName = isRegister ? data.name : data.email.split('@')[0]

    onAuth({
      name: displayName || 'You',
      email: data.email,
    })
  }

  const changeMode = (nextMode) => {
    setMode(nextMode)
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
        <p>Enter your credentials to continue.</p>

        <form className="auth-form" onSubmit={handleSubmit(submitAuth)}>
          {isRegister && (
            <label>
              <input
                placeholder="Name"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <span className="form-error">{errors.name.message}</span>}
            </label>
          )}

          <label>
            <input
              type="email"
              placeholder="Email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Enter a valid email',
                },
              })}
            />
            {errors.email && <span className="form-error">{errors.email.message}</span>}
          </label>

          <label>
            <input
              type="password"
              placeholder="Password"
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

          <button type="submit">{isRegister ? 'Create account' : 'Sign in'}</button>
        </form>
      </section>
    </div>
  )
}

export default AuthModal
