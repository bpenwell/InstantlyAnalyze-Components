import { useEffect } from 'react';
import { PAGE_PATH, PropertyInformation } from '@bpenwell/instantlyanalyze-module';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
}

interface DynamicSEOProps {
  propertyInfo?: PropertyInformation;
}

// SEO configurations for different routes
const SEO_CONFIGS: Record<string, SEOConfig> = {
  [PAGE_PATH.HOME]: {
    title: "InstantlyAnalyze - Property Analyzer & Real Estate Analyzer",
    description: "Free property analyzer and real estate analyzer tool. Analyze rental properties with comprehensive ROI, cash flow, and cap rate calculations. Start your free analysis now!",
    keywords: "property analyzer, real estate analyzer, rental properties, investment property, cash flow, ROI, cap rate, real estate investors, property analysis, real estate investments"
  },
  [PAGE_PATH.RENTAL_CALCULATOR_HOME]: {
    title: "Property Analyzer & Real Estate Analyzer - Free Rental Properties Analysis Tool",
    description: "Free property analyzer and real estate analyzer tool. Analyze rental properties with comprehensive ROI, cash flow, cap rate calculations, and closing costs. Generate detailed PDF reports for real estate investors. Start your free analysis now!",
    keywords: "property analyzer, real estate analyzer, rental properties, investment property, cash flow, ROI, cap rate, closing costs, real estate investors, mortgage calculator, real estate investments, short term rentals, real estate, property analysis, return on investment, purchase price, user friendly, long term, rehab rent, real estate deals, pdf report"
  },
  [PAGE_PATH.ZILLOW_SCRAPER]: {
    title: "Real Estate Market Analyzer - Property Market Research Tool | InstantlyScan",
    description: "Real estate market analyzer and property market research tool. Analyze entire real estate markets at once with comprehensive market analysis, cash flow projections, and investment property evaluation. Perfect for real estate investors looking to scale their property research.",
    keywords: "real estate market analyzer, property market research, real estate investors, investment property, real estate deals, market analysis, property analysis, cash flow, real estate investments, zillow scraper, market research tool, property research, real estate, investment analysis, property evaluation, market data, real estate portfolio, property investment, market trends, real estate analysis"
  },
  [PAGE_PATH.DASHBOARD]: {
    title: "Dashboard - InstantlyAnalyze Property Analysis Reports",
    description: "View and manage your property analysis reports. Access your rental property calculations, cash flow analysis, and investment property evaluations in one convenient dashboard.",
    keywords: "property analysis dashboard, rental property reports, real estate analysis, investment property dashboard, cash flow reports, property calculator results"
  },
  [PAGE_PATH.PROFILE]: {
    title: "Profile - InstantlyAnalyze Account Settings",
    description: "Manage your InstantlyAnalyze account settings, subscription, and analysis preferences. Update your profile and customize your property analysis experience.",
    keywords: "instantlyanalyze profile, account settings, property analysis preferences, subscription management, user profile"
  },
  [PAGE_PATH.SUBSCRIBE]: {
    title: "Subscribe - InstantlyAnalyze Pro Plans",
    description: "Upgrade to InstantlyAnalyze Pro for unlimited property analysis reports, advanced features, and priority support. Choose the plan that fits your real estate investment needs.",
    keywords: "instantlyanalyze pro, subscription plans, property analysis upgrade, real estate tools subscription, unlimited reports"
  },
  [PAGE_PATH.BLOG]: {
    title: "Real Estate Investment Blog - Property Analysis Tips & Insights",
    description: "Expert insights, tips, and guides for real estate investors. Learn about property analysis, investment strategies, market trends, and rental property management.",
    keywords: "real estate blog, property investment tips, real estate investing, property analysis guide, rental property advice, real estate market insights"
  },
  [PAGE_PATH.MISSION]: {
    title: "Our Mission - InstantlyAnalyze Real Estate Analysis Platform",
    description: "Learn about InstantlyAnalyze's mission to democratize real estate investment analysis. Discover how we're making property analysis accessible to all investors.",
    keywords: "instantlyanalyze mission, real estate analysis platform, property investment democratization, real estate tools mission"
  },
  [PAGE_PATH.CONTACT_US]: {
    title: "Contact Us - InstantlyAnalyze Support",
    description: "Get in touch with the InstantlyAnalyze team. Contact us for support, feedback, or questions about our property analysis tools and real estate investment platform.",
    keywords: "instantlyanalyze contact, property analysis support, real estate tools help, customer support, contact instantlyanalyze"
  }
};

// Helper function to format property address for title
const formatPropertyAddressTitle = (propertyInfo?: PropertyInformation): string => {
  if (!propertyInfo || !propertyInfo.streetAddress) {
    return "Analyze Properties | InstantlyAnalyze";
  }
  
  const address = propertyInfo.streetAddress;
  return `${address} - Property Analysis | InstantlyAnalyze`;
};

const updateSEO = (propertyInfo?: PropertyInformation) => {
  const currentPath = window.location.pathname;
  let seoConfig = SEO_CONFIGS[currentPath];
  
  // Handle dynamic property pages
  if (currentPath.includes('/analyze/properties/view/') || currentPath.includes('/analyze/properties/share/')) {
    const addressTitle = formatPropertyAddressTitle(propertyInfo);
    seoConfig = {
      title: addressTitle,
      description: `Detailed property analysis and investment evaluation for ${propertyInfo ? `${propertyInfo.streetAddress}, ${propertyInfo.city}, ${propertyInfo.state}` : 'this property'}. View comprehensive ROI, cash flow, and cap rate calculations.`,
      keywords: "property analysis, real estate investment, rental property analysis, cash flow, ROI, cap rate, property evaluation, real estate calculator",
      canonicalUrl: window.location.href
    };
  }

  if (seoConfig) {
    // Update document title
    document.title = seoConfig.title.includes('InstantlyAnalyze') 
      ? seoConfig.title 
      : `${seoConfig.title} | InstantlyAnalyze`;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', seoConfig.description);
    }

    // Update meta keywords if provided
    if (seoConfig.keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', seoConfig.keywords);
    }

    // Update canonical URL
    if (seoConfig.canonicalUrl) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute('href', seoConfig.canonicalUrl);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', document.title);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', seoConfig.description);
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', window.location.href);
    }

    // Update Twitter Card tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute('content', document.title);
    }

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
      twitterDescription.setAttribute('content', seoConfig.description);
    }
  }
};

export const useSEO = (props?: DynamicSEOProps) => {
  const { propertyInfo } = props || {};
  
  useEffect(() => {
    // Initial SEO update
    updateSEO(propertyInfo);

    // Listen for route changes (back/forward buttons)
    const handlePopState = () => {
      updateSEO(propertyInfo);
    };

    window.addEventListener('popstate', handlePopState);

    // Also listen for programmatic navigation
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(() => updateSEO(propertyInfo), 0); // Use setTimeout to ensure DOM is updated
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(() => updateSEO(propertyInfo), 0);
    };

    return () => {
      window.removeEventListener('popstate', handlePopState);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, [propertyInfo]);

  // Return current SEO config or dynamic config for property pages
  const currentPath = window.location.pathname;
  if (currentPath.includes('/analyze/properties/view/') || currentPath.includes('/analyze/properties/share/')) {
    const addressTitle = formatPropertyAddressTitle(propertyInfo);
    return {
      title: addressTitle,
      description: `Detailed property analysis and investment evaluation for ${propertyInfo ? `${propertyInfo.streetAddress}, ${propertyInfo.city}, ${propertyInfo.state}` : 'this property'}. View comprehensive ROI, cash flow, and cap rate calculations.`,
      keywords: "property analysis, real estate investment, rental property analysis, cash flow, ROI, cap rate, property evaluation, real estate calculator",
      canonicalUrl: window.location.href
    };
  }

  return SEO_CONFIGS[currentPath] || null;
};
