import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  css: ['vuetify/lib/styles/main.sass'],
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
  head: {
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.tmp.png',
      },
    ],
  },
  env: {
    baseUrl: 'https://brain-t.trap.games',
    apiBaseUrl: 'https://brain-t.api.trap.games',
  },
})
