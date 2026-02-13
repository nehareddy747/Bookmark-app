'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)

    const handleLogin = async () => {
        setLoading(true)
        const supabase = createClient()
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `http://localhost:3000/auth/callback`,
            },
        })
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 text-center dark:bg-zinc-950 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 selection:bg-indigo-500/30">
            {/* Radial glow background */}
            <div className="fixed inset-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.1),transparent_50%)] pointer-events-none" />

            <div className="relative z-10 w-full max-w-[350px] space-y-8 animate-fade-in opacity-0">
                <div className="flex flex-col items-center space-y-4">
                    <img
                        src="/logo.png"
                        alt="Smart Bookmarks Logo"
                        className="h-16 md:h-20 w-auto object-contain drop-shadow-2xl"
                    />
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md hidden">
                            Smart Bookmarks
                        </h1>
                        <p className="text-sm text-slate-400 font-medium">
                            Sign in to manage your private collection
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="group relative w-full overflow-hidden rounded-xl bg-white p-[1px] shadow-lg transition-all hover:shadow-indigo-500/25 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative flex h-12 items-center justify-center space-x-3 rounded-xl bg-slate-950 px-4 transition-all group-hover:bg-slate-900">
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin text-white" />
                        ) : (
                            <svg className="h-5 w-5 text-white" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                            </svg>
                        )}
                        <span className="font-semibold text-white">
                            {loading ? 'Redirecting...' : 'Continue with Google'}
                        </span>
                    </div>
                </button>
            </div>
        </div>
    )
}
