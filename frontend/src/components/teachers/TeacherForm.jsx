import { useForm } from 'react-hook-form'
import { teacherAPI } from '../../api'
import toast from 'react-hot-toast'

const DESIGNATIONS = ['Professor', 'Associate Professor', 'Assistant Professor', 'Senior Lecturer', 'Lecturer', 'Instructor']
const DEPARTMENTS   = ['Computer Science', 'Mathematics', 'Physics', 'Engineering', 'Data Science', 'Chemistry', 'Biology', 'Literature', 'Economics', 'Psychology']

export default function TeacherForm({ teacher, onSuccess, onCancel }) {
  const isEdit = !!teacher

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: isEdit ? {
      first_name:        teacher.first_name,
      last_name:         teacher.last_name,
      phone:             teacher.phone,
      university_name:   teacher.university_name,
      gender:            teacher.gender,
      year_joined:       teacher.year_joined,
      department:        teacher.department,
      designation:       teacher.designation,
      subject:           teacher.subject,
      experience_years:  teacher.experience_years,
      bio:               teacher.bio,
    } : {},
  })

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await teacherAPI.update(teacher.id, data)
        toast.success('Teacher updated!')
      } else {
        await teacherAPI.create(data)
        toast.success('Teacher created!')
      }
      onSuccess()
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong'
      const errs = err.response?.data?.errors
      if (errs) {
        Object.values(errs).forEach(e => toast.error(e))
      } else {
        toast.error(msg)
      }
    }
  }

  const Field = ({ label, name, rules, children, error }) => (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      {/* Account info — only for create */}
      {!isEdit && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-4 pb-2 border-b border-ink-100">
            Account Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" error={errors.first_name?.message}>
              <input className="input-field" placeholder="John"
                {...register('first_name', { required: 'Required' })} />
            </Field>
            <Field label="Last Name" error={errors.last_name?.message}>
              <input className="input-field" placeholder="Doe"
                {...register('last_name', { required: 'Required' })} />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <input className="input-field" type="email" placeholder="john@university.edu"
                {...register('email', { required: 'Required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } })} />
            </Field>
            <Field label="Phone">
              <input className="input-field" placeholder="+1-555-0100"
                {...register('phone')} />
            </Field>
            <Field label="Password" error={errors.password?.message} >
              <input className="input-field" type="password" placeholder="Min 6 characters"
                {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })} />
            </Field>
          </div>
        </section>
      )}

      {/* Edit: only name/phone */}
      {isEdit && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-4 pb-2 border-b border-ink-100">
            Personal Info
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" error={errors.first_name?.message}>
              <input className="input-field" {...register('first_name', { required: 'Required' })} />
            </Field>
            <Field label="Last Name" error={errors.last_name?.message}>
              <input className="input-field" {...register('last_name', { required: 'Required' })} />
            </Field>
            <Field label="Phone">
              <input className="input-field" {...register('phone')} />
            </Field>
          </div>
        </section>
      )}

      {/* Teacher info */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-4 pb-2 border-b border-ink-100">
          Academic Profile
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="University" error={errors.university_name?.message}>
            <input className="input-field" placeholder="MIT"
              {...register('university_name', { required: 'Required' })} />
          </Field>
          <Field label="Department" error={errors.department?.message}>
            <select className="input-field" {...register('department', { required: 'Required' })}>
              <option value="">Select…</option>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Designation" error={errors.designation?.message}>
            <select className="input-field" {...register('designation', { required: 'Required' })}>
              <option value="">Select…</option>
              {DESIGNATIONS.map(d => <option key={d}>{d}</option>)}
            </select>
          </Field>
          <Field label="Subject" error={errors.subject?.message}>
            <input className="input-field" placeholder="Algorithms"
              {...register('subject', { required: 'Required' })} />
          </Field>
          <Field label="Gender" error={errors.gender?.message}>
            <select className="input-field" {...register('gender', { required: 'Required' })}>
              <option value="">Select…</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Year Joined" error={errors.year_joined?.message}>
            <input className="input-field" type="number" placeholder="2018"
              {...register('year_joined', {
                required: 'Required',
                min: { value: 1950, message: 'Must be after 1950' },
                max: { value: new Date().getFullYear(), message: 'Cannot be in the future' },
              })} />
          </Field>
          <Field label="Experience (years)">
            <input className="input-field" type="number" placeholder="5"
              {...register('experience_years', { min: 0 })} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Bio">
            <textarea className="input-field resize-none" rows={3} placeholder="Short bio…"
              {...register('bio')} />
          </Field>
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-jade" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Teacher'}
        </button>
      </div>
    </form>
  )
}
