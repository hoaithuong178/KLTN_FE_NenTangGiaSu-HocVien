// src/components/SEO.tsx
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    canonicalUrl?: string;
    ogType?: string;
    ogImage?: string;
    noIndex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    canonicalUrl = window.location.href,
    ogType = 'website',
    ogImage,
    noIndex = false,
}) => {
    const fullTitle = `${title} | TeachMe`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            {ogImage && <meta property="og:image" content={ogImage} />}

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={canonicalUrl} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={description} />
            {ogImage && <meta property="twitter:image" content={ogImage} />}

            {/* Canonical URL */}
            <link rel="canonical" href={canonicalUrl} />

            {/* No index if specified */}
            {noIndex && <meta name="robots" content="noindex, nofollow" />}
        </Helmet>
    );
};

export default SEO;
