import React from 'react'

type Variant = 'info' | 'success' | 'warning' | 'error' | 'neutral'

export interface BadgeProps {
  children: React.ReactNode
  variant?: Variant
  style?: React.CSSProperties
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  info:    { background: 'var(--color-info-bg)',    color: 'var(--color-info)' },
  success: { background: 'var(--color-success-bg)', color: 'var(--color-success)' },
  warning: { background: 'var(--color-warning-bg)', color: 'var(--color-warning)' },
  error:   { background: 'var(--color-error-bg)',   color: 'var(--color-error)' },
  neutral: { background: 'var(--color-surface-alt)', color: 'var(--color-text-secondary)' },
}

export function Badge({ children, variant = 'neutral', style }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: 'var(--radius-full)',
        fontSize: '12px',
        fontWeight: 600,
        fontFamily: 'var(--font-sans)',
        ...variantStyles[variant],
        ...style,
      }}
    >
      {children}
    </span>
  )
}
