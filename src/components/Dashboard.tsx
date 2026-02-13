'use client'

import { createClient } from '@/utils/supabase/client'
import { Bookmark } from '@/types'
import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Dashboard({ initialBookmarks, user }: { initialBookmarks: Bookmark[], user: any }) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
    const [title, setTitle] = useState('')
    const [url, setUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        setBookmarks(initialBookmarks)
    }, [initialBookmarks])

    useEffect(() => {
        const channel = supabase
            .channel('realtime bookmarks')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'bookmarks',
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setBookmarks((prev) => [payload.new as Bookmark, ...prev])
                    } else if (payload.eventType === 'DELETE') {
                        setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
                    } else if (payload.eventType === 'UPDATE') {
                        setBookmarks((prev) =>
                            prev.map((b) => (b.id === payload.new.id ? (payload.new as Bookmark) : b))
                        )
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase, user.id])

    const addBookmark = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !url) return

        setLoading(true)
        const { error } = await supabase.from('bookmarks').insert({
            title,
            url,
            user_id: user.id,
        })
        setLoading(false)

        if (error) {
            alert('Error adding bookmark')
        } else {
            setTitle('')
            setUrl('')
        }
    }

    const deleteBookmark = async (id: string) => {
        const { error } = await supabase.from('bookmarks').delete().eq('id', id)
        if (error) alert('Error deleting bookmark')
    }

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }

    return (
        <div className="min-h-screen w-full text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
            {/* Fixed Background */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900" />
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(120,119,198,0.1),transparent_50%)]" />

            <div className="relative mx-auto max-w-3xl px-6 py-12 md:py-20 animate-fade-in opacity-0">
                <header className="flex items-center justify-between mb-12">
                    <img
                        src="/logo.png"
                        alt="Smart Bookmarks"
                        className="h-10 w-auto object-contain drop-shadow-sm"
                    />
                    <button
                        onClick={handleSignOut}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:border-white/20"
                    >
                        Sign out
                    </button>
                </header>

                <main>
                    <form onSubmit={addBookmark} className="mb-12 space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-2xl backdrop-blur-xl ring-1 ring-white/5 transition-all hover:border-white/20">
                        <div className="grid gap-4 md:grid-cols-2">
                            <input
                                type="text"
                                placeholder="Title (e.g., GitHub)"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
                                required
                            />
                            <input
                                type="url"
                                placeholder="URL (https://...)"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-slate-900/50 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                        >
                            {loading ? 'Adding...' : 'Add Bookmark'}
                        </button>
                    </form>

                    <div className="space-y-4">
                        {bookmarks.map((bookmark) => (
                            <div
                                key={bookmark.id}
                                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-5 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-xl hover:shadow-indigo-500/10"
                            >
                                <div className="flex-1 min-w-0 pr-4">
                                    <a
                                        href={bookmark.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block mb-1 text-lg font-bold text-slate-100 truncate hover:text-indigo-400 transition-colors"
                                    >
                                        {bookmark.title}
                                    </a>
                                    <p className="truncate text-sm text-slate-500 font-medium font-mono">
                                        {bookmark.url}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <button
                                        onClick={() => deleteBookmark(bookmark.id)}
                                        className="rounded-lg bg-gradient-to-r from-red-500/10 to-pink-500/10 p-2 text-red-400 transition-all hover:from-red-600 hover:to-pink-600 hover:text-white shadow-sm hover:shadow-red-500/20"
                                        aria-label="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {bookmarks.length === 0 && (
                            <div className="text-center py-20 text-slate-500 animate-in fade-in zoom-in duration-500">
                                <p className="text-lg">No bookmarks yet. Add one above to get started!</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}
