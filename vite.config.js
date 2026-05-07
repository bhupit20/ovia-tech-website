import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        services: resolve(__dirname, "pages/services.html"),
        work: resolve(__dirname, "pages/work.html"),
        industries: resolve(__dirname, "pages/industries.html"),
        pricing: resolve(__dirname, "pages/pricing.html"),
        about: resolve(__dirname, "pages/about.html"),
        contact: resolve(__dirname, "pages/contact.html"),
        blog: resolve(__dirname, "pages/blog.html"),
        blogPost1: resolve(__dirname, "pages/blog/website-cost-small-business-2026.html"),
        blogPost2: resolve(__dirname, "pages/blog/7-signs-website-losing-customers.html"),
        blogPost3: resolve(__dirname, "pages/blog/choose-software-development-agency-2026.html"),
        blogPost4: resolve(__dirname, "pages/blog/local-seo-small-business-usa-2026.html"),
        blogPost5: resolve(__dirname, "pages/blog/page-1-google-2026.html"),
        blogPost6: resolve(__dirname, "pages/blog/5-page-website-7-days-new-york-contractor.html"),
        blogPost7: resolve(__dirname, "pages/blog/chatgpt-vs-claude-vs-gemini-2026.html"),
        blogPost8: resolve(__dirname, "pages/blog/claude-ai-build-websites-faster.html"),
        blogPost9: resolve(__dirname, "pages/blog/chatgpt-small-business-2026.html"),
        blogPost10: resolve(__dirname, "pages/blog/ai-website-builder-vs-web-agency-2026.html"),
        blogPost11: resolve(__dirname, "pages/blog/ai-seo-2026-small-business.html"),
        blogPost12: resolve(__dirname, "pages/blog/claude-ai-audit-5-websites.html"),
        blogPost13: resolve(__dirname, "pages/blog/best-ai-tools-small-business-usa-2026.html"),
        blogPost14: resolve(__dirname, "pages/blog/saas-vs-custom-website.html"),
        blogPost15: resolve(__dirname, "pages/blog/how-to-choose-web-design-agency-usa.html"),
        blogPost16: resolve(__dirname, "pages/blog/google-business-profile-setup-2026.html"),
        blogPost17: resolve(__dirname, "pages/blog/website-loading-speed-fix.html"),
        blogPost18: resolve(__dirname, "pages/blog/med-spa-new-york-200-leads-case-study.html"),
        blogPost19: resolve(__dirname, "pages/blog/flutter-vs-react-native-2026.html"),
        blogPost20: resolve(__dirname, "pages/blog/what-is-saas-should-build-one.html"),
        blogPost21: resolve(__dirname, "pages/blog/cost-of-bad-website.html"),
        authorAllen: resolve(__dirname, "pages/author/allen.html")
      }
    }
  }
});
