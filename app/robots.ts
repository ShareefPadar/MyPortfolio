import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Internal design-system reference, not part of the portfolio; and the
        // generated era pages, which are the same pages in other years.
        disallow: ['/kitchen-sink', '/_eras/'],
      },
    ],
    sitemap: 'https://www.shareefpadar.com/sitemap.xml',
  };
}
