import React, { useEffect } from 'react';

export interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  schemaMarkup?: any;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = 'https://instantlyanalyze.com/public/logo.png',
  ogType = 'website',
  schemaMarkup
}) => {
  const fullTitle = title.includes('InstantlyAnalyze') ? title : `${title} | InstantlyAnalyze`;
  const currentUrl = canonicalUrl || window.location.href;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update meta keywords if provided
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    }

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // Update Open Graph Meta Tags
    const updateOrCreateMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateOrCreateMeta('og:title', fullTitle);
    updateOrCreateMeta('og:description', description);
    updateOrCreateMeta('og:type', ogType);
    updateOrCreateMeta('og:url', currentUrl);
    updateOrCreateMeta('og:image', ogImage);
    updateOrCreateMeta('og:site_name', 'InstantlyAnalyze');

    // Update Twitter Card Meta Tags
    const updateOrCreateTwitterMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    updateOrCreateTwitterMeta('twitter:card', 'summary_large_image');
    updateOrCreateTwitterMeta('twitter:title', fullTitle);
    updateOrCreateTwitterMeta('twitter:description', description);
    updateOrCreateTwitterMeta('twitter:image', ogImage);

    // Update Schema.org JSON-LD
    if (schemaMarkup) {
      // Remove existing schema markup
      const existingSchema = document.querySelector('script[type="application/ld+json"]');
      if (existingSchema) {
        existingSchema.remove();
      }

      // Add new schema markup
      const schemaScript = document.createElement('script');
      schemaScript.type = 'application/ld+json';
      schemaScript.textContent = JSON.stringify(schemaMarkup);
      document.head.appendChild(schemaScript);
    }
  }, [fullTitle, description, keywords, currentUrl, ogImage, ogType, schemaMarkup]);

  // This component doesn't render anything visible
  return null;
};

// Predefined schema markup for different page types
export const createSoftwareApplicationSchema = (pageData: {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
  featureList?: string[];
  aggregateRating?: {
    ratingValue: string;
    ratingCount: string;
  };
}) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": pageData.name,
  "description": pageData.description,
  "url": pageData.url,
  "applicationCategory": pageData.applicationCategory || "Real Estate Analysis Tool",
  "operatingSystem": "Web Browser",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  ...(pageData.aggregateRating && {
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": pageData.aggregateRating.ratingValue,
      "ratingCount": pageData.aggregateRating.ratingCount,
      "bestRating": "5",
      "worstRating": "1"
    }
  }),
  "author": {
    "@type": "Organization",
    "name": "InstantlyAnalyze",
    "url": "https://instantlyanalyze.com"
  },
  ...(pageData.featureList && {
    "featureList": pageData.featureList
  })
});

export const createWebPageSchema = (pageData: {
  name: string;
  description: string;
  url: string;
  mainEntity?: any;
}) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": pageData.name,
  "description": pageData.description,
  "url": pageData.url,
  "isPartOf": {
    "@type": "WebSite",
    "name": "InstantlyAnalyze",
    "url": "https://instantlyanalyze.com"
  },
  ...(pageData.mainEntity && {
    "mainEntity": pageData.mainEntity
  })
});
