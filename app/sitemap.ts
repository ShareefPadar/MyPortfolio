import { MetadataRoute } from 'next';
import { slugs } from '@/lib/work';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.shareefpadar.com';

  // Add your project slugs here as you grow
  const projects = ['/work', ...slugs.map((s) => `/work/${s}`)].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...projects,
  ];
}
