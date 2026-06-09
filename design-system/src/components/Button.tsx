import React from 'react'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary:   { background: 'var(--color-primary)',   color: '#fff',                 border: 'none' },
  secondary: { background: 'var(--color-secondary)', color: '#fff',                 border: 'none' },
  outline:   { background: 'transparent',            color: 'var(--color-primary)', border: '1.5px solid var(--color-primary)' },
  ghost:     { background: 'transparent',            color: 'var(--color-text)',    border: 'none' },
}

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: { padding: '6px 12px',  fontSize: '13px', borderRadius: 'var(--radius-sm)' },
  md: { padding: '10px 20px', fontSize: '14px', borderRadius: 'var(--radius-md)' },
  lg: { padding: '14px 28px', fontSize: '16px', borderRadius: 'var(--radius-md)' },
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading
  return (
    <button
      disabled={isDisabled}
      aria-busy={loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: 500,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.65 : 1,
        width: fullWidth ? '100%' : undefined,
        transition: 'opacity 0.15s, background 0.15s',
        fontFamily: 'var(--font-sans)',
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      {...props}
    >
      {loading ? '…' : children}
    </button>
  )
}
