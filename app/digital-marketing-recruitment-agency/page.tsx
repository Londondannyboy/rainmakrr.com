import type { Metadata } from "next";
import Link from "next/link";
import { FAQ } from "@/components/FAQ";

export const metadata: Metadata = {
  title: "Boutique Digital Marketing Recruitment Agency | Marketing Talent | Rainmakrr",
  description:
    "Boutique digital marketing recruitment agency placing performance marketers, brand leaders, and growth talent into startups, scale-ups, and agencies across London & UK.",
  keywords:
    "boutique digital marketing recruitment agency, digital marketing recruitment agency, marketing recruitment agency london, growth marketing recruitment",
  openGraph: {
    title: "Boutique Digital Marketing Recruitment Agency | Marketing Talent",
    description: "Boutique digital marketing recruitment agency placing performance marketers, brand leaders, and growth talent.",
    type: "website",
    url: "https://rainmakrr.com/digital-marketing-recruitment-agency",
  },
  alternates: {
    canonical: "https://rainmakrr.com/digital-marketing-recruitment-agency",
  },
};

const performanceRoles = [
  "Head of Growth",
  "Performance Marketing Manager",
  "Paid Media Manager (PPC/Social)",
  "SEO Manager",
  "CRM / Lifecycle Manager",
  "Marketing Analyst",
];

const brandRoles = [
  "Brand Manager",
  "Creative Director",
  "Content Marketing Manager",
  "Social Media Manager",
  "Copywriter",
  "Design Lead",
];

const leadershipRoles = [
  "CMO / VP Marketing",
  "Marketing Director",
  "Head of Brand",
  "Head of Comms",
  "Growth Lead",
  "Demand Gen Director",
];

const sectors = [
  { name: "Tech & SaaS", description: "B2B software, developer tools, martech" },
  { name: "E-commerce & DTC", description: "Fashion, beauty, consumer goods" },
  { name: "Fintech", description: "Neobanks, payments, wealthtech" },
  { name: "Healthtech", description: "Digital health, wellness, medtech" },
  { name: "Agencies", description: "Creative, performance, integrated" },
  { name: "Startups & Scale-ups", description: "Seed to Series C across verticals" },
];

const faqs = [
  {
    question: "What makes a boutique digital marketing recruitment agency different?",
    answer:
      "We work with fewer clients and focus on quality over volume. You get senior consultant attention, not a junior researcher sending bulk CVs. Our shortlists are curated, not generated.",
  },
  {
    question: "Do you recruit for both in-house and agency roles?",
    answer:
      "Yes. We place across in-house teams, creative agencies, performance agencies, and consultancies. Many of our candidates have experience on both sides.",
  },
  {
    question: "What's the typical time to hire?",
    answer:
      "For most marketing roles, we deliver a qualified shortlist within 5 business days. Senior hires (Head of / Director level) typically take 3-4 weeks to offer.",
  },
  {
    question: "Do you cover contract and freelance roles?",
    answer:
      "Yes. We place permanent, contract, and freelance marketers depending on your needs.",
  },
];

const relatedPages = [
  { href: "/fintech-recruitment-agency", title: "Fintech Recruitment", description: "Fintech & payments talent." },
  { href: "/climate-tech-recruitment-agency", title: "Climate Tech Recruitment", description: "Net zero technology talent." },
  { href: "/chief-of-staff-recruitment-agency", title: "Chief of Staff Recruitment", description: "Strategic leadership roles." },
  { href: "/venture-capital-recruitment-agency", title: "Venture Capital Recruitment", description: "VC fund talent specialists." },
];

export default function DigitalMarketingRecruitmentAgency() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EmploymentAgency",
    name: "Rainmakrr - Digital Marketing Recruitment Agency",
    description: "Boutique digital marketing recruitment agency placing performance marketers, brand leaders, and growth talent into startups, scale-ups, and agencies.",
    url: "https://rainmakrr.com/digital-marketing-recruitment-agency",
    areaServed: ["United Kingdom", "London"],
    address: { "@type": "PostalAddress", addressLocality: "London", addressCountry: "UK" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://rainmakrr.com" },
      { "@type": "ListItem", position: 2, name: "Digital Marketing Recruitment Agency", item: "https://rainmakrr.com/digital-marketing-recruitment-agency" },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main>
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 via-transparent to-orange-500/20" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <nav className="text-sm mb-8 text-slate-400">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-pink-400">Digital Marketing Recruitment Agency</span>
            </nav>

            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                <span className="bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
                  Boutique Digital Marketing Recruitment Agency
                </span>{" "}
                | Marketing Talent Specialists
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Rainmakrr is a <strong>boutique digital marketing recruitment agency</strong> connecting
                high-growth companies with exceptional marketing talent. From performance marketers to CMOs,
                we place the hires that drive customer acquisition and brand growth.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link href="/contact" className="px-8 py-4 bg-gradient-to-r from-pink-600 to-orange-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all">
                  Hire Marketing Talent
                </Link>
                <Link href="/contact" className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-xl border border-slate-700 hover:border-pink-500 transition-all">
                  View Marketing Jobs
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 text-sm text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-400 rounded-full" />
                  Performance & Growth
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-400 rounded-full" />
                  Brand & Creative
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-400 rounded-full" />
                  London & UK
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-6">Why Choose a Boutique Digital Marketing Recruitment Agency</h2>
            <p className="text-slate-300 mb-8 max-w-3xl">
              Big agencies churn candidates. A <strong>boutique digital marketing recruitment agency</strong> takes
              a different approach — fewer clients, deeper relationships, and shortlists built on quality over volume.
            </p>
            <h3 className="text-2xl font-bold text-white mb-6">How Our Digital Marketing Recruitment Agency Works</h3>
            <p className="text-slate-300 mb-6 max-w-3xl">
              Our digital marketing recruitment agency process starts with your growth model. We map your hiring
              needs against your funnel — awareness, acquisition, retention — then source candidates who&apos;ve
              solved similar challenges.
            </p>
            <div className="grid md:grid-cols-4 gap-4 mt-8">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="text-white font-medium mb-1">Passive Sourcing</h4>
                <p className="text-slate-400 text-sm">Senior marketers aren&apos;t on job boards</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="text-2xl mb-2">📁</div>
                <h4 className="text-white font-medium mb-1">Portfolio Review</h4>
                <p className="text-slate-400 text-sm">Case study & results screening</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="text-2xl mb-2">🔧</div>
                <h4 className="text-white font-medium mb-1">Technical Assessment</h4>
                <p className="text-slate-400 text-sm">For performance roles</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <div className="text-2xl mb-2">📊</div>
                <h4 className="text-white font-medium mb-1">Salary Benchmarking</h4>
                <p className="text-slate-400 text-sm">Current market data</p>
              </div>
            </div>
          </div>
        </section>

        {/* Roles We Recruit */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-10">Digital Marketing Recruitment Agency Services</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold text-pink-400 mb-4">Performance & Growth</h3>
                <ul className="space-y-2">
                  {performanceRoles.map((role) => (
                    <li key={role} className="text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
                      {role}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-orange-400 mb-4">Brand & Creative</h3>
                <ul className="space-y-2">
                  {brandRoles.map((role) => (
                    <li key={role} className="text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-orange-400 rounded-full" />
                      {role}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-400 mb-4">Leadership</h3>
                <ul className="space-y-2">
                  {leadershipRoles.map((role) => (
                    <li key={role} className="text-slate-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                      {role}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Sectors */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-10">Digital Marketing Recruitment Agency Expertise</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sectors.map((sector) => (
                <div key={sector.name} className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 hover:border-pink-500/50 transition-all">
                  <h3 className="text-white font-bold mb-2">{sector.name}</h3>
                  <p className="text-slate-400 text-sm">{sector.description}</p>
                </div>
              ))}
            </div>
            <p className="text-slate-400 mt-8 max-w-3xl">
              For membership and subscription businesses requiring specialist marketing talent, we also recommend <a href="https://membership.quest" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">membership marketing</a> expertise — particularly for acquisition, retention, and lifecycle marketing roles.
            </p>
          </div>
        </section>

        {/* Startup & Agency Expertise */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
                <h3 className="text-2xl font-bold text-white mb-4">Digital Marketing Recruitment Agency for Startups</h3>
                <p className="text-slate-300">
                  Early-stage hiring is different. You need marketers who can build from zero — set up attribution,
                  launch channels, and iterate fast. We recruit from the startup ecosystem: candidates who&apos;ve
                  scaled spend from £10k to £1m/month and know how to operate without a playbook. For startups also refining their <a href="https://gtm.quest" target="_blank" rel="noopener noreferrer" className="text-pink-400 hover:underline">go-to-market strategy</a>, aligning hiring with GTM execution is critical.
                </p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700">
                <h3 className="text-2xl font-bold text-white mb-4">Digital Marketing Recruitment Agency for Agencies</h3>
                <p className="text-slate-300">
                  Agency recruitment moves fast. We place across creative, performance, and integrated agencies —
                  from Account Directors to Paid Media specialists. Our network includes agency-side marketers
                  ready for their next move.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* London Section */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-6">Digital Marketing Recruitment Agency London</h2>
            <p className="text-slate-300 mb-8 max-w-3xl">
              As a London-based <strong>digital marketing recruitment agency</strong>, we&apos;re embedded in
              the UK&apos;s marketing hub. From Soho creative agencies to Shoreditch scale-ups, we recruit
              across the city&apos;s marketing ecosystem.
            </p>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h4 className="text-white font-medium mb-1">Soho & West End</h4>
                <p className="text-slate-400 text-sm">Creative agencies, brand roles</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h4 className="text-white font-medium mb-1">Shoreditch & Old Street</h4>
                <p className="text-slate-400 text-sm">Startups, growth roles</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h4 className="text-white font-medium mb-1">King&apos;s Cross</h4>
                <p className="text-slate-400 text-sm">Tech scale-ups</p>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h4 className="text-white font-medium mb-1">Farringdon & Clerkenwell</h4>
                <p className="text-slate-400 text-sm">B2B, SaaS</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQ faqs={faqs} accentColor="pink" />

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-pink-600/20 via-slate-900 to-orange-500/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Partner With a Boutique Digital Marketing Recruitment Agency</h2>
            <p className="text-slate-300 mb-8">
              Ready to hire exceptional marketing talent? As a boutique digital marketing recruitment agency,
              we focus on quality placements that drive growth — not volume metrics.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="px-8 py-4 bg-gradient-to-r from-pink-600 to-orange-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all">
                Hire Marketing Talent
              </Link>
              <Link href="/contact" className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-xl border border-slate-700 hover:border-pink-500 transition-all">
                View Marketing Jobs
              </Link>
            </div>
          </div>
        </section>

        {/* Related Pages */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-8">Explore Related Services</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {relatedPages.map((page) => (
                <Link key={page.href} href={page.href} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-pink-500/50 transition-all">
                  <h3 className="font-semibold text-white mb-2">{page.title}</h3>
                  <p className="text-slate-400 text-sm">{page.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
