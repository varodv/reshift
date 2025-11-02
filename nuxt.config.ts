export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: true,
  },
  modules: ['@nuxt/test-utils/module', '@vueuse/nuxt', '@nuxtjs/tailwindcss', 'shadcn-nuxt'],
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
});
