import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        gradient:
          'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:from-primary/90 hover:to-accent/90 hover:shadow-xl',
        'gradient-pink':
          'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:from-pink-600 hover:to-purple-700 hover:shadow-xl',
        'gradient-blue':
          'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg hover:from-blue-600 hover:to-cyan-700 hover:shadow-xl',
        'gradient-green':
          'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:from-green-600 hover:to-emerald-700 hover:shadow-xl',
        'gradient-orange':
          'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg hover:from-orange-600 hover:to-red-700 hover:shadow-xl',
        discord: 'bg-[#5865F2] text-white shadow-lg hover:bg-[#4752C4] hover:shadow-xl',
        success: 'bg-green-600 text-white shadow-lg hover:bg-green-700 hover:shadow-xl',
        warning: 'bg-yellow-600 text-white shadow-lg hover:bg-yellow-700 hover:shadow-xl',
        danger: 'bg-red-600 text-white shadow-lg hover:bg-red-700 hover:shadow-xl',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
