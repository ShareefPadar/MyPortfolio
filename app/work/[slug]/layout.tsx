import { Metadata } from 'next';
import { projects } from '../data';

export async function generateMetadata({ params }: any): Promise<Metadata> {
  // Await params for Next.js 15+ compatibility if needed, but safe as any
  const awaitedParams = await params;
  const slug = awaitedParams.slug;
  const project = projects[slug as keyof typeof projects];
  
  if (!project) {
    return {
      title: 'Project | Shareef Padar',
    };
  }

  return {
    title: `${project.title} | Shareef Padar`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Shareef Padar`,
      description: project.description,
      images: [
        {
          url: project.imageUrl,
        },
      ],
    },
  };
}

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
