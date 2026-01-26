import type { Metadata } from "next";
import Link from "next/link";
import { getAllPublishedArticles } from "@/lib/db";
import { FAQ } from "@/components/FAQ";

export const metadata: Metadata = {
  title: "Venture Capital Recruitment Agency 🎯 UK VC Jobs & Headhunters",
  description:
    "Venture capital recruitment agency 🚀 Specialist VC headhunters placing Partners, Principals & Associates at top funds. London & UK-wide. Free for candidates.",
  keywords: [
    "venture capital recruitment agency",
    "vc recruitment agency",
    "venture capital headhunters",
    "vc jobs uk",
    "venture capital jobs london",
    "vc recruitment",
  ],
  openGraph: {
    title: "Venture Capital Recruitment Agency 🎯 UK VC Jobs & Headhunters",
    description:
      "Venture capital recruitment agency 🚀 Specialist VC headhunters placing talent at top funds. London & UK-wide.",
    type: "website",
    url: "https://rainmakrr.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "Venture Capital Recruitment Agency 🎯 UK VC Jobs & Headhunters",
    description:
      "Venture capital recruitment agency 🚀 Specialist VC headhunters placing talent at top funds.",
  },
  alternates: {
    canonical: "https://rainmakrr.com",
  },
};

// Schema data for SEO
const homepageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://rainmakrr.com/#website",
      url: "https://rainmakrr.com",
      name: "Venture Capital Recruitment Agency Rainmakrr",
      alternateName: ["Rainmakrr", "Rainmakrr VC Recruitment"],
      description: "Venture capital recruitment agency placing VC talent at top funds across London and the UK.",
      publisher: { "@id": "https://rainmakrr.com/#organization" },
    },
    {
      "@type": "Organization",
      "@id": "https://rainmakrr.com/#organization",
      name: "Venture Capital Recruitment Agency Rainmakrr",
      alternateName: ["Rainmakrr", "Rainmakrr VC Recruitment"],
      url: "https://rainmakrr.com",
      description: "UK-based venture capital recruitment agency specialising in VC fund placements from Analysts to Partners.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "London",
        addressCountry: "GB",
      },
      areaServed: [{ "@type": "Country", name: "United Kingdom" }],
    },
    {
      "@type": "EmploymentAgency",
      "@id": "https://rainmakrr.com/#agency",
      name: "Rainmakrr - Venture Capital Recruitment Agency",
      description: "Specialist venture capital recruitment agency placing talent at top VC funds across Europe.",
      url: "https://rainmakrr.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "London",
        addressCountry: "GB",
      },
      priceRange: "Free for candidates",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is a venture capital recruitment agency?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A venture capital recruitment agency specialises in placing talent at VC funds, from Analysts and Associates to Partners. They understand carry structures, fund cycles, and what makes a great investor.",
          },
        },
        {
          "@type": "Question",
          name: "How do I get a job in venture capital?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Common paths include: operating experience at successful startups, investment banking, management consulting, or relevant domain expertise. Some larger funds run formal Associate programs.",
          },
        },
        {
          "@type": "Question",
          name: "What's the salary for a VC Associate in London?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Base salaries range from £60-100k for Associates, with bonuses of 20-50%. Carry participation is increasingly common even at junior levels.",
          },
        },
      ],
    },
  ],
};

const vcRoles = [
  { title: "Analyst", type: "Investment" },
  { title: "Associate", type: "Investment" },
  { title: "Principal", type: "Investment" },
  { title: "Partner", type: "Investment" },
  { title: "Venture Partner", type: "Investment" },
  { title: "Platform/Portfolio Support", type: "Platform" },
  { title: "Talent Partner", type: "Platform" },
  { title: "Operating Advisors", type: "Platform" },
];

const fundStages = [
  { stage: "Pre-Seed & Seed", description: "First institutional capital" },
  { stage: "Series A", description: "Product-market fit funding" },
  { stage: "Series B", description: "Scale-up capital" },
  { stage: "Growth Stage", description: "Expansion funding" },
  { stage: "Late Stage/Pre-IPO", description: "Pre-exit rounds" },
  { stage: "Crossover Funds", description: "Public-private investors" },
];

const sectorFocus = [
  { name: "Deep Tech & AI", icon: "🤖" },
  { name: "Fintech & Payments", icon: "💳" },
  { name: "Climate Tech", icon: "🌍" },
  { name: "Healthcare & Biotech", icon: "🧬" },
  { name: "Consumer & D2C", icon: "🛒" },
  { name: "Enterprise SaaS", icon: "☁️" },
  { name: "Web3 & Crypto", icon: "🔗" },
  { name: "Spacetech", icon: "🚀" },
];

const faqs = [
  {
    question: "What is a venture capital recruitment agency?",
    answer:
      "A venture capital recruitment agency specialises in placing talent at VC funds. We understand carry structures, fund cycles, portfolio dynamics, and what separates a good investor from a great one. Unlike generalist recruiters, we have deep networks in the VC ecosystem.",
  },
  {
    question: "How do I get a job in venture capital?",
    answer:
      "Common paths include: operating experience at successful startups, investment banking, management consulting, or relevant domain expertise (e.g., engineering for deep tech funds). Some larger funds run formal Associate programs.",
  },
  {
    question: "Do I need an MBA for VC?",
    answer:
      "Less common than PE. Many VCs value operating experience, technical backgrounds, or entrepreneurial track records over MBAs. That said, an MBA from a top school can help, especially for career switchers.",
  },
  {
    question: "What's the salary for a VC Associate in London?",
    answer:
      "Base salaries range from £60-100k for Associates, with bonuses of 20-50%. Carry participation is increasingly common even at junior levels, though typically smaller allocations than PE.",
  },
  {
    question: "What skills do VC funds look for?",
    answer:
      "Market analysis, founder assessment, financial modelling, network building, sector expertise, and increasingly technical understanding (especially for deep tech funds). Strong communication and relationship skills are essential.",
  },
];

const otherServices = [
  { href: "/private-equity-recruitment-agency", title: "Private Equity Recruitment", description: "PE fund talent specialists", color: "from-slate-400 to-yellow-500" },
  { href: "/fintech-recruitment-agency", title: "Fintech Recruitment", description: "Fintech & payments talent", color: "from-blue-500 to-cyan-400" },
  { href: "/climate-tech-recruitment-agency", title: "Climate Tech Recruitment", description: "Net zero specialists", color: "from-blue-400 to-orange-400" },
  { href: "/green-recruitment-agency", title: "Green Recruitment", description: "Environmental talent", color: "from-green-500 to-lime-400" },
  { href: "/space-recruitment-agency", title: "Space & Aerospace", description: "Satellite & NewSpace talent", color: "from-slate-400 to-purple-500" },
];

const stats = [
  { value: "500+", label: "VC Placements" },
  { value: "95%", label: "Retention Rate" },
  { value: "UK-Wide", label: "Coverage" },
  { value: "10+", label: "Years Experience" },
];

export default async function Home() {
  const articles = await getAllPublishedArticles("rainmakrr");
  const recentArticles = articles.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Schema Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />

      <main>
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-pink-500/20" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-block px-4 py-2 rounded-full border border-purple-500/50 bg-purple-500/10 text-purple-400 text-sm font-medium mb-6">
                🎯 Venture Capital Recruitment Agency UK
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Venture Capital Recruitment Agency
              </h1>

              <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                <strong>Venture capital recruitment agency</strong> placing exceptional talent at top VC funds.
                From Analysts to Partners, seed to growth stage. London & UK-wide.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
                >
                  Find VC Talent
                </Link>
                <Link
                  href="#roles"
                  className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-xl border border-slate-700 hover:border-purple-500 transition-all"
                >
                  View VC Roles
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-slate-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-6">
              Your <span className="text-purple-400">Venture Capital Recruitment Agency</span>
            </h2>
            <div className="prose prose-lg prose-invert max-w-none leading-relaxed">
              <p className="text-slate-300 mb-6">
                Working with a dedicated <strong>venture capital recruitment agency</strong> gives you access to a network that generalist recruiters simply don&apos;t have. We understand carry structures, fund cycles, and what separates a good investor from a great one.
              </p>
              <p className="text-slate-300 mb-6">
                Our <strong>venture capital recruitment agency</strong> process starts with understanding your fund&apos;s thesis, stage focus, and team dynamics. We then leverage our network of passive candidates — operators-turned-investors, ex-founders, and rising associates — to build a shortlist that fits.
              </p>
              <p className="text-slate-300 mb-6">
                For portfolio companies needing interim leadership while scaling, our partners at <a href="https://fractional.quest" target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline">fractional.quest</a> specialise in fractional executive recruitment — placing part-time CFOs, CTOs, and CMOs with high-growth startups.
              </p>
            </div>
          </div>
        </section>

        {/* VC Roles */}
        <section id="roles" className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">Venture Capital Recruitment Agency Services</h2>
            <p className="text-slate-400 mb-8 max-w-3xl">
              Our <strong className="text-slate-300">venture capital recruitment agency</strong> covers all VC roles from entry-level to Partner positions.
            </p>
            <h3 className="text-xl font-bold text-purple-400 mb-6">VC Roles We Recruit</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {vcRoles.map((role) => (
                <div key={role.title} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-purple-500/50 transition-all">
                  <h3 className="text-white font-medium">{role.title}</h3>
                  <span className="text-purple-400 text-sm">{role.type}</span>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold text-purple-400 mb-6">Fund Stages We Cover</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {fundStages.map((fund) => (
                <div key={fund.stage} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 transition-all">
                  <h3 className="text-lg font-bold text-white mb-2">{fund.stage}</h3>
                  <p className="text-slate-400 text-sm">{fund.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sector Focus */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">Venture Capital Recruitment Agency Expertise</h2>
            <p className="text-slate-400 mb-8 max-w-3xl">
              Our <strong className="text-slate-300">venture capital recruitment agency</strong> has sector expertise across the investment landscape.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sectorFocus.map((sector) => (
                <div key={sector.name} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-pink-500/50 transition-all text-center">
                  <div className="text-3xl mb-2">{sector.icon}</div>
                  <h3 className="text-white font-medium text-sm">{sector.name}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VC vs PE Comparison */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">Venture Capital Recruitment Agency: VC vs PE</h2>
            <p className="text-slate-400 mb-8 max-w-3xl">
              Understanding the difference helps our <strong className="text-slate-300">venture capital recruitment agency</strong> place the right candidates.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-4 px-4 text-slate-400 font-medium">Factor</th>
                    <th className="text-left py-4 px-4 text-purple-400 font-medium">Venture Capital</th>
                    <th className="text-left py-4 px-4 text-yellow-400 font-medium">Private Equity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-800">
                    <td className="py-4 px-4 text-slate-300">Stage</td>
                    <td className="py-4 px-4 text-white">Early/Growth</td>
                    <td className="py-4 px-4 text-white">Mature</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-4 px-4 text-slate-300">Deal Size</td>
                    <td className="py-4 px-4 text-white">£1m - £50m</td>
                    <td className="py-4 px-4 text-white">£50m - £10bn+</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-4 px-4 text-slate-300">Control</td>
                    <td className="py-4 px-4 text-white">Minority</td>
                    <td className="py-4 px-4 text-white">Majority/Control</td>
                  </tr>
                  <tr className="border-b border-slate-800">
                    <td className="py-4 px-4 text-slate-300">Key Skills</td>
                    <td className="py-4 px-4 text-white">Market sensing, founder assessment</td>
                    <td className="py-4 px-4 text-white">Financial engineering, operations</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <FAQ faqs={faqs} accentColor="purple" />

        {/* Other Services */}
        <section className="py-16 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-4">More Recruitment Services</h2>
            <p className="text-slate-400 mb-8">
              Beyond our <strong className="text-slate-300">venture capital recruitment agency</strong>, we also specialise in:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherServices.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className="group bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 transition-all"
                >
                  <div className={`w-12 h-1 bg-gradient-to-r ${service.color} rounded mb-4 group-hover:w-20 transition-all`} />
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-400">{service.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Insights */}
        {recentArticles.length > 0 && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">Venture Capital Insights</h2>
                <Link href="/insights" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  View All →
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {recentArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/${article.slug}`}
                    className="group bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 transition-all"
                  >
                    {article.category && (
                      <span className="text-xs text-purple-400 uppercase tracking-wide">
                        {article.category}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-white mt-2 mb-3 group-hover:text-purple-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-slate-400 text-sm line-clamp-2">{article.excerpt}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-20 bg-gradient-to-r from-purple-600/20 via-slate-900 to-pink-500/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Partner With a Specialist Venture Capital Recruitment Agency
            </h2>
            <p className="text-slate-300 mb-8">
              From seed-stage analysts to growth partners, our <strong>venture capital recruitment agency</strong> connects VC funds with exceptional talent.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                Hire VC Talent
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-slate-800 text-white font-semibold rounded-xl border border-slate-700 hover:border-purple-500 transition-all"
              >
                Explore VC Careers
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
