'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-md font-bold transition-colors duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-primary !text-white hover:bg-primary-light hover:!text-white active:bg-primary-dark active:!text-white': variant === 'primary',
            'bg-cream text-primary hover:bg-cream-light': variant === 'secondary',
            'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:!text-white': variant === 'outline',
            'bg-transparent text-primary hover:bg-cream': variant === 'ghost',
          },
          {
            'px-2 py-1.5 text-body-sm': size === 'sm',
            'px-2.5 py-2.5 text-button': size === 'md',
            'px-4 py-3 text-button': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button }
