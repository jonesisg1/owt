// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true }, 
  modules: [
    '@nuxtjs/supabase',
    'dayjs-nuxt'
  ],
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000'
    },
  },
  css: [
    "primevue/resources/themes/lara-light-blue/theme.css",
    "/node_modules/primeflex/primeflex.css",
    "primeicons/primeicons.css"
  ],
  build: {
    transpile: ["primevue"]
  },
  supabase: {
    clientOptions: {
      db: { schema: 'owt' }
    },    
    redirectOptions: {
      login: '/',
      callback: '/confirm'
    },
  },
  dayjs: {
    locales: ['en'],
    plugins: ['relativeTime', 'utc', 'timezone'],
    defaultLocale: 'en',
    defaultTimezone: 'Europe/London',
  }
})
