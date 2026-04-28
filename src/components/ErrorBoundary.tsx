import { Component, ErrorInfo, ReactNode } from 'react'
import { Warning20Regular, ArrowCounterclockwise20Regular } from '@fluentui/react-icons'

export interface ErrorBoundaryProps {
  children: ReactNode
  /**
   * Render a custom fallback. Receives the caught error and a reset callback.
   * If omitted, a Forge-styled default fallback is rendered.
   */
  fallback?: (error: Error, reset: () => void) => ReactNode
  /** Called when an error is caught. Useful for reporting to Sentry etc. */
  onError?: (error: Error, info: ErrorInfo) => void
  /** Reset the boundary when any value in this array changes. */
  resetKeys?: unknown[]
}

interface State {
  error: Error | null
}

/**
 * React error boundary. Catches errors in descendants and renders a fallback.
 * Errors outside the render path (event handlers, async callbacks) are NOT
 * caught; handle those with try/catch.
 *
 * @example
 *   <ErrorBoundary onError={reportToSentry}>
 *     <Dashboard />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info)
  }

  componentDidUpdate(prev: ErrorBoundaryProps) {
    if (!this.state.error) return
    const { resetKeys } = this.props
    if (!resetKeys || !prev.resetKeys) return
    if (resetKeys.length !== prev.resetKeys.length) return
    for (let i = 0; i < resetKeys.length; i++) {
      if (resetKeys[i] !== prev.resetKeys[i]) { this.reset(); return }
    }
  }

  reset = () => this.setState({ error: null })

  render() {
    if (!this.state.error) return this.props.children
    if (this.props.fallback) return this.props.fallback(this.state.error, this.reset)
    return <DefaultFallback error={this.state.error} reset={this.reset} />
  }
}

function DefaultFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '2rem',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        textAlign: 'center',
        maxWidth: 480,
        margin: '0 auto'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48,
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'color-mix(in srgb, var(--error) 15%, transparent)',
          color: 'var(--error)'
        }}
      >
        <Warning20Regular style={{ fontSize: 24 }} />
      </div>
      <div>
        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
          Something went wrong
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {error.message || 'An unexpected error occurred while rendering this section.'}
        </div>
      </div>
      <button
        type="button"
        onClick={reset}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: 'var(--brand-primary)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          fontWeight: 500,
          cursor: 'pointer'
        }}
      >
        <ArrowCounterclockwise20Regular style={{ fontSize: 16 }} />
        Try again
      </button>
    </div>
  )
}
