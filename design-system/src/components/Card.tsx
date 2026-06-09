import React from 'react'

type Padding = 'none' | 'sm' | 'md' | 'lg'

export interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: Padding
  shadow?: boolean
  style?: React.CSSProperties
  as?: React.ElementType
}

const paddingMap: Record<Padding, string> = {
  none: '0',
  sm:   '12px',
  md:   '20px',
  lg:   '32px',
}

export function Card({
  children,
  padding = 'md',
  shadow = true,
  style,
  as: Tag = 'div',
  ...props
}: CardProps) {
  return (
    <Tag
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: paddingMap[padding],
        boxShadow: shadow ? 'var(--shadow-sm)' : 'none',
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  )
}
