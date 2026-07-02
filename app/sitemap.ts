import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.shareefpadar.com';

  // Add your project slugs here as you grow
  const projects = [
    '/work',
    '/work/almosafer-audit',
    '/work/omni-cast-ai',
    '/work/google-maps-route-pass',
    '/work/instagram-local',
    '/work/roomy',
    '/work/form',
  ].map((route) => ({
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
