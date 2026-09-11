/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_PANEL_USERNAME: string
  readonly VITE_PANEL_PASSWORD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
