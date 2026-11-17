import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS, getProjectBySlug } from "@/data/projects";
import { PROFILE } from "@/data/portfolio";
import { ProjectCaseStudyContent } from "@/components/LocalizedPages";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const rawDesc = `${project.title}: ${project.subtitle} ${project.summary}`;
  const description =
    rawDesc.length > 154 ? `${rawDesc.slice(0, 151).trimEnd()}...` : rawDesc;

  return {
    title: project.title,
    description,
    alternates: {
      canonical: `/prosjekter/${project.slug}`,
    },
    openGraph: {
      title: `${project.title} · ${PROFILE.name}`,
      description,
      url: `/prosjekter/${project.slug}`,
    },
  };
}

export default async function ProjectCaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return <ProjectCaseStudyContent slug={slug} />;
}
