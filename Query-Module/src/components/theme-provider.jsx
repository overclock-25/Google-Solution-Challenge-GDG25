"use client"

import * as React from "react"
import dynamic from 'next/dynamic';

// import { ThemeProvider as NextThemesProvider } from "next-themes"    //! for production ready app

const NextThemesProvider = dynamic(
    () => import('next-themes').then((e) => e.ThemeProvider),
    {
        ssr: false,
    }
)

export function ThemeProvider({
    children,
    ...props
}) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
