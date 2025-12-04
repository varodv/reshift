export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: true,
  },
  modules: [
    '@nuxt/test-utils/module',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@nuxtjs/i18n',
  ],
  typescript: {
    typeCheck: true,
  },
  app: {
    head: {
      title: 'reshift',
    },
  },
  ssr: false,
  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },
  i18n: {
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.json',
      },
    ],
    defaultLocale: 'en',
  },
});
