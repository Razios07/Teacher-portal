import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { BookOpen, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [show, setShow] = useState(false)

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()
  const pwd = watch('password')

  const onSubmit = async (data) => {
    try {
      await registerUser({
        email:      data.email,
        first_name: data.first_name,
        last_name:  data.last_name,
        password:   data.password,
        phone:      data.phone,
      })
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      const errs = err.response?.data?.errors
      if (errs) Object.values(errs).forEach(e => toast.error(e))
      else toast.error(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-ink-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl bg-jade-500 flex items-center justify-center">
            <BookOpen size={17} className="text-white" />
          </div>
          <span className="font-semibold text-ink-900">Teacher Portal</span>
        </div>

        <h1 className="text-3xl font-semibold text-ink-900 mb-1">Create account</h1>
        <p className="text-ink-400 text-sm mb-8">Join the portal. Fill in your details below.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              <input className="input-field" placeholder="John"
                {...register('first_name', { required: 'Required' })} />
              {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name.message}</p>}
            </div>
            <div>
              <label className="label">Last Name</label>
              <input className="input-field" placeholder="Doe"
                {...register('last_name', { required: 'Required' })} />
              {errors.last_name && <p className="mt-1 text-xs text-red-500">{errors.last_name.message}</p>}
            </div>
          </div>

          <div>
            <label className="label">Email address</label>
            <input className="input-field" type="email" placeholder="you@example.com"
              {...register('email', {
                required: 'Required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
              })} />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="label">Phone (optional)</label>
            <input className="input-field" placeholder="+91 98765 43210"
              {...register('phone')} />
          </div>

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input className="input-field pr-11" type={show ? 'text' : 'password'} placeholder="Min 6 characters"
                {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })} />
              <button type="button" onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div>
            <label className="label">Confirm Password</label>
            <input className="input-field" type="password" placeholder="Repeat password"
              {...register('confirm_password', {
                required: 'Required',
                validate: v => v === pwd || 'Passwords do not match',
              })} />
            {errors.confirm_password && <p className="mt-1 text-xs text-red-500">{errors.confirm_password.message}</p>}
          </div>

          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Already have an account?{' '}
          <Link to="/login" className="text-jade-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
