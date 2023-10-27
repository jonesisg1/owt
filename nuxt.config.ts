// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true }, 
  modules: [
    '@nuxtjs/supabase',
    '@pinia/nuxt',
  ],
  runtimeConfig: {
    cognitoAppClientSecret:'',
    public: {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
      cognitoUserPoolId:'',
      cognitoAppClientId: '',
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
    redirect: false, 
    redirectOptions: {
      login: '/sbAuth',
      callback: '/confirm'
    },
  }
})
