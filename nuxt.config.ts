export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: true,
  },
  modules: ['@nuxt/test-utils/module', '@vueuse/nuxt'],
  typescript: {
    typeCheck: true,
  },
});
