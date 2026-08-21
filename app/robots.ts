import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Internal design-system reference, not part of the portfolio.
        disallow: '/kitchen-sink',
      },
    ],
    sitemap: 'https://www.shareefpadar.com/sitemap.xml',
  };
}
