import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const sectionVariants = cva('py-20', {
  variants: {
    variant: {
      default: 'bg-background',
      muted: 'bg-gradient-to-b from-muted/10 to-background',
      card: 'bg-gradient-to-b from-background to-muted/10',
      hero: 'min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20',
      dark: 'bg-gradient-to-b from-background to-card/20',
    },
    spacing: {
      default: 'py-12',
      tight: 'py-8',
      loose: 'py-20',
      none: 'py-0',
    },
    container: {
      default: 'container mx-auto px-4',
      wide: 'container mx-auto px-4 max-w-7xl',
      narrow: 'container mx-auto px-4 max-w-4xl',
      full: 'w-full px-4',
    },
  },
  defaultVariants: {
    variant: 'default',
    spacing: 'default',
    container: 'default',
  },
})

export interface SectionProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof sectionVariants> {
  children: React.ReactNode
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, variant, spacing, container, children, ...props }, ref) => {
    return (
      <section className={cn(sectionVariants({ variant, spacing }), className)} ref={ref} {...props}>
        <div className={cn(sectionVariants({ container }))}>{children}</div>
      </section>
    )
  },
)
Section.displayName = 'Section'

export { Section, sectionVariants }
