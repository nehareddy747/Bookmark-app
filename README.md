# Smart Bookmarks

A full-stack bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## Features
- **Google OAuth Login**: Secure authentication via Supabase Auth.
- **Private Bookmarks**: Each user has their own isolated collection.
- **Real-time Updates**: Bookmarks update instantly across devices/tabs.
- **Minimal UI**: Clean, distraction-free interface using Tailwind CSS.

## Setup

1. **Environment Variables**:
   Create `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Database Setup**:
   Run the SQL in `schema.sql` in your Supabase SQL Editor to create the table and RLS policies.
   Also, ensure you have enabled Google Auth provider in Supabase Authentication settings.

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Issues Faced & Solutions

1. **Project Initialization**: Next.js `create-next-app` does not support capital letters in package names, requiring a temporary directory creation and move strategy.
2. **Directory Structure**: Initial setup created files in root `app/` folder, but `--src-dir` configuration expected them in `src/app/`. files were moved to `src/` to adhere to Next.js best practices.
3. **Supabase Integration**: Direct schema management via MCP was not possible without specific project access, so a `schema.sql` file is provided for manual execution.
