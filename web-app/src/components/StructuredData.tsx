import Script from 'next/script';

const StructuredData = () => {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "JenGen.ai",
    "url": "https://jengen.ai",
    "logo": "https://jengen.ai/logo.png",
    "description": "AI-powered membership platform connecting generations through storytelling, smart matching, and custom learning journeys.",
    "foundingDate": "2024",
    "industry": "Education Technology",
    "serviceArea": {
      "@type": "Place",
      "name": "Global"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "url": "https://jengen.ai/contact"
    },
    "sameAs": [
      "https://twitter.com/JenGenAI",
      "https://linkedin.com/company/jengen-ai"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "JenGen.ai",
    "url": "https://jengen.ai",
    "description": "Bridging Generations Through AI-Powered Learning & Mentorship",
    "publisher": {
      "@type": "Organization",
      "name": "JenGen.ai"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://jengen.ai/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "JenGen.ai Membership Platform",
    "description": "Exclusive membership platform offering AI-powered storytelling, smart matching, custom learning journeys, and private mentorship network access.",
    "provider": {
      "@type": "Organization",
      "name": "JenGen.ai"
    },
    "serviceType": "Educational Technology Platform",
    "audience": {
      "@type": "Audience",
      "audienceType": "Intergenerational learners, mentors, and wisdom seekers"
    },
    "offers": [
      {
        "@type": "Offer",
        "name": "Basic Membership",
        "description": "Community access and basic features",
        "category": "Membership"
      },
      {
        "@type": "Offer",
        "name": "Standard Membership", 
        "description": "Smart matching and learning features",
        "category": "Membership"
      },
      {
        "@type": "Offer",
        "name": "Premium Membership",
        "description": "AI-powered storytelling and full platform access",
        "category": "Membership"
      }
    ]
  };

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <Script
        id="service-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema),
        }}
      />
    </>
  );
};

export default StructuredData;