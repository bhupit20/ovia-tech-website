import { resolve } from "node:path";
import { defineConfig } from "vite";

const serviceRouteRewrites = {
  "/website-design-usa": "/pages/website-design-usa.html",
  "/website-design-canada": "/pages/website-design-canada.html",
  "/web-development-new-york": "/pages/web-development-new-york.html",
  "/local-seo": "/pages/resources/local-seo.html",
  "/on-page-seo": "/pages/resources/on-page-seo.html",
  "/technical-seo": "/pages/resources/technical-seo.html",
  "/website-redesigns": "/pages/resources/website-redesigns.html",
  "/saas-vs-custom-website": "/pages/resources/saas-vs-custom-website.html",
  "/software-development-tools": "/pages/resources/software-development-tools.html",
  "/website-cost-guide": "/pages/resources/website-cost-guide.html",
  "/best-ai-tools": "/pages/resources/best-ai-tools.html",
  "/services/frontend-development": "/pages/services/frontend-development.html",
  "/services/backend-development": "/pages/services/backend-development.html",
  "/services/cms-implementation": "/pages/services/cms-implementation.html",
  "/services/technical-qa": "/pages/services/technical-qa.html",
  "/services/web-design": "/pages/services/web-design.html",
  "/services/design-systems": "/pages/services/design-systems.html",
  "/services/branding": "/pages/services/branding.html",
  "/services/web-development": "/pages/services/web-development.html",
  "/services/ecommerce-development": "/pages/services/ecommerce-development.html",
  "/services/saas-development": "/pages/services/saas-development.html",
  "/services/mobile-app-development": "/pages/services/mobile-app-development.html",
  "/services/custom-software-development": "/pages/services/custom-software-development.html",
  "/services/ui-ux-design": "/pages/services/ui-ux-design.html",
  "/services/seo-services": "/pages/services/seo-services.html",
  "/services/ai-automation-solutions": "/pages/services/ai-automation-solutions.html",
  "/services/api-system-integrations": "/pages/services/api-system-integrations.html",
  "/services/maintenance-support": "/pages/services/maintenance-support.html"
};

const cleanServiceRoutes = () => ({
  name: "clean-service-routes",
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const path = req.url?.split("?")[0].replace(/\/$/, "");
      if (path) {
        if (serviceRouteRewrites[path]) {
          req.url = serviceRouteRewrites[path];
        } else if (path.startsWith("/pages/") && !path.includes(".")) {
          req.url = path + ".html";
        }
      }
      next();
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use((req, _res, next) => {
      const path = req.url?.split("?")[0].replace(/\/$/, "");
      if (path) {
        if (serviceRouteRewrites[path]) {
          req.url = serviceRouteRewrites[path];
        } else if (path.startsWith("/pages/") && !path.includes(".")) {
          req.url = path + ".html";
        }
      }
      next();
    });
  }
});

export default defineConfig({
  plugins: [cleanServiceRoutes()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        websiteDesignUsa: resolve(__dirname, "pages/website-design-usa.html"),
        websiteDesignCanada: resolve(__dirname, "pages/website-design-canada.html"),
        webDevelopmentNewYork: resolve(__dirname, "pages/web-development-new-york.html"),
        resourceLocalSeo: resolve(__dirname, "pages/resources/local-seo.html"),
        resourceOnPageSeo: resolve(__dirname, "pages/resources/on-page-seo.html"),
        resourceTechnicalSeo: resolve(__dirname, "pages/resources/technical-seo.html"),
        resourceWebsiteRedesigns: resolve(__dirname, "pages/resources/website-redesigns.html"),
        resourceSaasVsCustomWebsite: resolve(__dirname, "pages/resources/saas-vs-custom-website.html"),
        resourceSoftwareDevelopmentTools: resolve(__dirname, "pages/resources/software-development-tools.html"),
        resourceWebsiteCostGuide: resolve(__dirname, "pages/resources/website-cost-guide.html"),
        resourceBestAiTools: resolve(__dirname, "pages/resources/best-ai-tools.html"),
        services: resolve(__dirname, "pages/services.html"),
        serviceFrontendDevelopment: resolve(__dirname, "pages/services/frontend-development.html"),
        serviceBackendDevelopment: resolve(__dirname, "pages/services/backend-development.html"),
        serviceCmsImplementation: resolve(__dirname, "pages/services/cms-implementation.html"),
        serviceTechnicalQa: resolve(__dirname, "pages/services/technical-qa.html"),
        serviceWebDesign: resolve(__dirname, "pages/services/web-design.html"),
        serviceDesignSystems: resolve(__dirname, "pages/services/design-systems.html"),
        serviceBranding: resolve(__dirname, "pages/services/branding.html"),
        serviceWebDevelopment: resolve(__dirname, "pages/services/web-development.html"),
        serviceEcommerceDevelopment: resolve(__dirname, "pages/services/ecommerce-development.html"),
        serviceSaasDevelopment: resolve(__dirname, "pages/services/saas-development.html"),
        serviceMobileAppDevelopment: resolve(__dirname, "pages/services/mobile-app-development.html"),
        serviceCustomSoftwareDevelopment: resolve(__dirname, "pages/services/custom-software-development.html"),
        serviceUiUxDesign: resolve(__dirname, "pages/services/ui-ux-design.html"),
        serviceSeoServices: resolve(__dirname, "pages/services/seo-services.html"),
        serviceAiAutomationSolutions: resolve(__dirname, "pages/services/ai-automation-solutions.html"),
        serviceApiSystemIntegrations: resolve(__dirname, "pages/services/api-system-integrations.html"),
        serviceMaintenanceSupport: resolve(__dirname, "pages/services/maintenance-support.html"),
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
