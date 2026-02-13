import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Dashboard from '@/components/Dashboard'

export default async function Page() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        // This logic is also handled by middleware, but good as a fallback
        redirect('/login')
    }

    const { data: bookmarks } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

    return <Dashboard initialBookmarks={bookmarks ?? []} user={user} />
}
