import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Joins class names and resolves Tailwind conflicts, so a `className` override wins. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
