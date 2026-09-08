import { resolve } from "node:path";
import { defineConfig } from "vite";

const serviceRouteRewrites = {
  "/website-design-usa": "/pages/website-design-usa.html",
  "/website-design-canada": "/pages/website-design-canada.html",
  "/web-development-new-york": "/pages/web-development-new-york.html",
  "/web-development-toronto": "/pages/web-development-toronto.html",
  "/web-development-vancouver": "/pages/web-development-vancouver.html",
  "/industries/healthcare-medspas": "/pages/industries/healthcare-medspas.html",
  "/industries/real-estate": "/pages/industries/real-estate.html",
  "/industries/law-firms": "/pages/industries/law-firms.html",
  "/industries/restaurants-hospitality": "/pages/industries/restaurants-hospitality.html",
  "/industries/independent-schools": "/pages/industries/independent-schools.html",
  "/web-design-halifax": "/pages/web-design-halifax.html",
  "/web-design-bridgewater": "/pages/web-design-bridgewater.html",
  "/web-development-halifax": "/pages/web-development-halifax.html",
  "/seo-halifax": "/pages/seo-halifax.html",
  "/seo-canada": "/pages/seo-canada.html",
  "/local-seo": "/pages/resources/local-seo.html",
  "/on-page-seo": "/pages/resources/on-page-seo.html",
  "/technical-seo": "/pages/resources/technical-seo.html",
  "/website-redesigns": "/pages/resources/website-redesigns.html",
  "/saas-vs-custom-website": "/pages/resources/saas-vs-custom-website.html",
  "/software-development-tools": "/pages/resources/software-development-tools.html",
  "/website-cost-guide": "/pages/resources/website-cost-guide.html",
  "/best-ai-tools": "/pages/resources/best-ai-tools.html",
  "/automate-business-workflows-ai": "/pages/resources/automate-business-workflows-ai.html",
  "/custom-software-development-cost-startups": "/pages/resources/custom-software-development-cost-startups.html",
  "/best-web-design-agencies-atlantic-canada": "/pages/resources/best-web-design-agencies-atlantic-canada.html",
  "/technologies": "/pages/technologies.html",
  "/technologies/contentful": "/pages/technologies/contentful.html",
  "/technologies/sanity-cms": "/pages/technologies/sanity-cms.html",
  "/technologies/builder-io": "/pages/technologies/builder-io.html",
  "/technologies/storyblok": "/pages/technologies/storyblok.html",
  "/technologies/datocms": "/pages/technologies/datocms.html",
  "/technologies/hubspot-cms": "/pages/technologies/hubspot-cms.html",
  "/technologies/webflow": "/pages/technologies/webflow.html",
  "/technologies/wordpress": "/pages/technologies/wordpress.html",
  "/technologies/gatsby": "/pages/technologies/gatsby.html",
  "/technologies/nextjs": "/pages/technologies/nextjs.html",
  "/technologies/vercel": "/pages/technologies/vercel.html",
  "/technologies/netlify": "/pages/technologies/netlify.html",
  "/technologies/php": "/pages/technologies/php.html",
  "/technologies/shopify": "/pages/technologies/shopify.html",
  "/technologies/nodejs": "/pages/technologies/nodejs.html",
  "/technologies/reactjs": "/pages/technologies/reactjs.html",
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
        webDevelopmentToronto: resolve(__dirname, "pages/web-development-toronto.html"),
        webDevelopmentVancouver: resolve(__dirname, "pages/web-development-vancouver.html"),
        industryHealthcareMedspas: resolve(__dirname, "pages/industries/healthcare-medspas.html"),
        industryRealEstate: resolve(__dirname, "pages/industries/real-estate.html"),
        industryLawFirms: resolve(__dirname, "pages/industries/law-firms.html"),
        industryRestaurantsHospitality: resolve(__dirname, "pages/industries/restaurants-hospitality.html"),
        industryIndependentSchools: resolve(__dirname, "pages/industries/independent-schools.html"),
        resourceLocalSeo: resolve(__dirname, "pages/resources/local-seo.html"),
        resourceOnPageSeo: resolve(__dirname, "pages/resources/on-page-seo.html"),
        resourceTechnicalSeo: resolve(__dirname, "pages/resources/technical-seo.html"),
        resourceWebsiteRedesigns: resolve(__dirname, "pages/resources/website-redesigns.html"),
        resourceSaasVsCustomWebsite: resolve(__dirname, "pages/resources/saas-vs-custom-website.html"),
        resourceSoftwareDevelopmentTools: resolve(__dirname, "pages/resources/software-development-tools.html"),
        resourceWebsiteCostGuide: resolve(__dirname, "pages/resources/website-cost-guide.html"),
        resourceBestAiTools: resolve(__dirname, "pages/resources/best-ai-tools.html"),
        resourceAutomateBusinessWorkflowsAi: resolve(__dirname, "pages/resources/automate-business-workflows-ai.html"),
        resourceCustomSoftwareDevelopmentCostStartups: resolve(__dirname, "pages/resources/custom-software-development-cost-startups.html"),
        resourceBestWebDesignAgenciesAtlanticCanada: resolve(__dirname, "pages/resources/best-web-design-agencies-atlantic-canada.html"),
        technologies: resolve(__dirname, "pages/technologies.html"),
        technologyContentful: resolve(__dirname, "pages/technologies/contentful.html"),
        technologySanityCms: resolve(__dirname, "pages/technologies/sanity-cms.html"),
        technologyBuilderIo: resolve(__dirname, "pages/technologies/builder-io.html"),
        technologyStoryblok: resolve(__dirname, "pages/technologies/storyblok.html"),
        technologyDatocms: resolve(__dirname, "pages/technologies/datocms.html"),
        technologyHubspotCms: resolve(__dirname, "pages/technologies/hubspot-cms.html"),
        technologyWebflow: resolve(__dirname, "pages/technologies/webflow.html"),
        technologyWordpress: resolve(__dirname, "pages/technologies/wordpress.html"),
        technologyGatsby: resolve(__dirname, "pages/technologies/gatsby.html"),
        technologyNextjs: resolve(__dirname, "pages/technologies/nextjs.html"),
        technologyVercel: resolve(__dirname, "pages/technologies/vercel.html"),
        technologyNetlify: resolve(__dirname, "pages/technologies/netlify.html"),
        technologyPhp: resolve(__dirname, "pages/technologies/php.html"),
        technologyShopify: resolve(__dirname, "pages/technologies/shopify.html"),
        technologyNodejs: resolve(__dirname, "pages/technologies/nodejs.html"),
        technologyReactjs: resolve(__dirname, "pages/technologies/reactjs.html"),
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
        blogPost22: resolve(__dirname, "pages/blog/how-to-build-b2b-saas-mvp-2026.html"),
        blogPost23: resolve(__dirname, "pages/blog/ai-operations-automation-small-business.html"),
        blogPost24: resolve(__dirname, "pages/blog/ai-search-optimization-small-business-2026.html"),
        blogPost25: resolve(__dirname, "pages/blog/b2b-website-anatomy-2026.html"),
        blogPost26: resolve(__dirname, "pages/blog/mobile-friendly-website-design-2026.html"),
        blogPost27: resolve(__dirname, "pages/blog/web-design-agency-near-me-vs-remote.html"),
        blogPost28: resolve(__dirname, "pages/blog/corporate-web-design-2026.html"),
        privacyPolicy: resolve(__dirname, "pages/privacy-policy.html"),
        authorAllen: resolve(__dirname, "pages/author/allen.html"),
        webDesignHalifax: resolve(__dirname, "pages/web-design-halifax.html"),
        webDesignBridgewater: resolve(__dirname, "pages/web-design-bridgewater.html"),
        webDevelopmentHalifax: resolve(__dirname, "pages/web-development-halifax.html"),
        seoHalifax: resolve(__dirname, "pages/seo-halifax.html"),
        seoCanada: resolve(__dirname, "pages/seo-canada.html")
      }
    }
  }
});
