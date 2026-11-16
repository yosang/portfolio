import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { PROJECTS, getProjectBySlug } from "@/data/projects";
import { PROFILE } from "@/data/portfolio";
import { UI } from "@/data/ui";
import { ProjectMedia } from "@/components/ProjectMedia";
import { CaseStudyAskButton } from "@/components/CaseStudyAskButton";

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

  const t = UI.home;
  const currentIndex = PROJECTS.findIndex((p) => p.slug === project.slug);
  const prevProject =
    currentIndex > 0 ? PROJECTS[currentIndex - 1] : PROJECTS[PROJECTS.length - 1];
  const nextProject =
    currentIndex < PROJECTS.length - 1 ? PROJECTS[currentIndex + 1] : PROJECTS[0];

  const { caseStudy } = project;
  const firstTwoSections = caseStudy.sections.slice(0, 2);
  const remainingSections = caseStudy.sections.slice(2);

  return (
    <article
      data-viewport-section={`Prosjekt: ${project.title}`}
      className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16"
    >
      {/* Back navigation */}
      <div className="mb-8">
        <Link
          href="/#prosjekter"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{t.backToProjects}</span>
        </Link>
      </div>

      {/* Header */}
      <header className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-paper-subtle px-2.5 py-1 font-mono text-xs font-medium text-ink">
            {project.category === "independent"
              ? t.categoryIndependent
              : t.categorySchool}
          </span>
          <span className="rounded-md bg-paper-subtle px-2.5 py-1 font-mono text-xs text-ink-soft">
            {project.year}
          </span>
          {project.tags
            .filter((tag) => tag !== project.year)
            .map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-line px-2.5 py-0.5 font-mono text-xs text-ink-soft"
              >
                {tag}
              </span>
            ))}
        </div>

        <h1 className="font-display text-3xl font-normal tracking-[-0.03em] text-ink sm:text-5xl">
          {project.title}
        </h1>

        <p className="max-w-[64ch] text-lg leading-relaxed text-ink-soft">
          {caseStudy.intro}
        </p>

        {/* Role & Status card */}
        <div className="surface-card grid gap-4 rounded-xl p-4 sm:grid-cols-2 sm:px-5 sm:py-4">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
              Min rolle
            </div>
            <div className="mt-1 text-sm font-medium text-ink">
              {caseStudy.role}
            </div>
          </div>
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
              Status
            </div>
            <div className="mt-1 text-sm font-medium text-ink">
              {caseStudy.status}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-paper transition-opacity hover:opacity-88"
            >
              <span>{t.openLive}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}

          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-raised px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-ink/35"
            >
              <span>{t.openCode}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}

          <CaseStudyAskButton title={project.title} />
        </div>

        {project.repoNote && (
          <p className="text-xs leading-relaxed text-ink-soft">
            {project.repoNote}
          </p>
        )}
      </header>

      {/* Full-width Hero Stage (1024px wide on desktop so every detail is legible) */}
      <div className="mt-10 sm:mt-12">
        <ProjectMedia item={project} priority linkToCase={false} fullWidth />
      </div>

      {/* First 2 narrative sections */}
      <div className="mt-12 space-y-12 sm:mt-16 sm:space-y-14">
        {firstTwoSections.map((sec) => (
          <CaseSection key={sec.title} section={sec} />
        ))}
      </div>

      {/* Optional Mobile 3-screen Gallery (for VGS Bordtennis) */}
      {caseStudy.mobileGallery && caseStudy.mobileGallery.length > 0 && (
        <figure className="mt-12 sm:mt-16">
          <div className="rounded-2xl border border-line bg-[#17211e] p-4 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">
              {caseStudy.mobileGallery.map((img) => (
                <div key={img.src} className="space-y-2.5">
                  <div className="overflow-hidden rounded-xl border border-white/14 bg-[#0d1017] shadow-lg">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      sizes="(min-width: 1024px) 310px, (min-width: 640px) 30vw, 92vw"
                      className="h-auto w-full object-cover select-none"
                    />
                  </div>
                  <p className="px-0.5 text-xs leading-relaxed text-[#9ca0a8]">
                    {img.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </figure>
      )}

      {/* Remaining narrative sections + optional full-width wideImage */}
      {remainingSections.length > 0 && (
        <div className="mt-12 space-y-12 sm:mt-16 sm:space-y-14">
          {remainingSections.map((sec, idx) => (
            <div key={sec.title} className="space-y-12 sm:space-y-14">
              <CaseSection section={sec} />

              {idx === 1 && caseStudy.wideImage && (
                <figure className="space-y-3">
                  <div className="overflow-hidden rounded-2xl border border-line bg-[#17211e] p-3 sm:p-6">
                    <div className="overflow-hidden rounded-xl border border-white/14">
                      <Image
                        src={caseStudy.wideImage.src}
                        alt={caseStudy.wideImage.alt}
                        width={caseStudy.wideImage.width}
                        height={caseStudy.wideImage.height}
                        sizes="(min-width: 1024px) 980px, 96vw"
                        className="h-auto w-full object-cover select-none"
                      />
                    </div>
                  </div>
                  <figcaption className="px-1 text-xs leading-relaxed text-ink-soft">
                    {caseStudy.wideImage.caption}
                  </figcaption>
                </figure>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Next / Previous Project Footer */}
      <nav
        aria-label="Flere prosjekter"
        className="mt-16 grid gap-4 border-t border-line pt-10 sm:mt-20 sm:grid-cols-2"
      >
        <Link
          href={`/prosjekter/${prevProject.slug}`}
          className="surface-card group flex flex-col justify-between rounded-xl p-5 transition-colors hover:border-ink/30"
        >
          <span className="inline-flex items-center gap-1 font-mono text-xs text-ink-soft">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Forrige prosjekt</span>
          </span>
          <span className="mt-2 font-display text-lg font-medium text-ink">
            {prevProject.title}
          </span>
          <span className="mt-0.5 text-xs text-ink-soft line-clamp-1">
            {prevProject.subtitle}
          </span>
        </Link>

        <Link
          href={`/prosjekter/${nextProject.slug}`}
          className="surface-card group flex flex-col justify-between rounded-xl p-5 text-left transition-colors hover:border-ink/30 sm:items-end sm:text-right"
        >
          <span className="inline-flex items-center gap-1 font-mono text-xs text-ink-soft">
            <span>Neste prosjekt</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="mt-2 font-display text-lg font-medium text-ink">
            {nextProject.title}
          </span>
          <span className="mt-0.5 text-xs text-ink-soft line-clamp-1">
            {nextProject.subtitle}
          </span>
        </Link>
      </nav>
    </article>
  );
}

function CaseSection({
  section,
}: {
  section: { title: string; paragraphs: string[]; bullets?: string[] };
}) {
  return (
    <section className="max-w-3xl space-y-4">
      <h2 className="font-display text-xl font-medium tracking-[-0.02em] text-ink sm:text-2xl">
        {section.title}
      </h2>

      <div className="space-y-4 text-base leading-relaxed text-ink-soft">
        {section.paragraphs.map((p, i) => (
          <p key={i} className="max-w-[64ch]">
            {p}
          </p>
        ))}
      </div>

      {section.bullets && section.bullets.length > 0 && (
        <ul className="surface-card mt-4 space-y-2.5 rounded-xl p-5 text-sm text-ink-soft">
          {section.bullets.map((b, i) => {
            const colonIdx = b.indexOf(":");
            const hasLabel = colonIdx > 0 && colonIdx <= 44;
            return (
              <li key={i} className="leading-relaxed">
                ·{" "}
                {hasLabel ? (
                  <>
                    <span className="font-medium text-ink">
                      {b.slice(0, colonIdx + 1)}
                    </span>
                    {b.slice(colonIdx + 1)}
                  </>
                ) : (
                  b
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
