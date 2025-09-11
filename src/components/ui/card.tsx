import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const cardVariants = cva('rounded-2xl border transition-all duration-300', {
  variants: {
    variant: {
      default: 'bg-card text-card-foreground border-border/50',
      ghost: 'bg-card/60 backdrop-blur-sm border-border/30',
      solid: 'bg-card border-border',
      gradient: 'bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border-border/20',
      guild: 'bg-card/70 backdrop-blur-sm hover:scale-105 cursor-pointer border-border/30',
      interactive: 'bg-card/60 backdrop-blur-sm border-border/30 hover:bg-card/80 cursor-pointer',
    },
    size: {
      default: 'p-6',
      sm: 'p-4',
      lg: 'p-8',
      xl: 'p-12',
    },
    shadow: {
      none: '',
      sm: 'shadow-sm',
      default: 'shadow-lg',
      lg: 'shadow-xl',
      xl: 'shadow-2xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    shadow: 'none',
  },
})

const cardHeaderVariants = cva('flex flex-col space-y-1.5', {
  variants: {
    spacing: {
      default: 'mb-6',
      tight: 'mb-4',
      loose: 'mb-8',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
})

const cardContentVariants = cva('', {
  variants: {
    spacing: {
      default: 'space-y-4',
      tight: 'space-y-2',
      loose: 'space-y-6',
    },
  },
  defaultVariants: {
    spacing: 'default',
  },
})

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> {}

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardContentVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, variant, size, shadow, ...props }, ref) => (
  <div ref={ref} className={cn(cardVariants({ variant, size, shadow }), className)} {...props} />
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(({ className, spacing, ...props }, ref) => (
  <div ref={ref} className={cn(cardHeaderVariants({ spacing }), className)} {...props} />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-xl font-bold leading-none tracking-tight', className)} {...props} />
  ),
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground leading-relaxed', className)} {...props} />
  ),
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(({ className, spacing, ...props }, ref) => (
  <div ref={ref} className={cn(cardContentVariants({ spacing }), className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center pt-6 border-t border-border/50', className)} {...props} />
  ),
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
