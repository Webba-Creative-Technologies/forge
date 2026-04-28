import { ReactNode, useState, useMemo, useCallback, createContext, useContext, FormEvent } from 'react'

// ============================================
// TYPES
// ============================================
export interface FormRule {
  required?: boolean | string
  minLength?: { value: number; message: string }
  maxLength?: { value: number; message: string }
  pattern?: { value: RegExp; message: string }
  validate?: (value: unknown) => string | true
}

interface FieldState {
  value: unknown
  error: string | null
  touched: boolean
}

interface FormContextValue {
  values: Record<string, unknown>
  errors: Record<string, string | null>
  touched: Record<string, boolean>
  setValue: (name: string, value: unknown) => void
  setTouched: (name: string) => void
  registerField: (name: string, rules?: FormRule) => void
}

const FormContext = createContext<FormContextValue | null>(null)

function useFormContext() {
  const ctx = useContext(FormContext)
  if (!ctx) throw new Error('FormField must be used within a Form')
  return ctx
}

// ============================================
// FORM
// ============================================
interface FormProps {
  children: ReactNode
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>
  initialValues?: Record<string, unknown>
  gap?: number | string
  style?: React.CSSProperties
}

export function Form({
  children,
  onSubmit,
  initialValues = {},
  gap = '1rem',
  style
}: FormProps) {
  const [fields, setFields] = useState<Record<string, FieldState>>(() => {
    const init: Record<string, FieldState> = {}
    for (const [key, value] of Object.entries(initialValues)) {
      init[key] = { value, error: null, touched: false }
    }
    return init
  })
  const [rules, setRules] = useState<Record<string, FormRule>>({})

  const { values, errors, touched } = useMemo(() => {
    const values: Record<string, unknown> = {}
    const errors: Record<string, string | null> = {}
    const touched: Record<string, boolean> = {}
    for (const [key, field] of Object.entries(fields)) {
      values[key] = field.value
      errors[key] = field.error
      touched[key] = field.touched
    }
    return { values, errors, touched }
  }, [fields])

  const registerField = useCallback((name: string, fieldRules?: FormRule) => {
    setFields(prev => {
      if (prev[name]) return prev
      return { ...prev, [name]: { value: initialValues[name] ?? '', error: null, touched: false } }
    })
    if (fieldRules) {
      setRules(prev => ({ ...prev, [name]: fieldRules }))
    }
  }, [initialValues])

  const validateField = useCallback((name: string, value: unknown): string | null => {
    const rule = rules[name]
    if (!rule) return null

    const strValue = typeof value === 'string' ? value : String(value ?? '')

    if (rule.required) {
      const isEmpty = value === undefined || value === null || strValue.trim() === ''
      if (isEmpty) {
        return typeof rule.required === 'string' ? rule.required : 'This field is required'
      }
    }

    if (rule.minLength && strValue.length < rule.minLength.value) {
      return rule.minLength.message
    }

    if (rule.maxLength && strValue.length > rule.maxLength.value) {
      return rule.maxLength.message
    }

    if (rule.pattern && !rule.pattern.value.test(strValue)) {
      return rule.pattern.message
    }

    if (rule.validate) {
      const result = rule.validate(value)
      if (result !== true) return result
    }

    return null
  }, [rules])

  const setValue = useCallback((name: string, value: unknown) => {
    setFields(prev => {
      const error = prev[name]?.touched ? validateField(name, value) : prev[name]?.error ?? null
      return { ...prev, [name]: { value, error, touched: prev[name]?.touched ?? false } }
    })
  }, [validateField])

  const setTouched = useCallback((name: string) => {
    setFields(prev => {
      const field = prev[name]
      if (!field) return prev
      const error = validateField(name, field.value)
      return { ...prev, [name]: { ...field, touched: true, error } }
    })
  }, [validateField])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Validate all fields
    let hasErrors = false
    const newFields = { ...fields }
    for (const name of Object.keys(newFields)) {
      const error = validateField(name, newFields[name].value)
      newFields[name] = { ...newFields[name], touched: true, error }
      if (error) hasErrors = true
    }
    setFields(newFields)

    if (hasErrors) return

    const submitValues: Record<string, unknown> = {}
    for (const [key, field] of Object.entries(newFields)) {
      submitValues[key] = field.value
    }
    await onSubmit(submitValues)
  }

  const ctx: FormContextValue = { values, errors, touched, setValue, setTouched, registerField }

  return (
    <FormContext.Provider value={ctx}>
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap,
          ...style
        }}
      >
        {children}
      </form>
    </FormContext.Provider>
  )
}

// ============================================
// FORM FIELD
// ============================================
interface FormFieldProps {
  name: string
  label?: string
  description?: string
  rules?: FormRule
  children: (props: {
    value: unknown
    onChange: (value: unknown) => void
    onBlur: () => void
    error: string | null
    name: string
  }) => ReactNode
}

export function FormField({
  name,
  label,
  description,
  rules: fieldRules,
  children
}: FormFieldProps) {
  const { values, errors, touched, setValue, setTouched, registerField } = useFormContext()

  // Register on mount
  useState(() => {
    registerField(name, fieldRules)
  })

  const error = touched[name] ? errors[name] : null
  const value = values[name] ?? ''

  const handleChange = (val: unknown) => setValue(name, val)
  const handleBlur = () => setTouched(name)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      {label && (
        <label
          htmlFor={name}
          style={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: 'var(--text-primary)'
          }}
        >
          {label}
          {fieldRules?.required && (
            <span style={{ color: 'var(--color-error, #EF4444)', marginLeft: 2 }}>*</span>
          )}
        </label>
      )}
      {description && (
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          marginTop: -2
        }}>
          {description}
        </span>
      )}
      {children({ value, onChange: handleChange, onBlur: handleBlur, error, name })}
      {error && (
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--color-error, #EF4444)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          {error}
        </span>
      )}
    </div>
  )
}

// ============================================
// FORM ACTIONS (submit/cancel row)
// ============================================
interface FormActionsProps {
  children: ReactNode
  align?: 'left' | 'center' | 'right' | 'between'
}

export function FormActions({ children, align = 'right' }: FormActionsProps) {
  const justifyMap = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end',
    between: 'space-between'
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: justifyMap[align],
      gap: '0.75rem',
      paddingTop: '0.5rem'
    }}>
      {children}
    </div>
  )
}
