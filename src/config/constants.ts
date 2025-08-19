import {
  Award,
  BookOpen,
  ChartLine,
  FileText,
  HandHeart,
  Presentation,
  Users2,
} from "lucide-react";

import { AuthUser } from "@/auth";
import { Icons } from "@/components/shared/icons";
import {
  CreateFrameworkPayload,
  CreateMethodologyPayload,
} from "@/lib/validations/research";
import type {
  AppNavItem,
  NavItem,
  Role,
  SocialItem,
  UserNavItem,
} from "@/types";

export const appName = "SSRG";
export const appFullName = "Dibịa Akwụkwọ: Social Solutions Research Group";
export const links = {
  x: "https://x.com/ssrg",
  facebook: "https://facebook.com/ssrg",
  gitHub: "https://github.com/ssrg",
  discord: "https://discord.com/users/ssrg",
  linkedIn: "https://linkedin.com/company/ssrg",
} as const;

export const PASSWORD_KEY_LENGTH = 64;
export const PIN_KEY_LENGTH = 32;
export const DEFAULT_PAGE_SIZE = 12;

export const CACHED_RESEARCH_AREAS = "cached-research-areas";
export const CACHED_RESEARCHERS = "cached-researchers";
export const CACHED_FORMATTED_RESEARCHERS = "cached-formatted-researchers";

export const CACHED_RESEARCHER = "cached-researcher";
export const CACHED_FORMATTED_RESEARCHER = "cached-formatted-researcher";

export const CACHED_RESEARCH_FRAMEWORKS = "cached-research-frameworks";
export const CACHED_RESEARCH_METHODOLOGIES = "cached-research-methodologies";
export const CACHED_PROJECTS = "cached-projects";

export const CACHED_PUBLICATIONS = "cached-publications";
export const CACHED_VIDEOS = "cached-videos";

export const DOI_REGEX = /^10\.[0-9]{4,}(\.[0-9]+)*\/[-._;()/:A-Z0-9]+$/i;
export const ORCID_REGEX = /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]$/;

export const TYPE_CONFIG = {
  journal_article: {
    icon: FileText,
    color: "text-indigo-600",
    bgColor: "bg-indigo-600/15",
  },
  conference_paper: {
    icon: Presentation,
    color: "text-emerald-600",
    bgColor: "bg-emerald-600/15",
  },
  book_chapter: {
    icon: BookOpen,
    color: "text-purple-600",
    bgColor: "bg-purple-600/15",
  },
  report: {
    icon: Award,
    color: "text-orange-600",
    bgColor: "bg-orange-600/15",
  },
} as const;

export const CHART_COLOR_PALETTES = {
  default: [
    "oklch(0.646 0.222 41.116)", // chart-1
    "oklch(0.6 0.118 184.704)", // chart-2
    "oklch(0.398 0.07 227.392)", // chart-3
    "oklch(0.828 0.189 84.429)", // chart-4
    "oklch(0.769 0.188 70.08)", // chart-5
  ],
  vibrant: [
    "oklch(0.65 0.25 0)", // Red
    "oklch(0.7 0.2 120)", // Green
    "oklch(0.6 0.2 240)", // Blue
    "oklch(0.75 0.2 60)", // Yellow
    "oklch(0.65 0.2 300)", // Purple
    "oklch(0.7 0.2 180)", // Cyan
    "oklch(0.7 0.25 30)", // Orange
    "oklch(0.6 0.2 270)", // Violet
  ],
  muted: [
    "oklch(0.5 0.1 0)", // Muted red
    "oklch(0.6 0.08 120)", // Muted green
    "oklch(0.45 0.08 240)", // Muted blue
    "oklch(0.65 0.1 60)", // Muted yellow
    "oklch(0.5 0.1 300)", // Muted purple
    "oklch(0.55 0.08 180)", // Muted cyan
    "oklch(0.6 0.12 30)", // Muted orange
    "oklch(0.45 0.08 270)", // Muted violet
  ],
};

export const keywords = [
  appFullName,
  appName,
  "social research",
  "policy solutions",
  "community development",
  "applied research",
];
export const authors = [
  {
    name: "ejimkaraonyec",
    url: "https://ejimkaraonyec.vercel.app",
  },
];
export const creator = "ejimkaraonyec";

export const user: AuthUser = {
  role: "admin",
  email: "admin@ssrg.org", // Using .org for research groups is more conventional
  id: "kekjkwbuhwkjelwke",
  name: "Richmond Davis",
  image: null,
};
export const appNav: AppNavItem[] = [
  {
    title: "Dashboard",
    href: "/portal",
    description: "Comprehensive overview of research projects and key metrics",
    roles: ["admin", "researcher"],
    icon: "dashboard",
    items: [],
  },
  {
    title: "Publications",
    href: "/portal/publications",
    description: "Research papers, reports, and findings",
    roles: ["admin", "researcher"],
    icon: "publications",
    items: [],
  },
  {
    title: "Videos",
    href: "/portal/videos",
    description: "YouTube videos",
    roles: ["admin", "researcher"],
    icon: "video",
    items: [],
  },
  {
    title: "Research Projects",
    href: "/portal/projects",
    description: "Create, manage, and track research projects",
    roles: ["admin", "researcher"],
    icon: "research",
    disabled: true,
    items: [],
    // This page would have researcher-facing actions like:
    // - Create New Project
    // - Add Team Members
    // - Set Milestones
    // - Track Progress
    // - Manage Budgets (if researcher is project lead)
  },
  {
    title: "My Teams",
    href: "/portal/teams",
    description: "Projects you're leading or participating in",
    roles: ["admin", "researcher"],
    icon: "people",
    disabled: true, // New addition
    items: [],
    // This page would show:
    // - Projects I'm leading
    // - Projects I'm a member of
    // - Team collaboration tools
    // - Communication features
  },
  {
    title: "Data Repository",
    href: "/portal/data",
    description: "Access research datasets and resources",
    roles: ["admin", "researcher"],
    icon: "database",
    disabled: true,
    items: [],
  },
];

export const auth = {
  title: `Research Portal Access`,
  description: "Sign in to access research tools and resources",
  signin: {
    title: `Sign In`,
    description: "Access your research account",
    href: "/auth/sign-in",
  },
  signup: {
    title: `Sign Up`,
    description: "Register an account to be part of the community",
    href: "/careers/sign-up",
  },
  signout: {
    title: "Sign Out",
    description: "Secure logout from the research portal",
    href: "/auth/sign-out",
  },
  reset: {
    title: "Password Reset",
    description: "Recover your research account access",
    href: "/auth/reset-password",
  },
  newPassword: {
    title: "Create New Password",
    description: "Set a new secure password",
    href: "/auth/new-password",
  },
  verification: {
    title: "Account Verification",
    description: "Verify your researcher credentials",
    href: "/auth/verification",
  },
  onboarding: {
    title: `Researcher Onboarding`,
    description: "Configure your research profile and preferences",
    href: "/onboarding",
  },
  admin: {
    title: `Admin Portal`,
    description: "Research administration dashboard",
    href: "/admin",
  },
  error: {
    title: `Authentication Error`,
    description: "Unable to process your request",
    href: "/auth/error",
  },
};

export const userNav: Record<string, Omit<UserNavItem, "cmd">> = {
  a: {
    title: "Admin Portal",
    href: "/admin",
    icon: "admin",
    roles: ["admin"],
  },
  d: {
    title: "Research Portal",
    href: "/portal",
    icon: "dashboard",
    roles: ["researcher", "admin", "affiliate"],
  },
  p: {
    title: "Profile & Settings",
    href: "/portal/profile",
    icon: "user",
    roles: ["researcher", "admin", "member", "affiliate", "partner"],
  },
  q: {
    title: auth.signout.title,
    href: auth.signout.href,
    icon: "signout",
    roles: ["researcher", "admin", "member", "affiliate", "partner"],
  },
};

export const mainNav: NavItem[] = [
  {
    title: "Research",
    href: "/research",
    icon: "research",
    description: "Explore our research focus areas and methodologies",
    items: [
      {
        title: "Research Areas",
        href: "/research/areas",
        description: "Our primary fields of study and expertise",
        icon: "focusAreas",
        items: [],
      },
      {
        title: "Projects",
        href: "/research/projects",
        description: "Current and completed research initiatives",
        icon: "projects",
        items: [],
      },
      {
        title: "Impact",
        href: "/research/impact",
        description: "How our research creates social change",
        icon: "impact",
        items: [],
      },
    ],
  },
  {
    title: "Publications & Media",
    href: "/publications",
    icon: "publications",
    description: "Access our research outputs and media content",
    items: [
      {
        title: "Academic Publications",
        href: "/publications/academics",
        description: "Journal articles, books, and reports",
        icon: "graduationCap",
        items: [],
      },
      {
        title: "Conferences",
        href: "/publications/conferences",
        description: "Conference presentations and proceedings",
        icon: "conference",
        items: [],
      },
      {
        title: "Video Content",
        href: "/publications/videos",
        description: "Lectures, interviews, and research explanations",
        icon: "video",
        items: [],
      },
    ],
  },
  {
    title: "People",
    href: "/people",
    icon: "people",
    description: "Our team, partners, and community",
    items: [
      {
        title: "Research Team",
        href: "/people/team",
        description: "Meet our researchers and staff",
        icon: "team",
        items: [],
      },
      {
        title: "Members",
        href: "/people/members",
        description: "Affiliated researchers and practitioners",
        icon: "user",
        items: [],
      },
      {
        title: "Partners",
        href: "/people/partners",
        description: "Organizations we collaborate with",
        icon: "partners",
        items: [],
      },
    ],
  },
  {
    title: "Engagement",
    href: "/engagement",
    icon: "engagement",
    description: "Ways to get involved with our work",
    items: [
      {
        title: "Collaboration",
        href: "/engagement/collaborate",
        description: "Research partnerships and joint initiatives",
        icon: "collaborate",
        items: [],
      },
      {
        title: "Community Activities",
        href: "/engagement/community",
        description: "Events and initiatives for the public",
        icon: "community",
        items: [],
      },
      {
        title: "Scholarships & Awards",
        href: "/engagement/scholarships",
        description: "Opportunities for students and researchers",
        icon: "award",
        items: [],
      },
      {
        title: "Funding",
        href: "/engagement/funding",
        description: "Support our research initiatives",
        icon: "funding",
        items: [],
      },
    ],
  },
  // {
  //   title: "R Areas",
  //   href: "/areas",
  //   icon: "research",
  //   description: "Explore our focus areas and methodologies",
  //   items: [],
  // },
];

export const footerNav: NavItem[] = [
  {
    title: "About SSRG",
    description: "Learn about our mission and research approach",
    href: "/about",
    icon: "info",
    items: [
      {
        title: "Our Mission",
        href: "/about/mission",
        description:
          "Our research philosophy, long-term goals, and the societal problems our organization aims to address through academic research.",
        icon: "mission",
        items: [],
      },
      {
        title: "Research Ethics",
        href: "/about/ethics",
        description:
          "Our ethical framework, IRB approval processes, participant rights protection guidelines, and research integrity standards.",
        icon: "ethics",
        items: [],
      },
      {
        title: "Researcher Portal",
        href: "/portal",
        description:
          "Secure access point for researchers to manage projects, publications, and collaboration activities.",
        icon: "logo",
        items: [],
      },
      // {
      //   title: "Careers",
      //   href: "/careers",
      //   description:
      //     "Job openings, research positions, fellowship opportunities, and information about working with our research group.",
      //   icon: "briefcase",
      //   items: [],
      // },
      // {
      //   title: "Partners",
      //   href: "/about/partners",
      //   description:
      //     "Current academic institutions, government agencies, and NGOs we collaborate with, including partnership history and joint projects.",
      //   icon: "partners",
      //   items: [],
      // },
    ],
  },
  {
    title: "Research Resources",
    description: "Tools and materials for researchers",
    href: "/resources",
    icon: "resources",
    items: [
      {
        title: "Methodologies",
        href: "/resources/methods",
        description: "Our research frameworks and approaches",
        icon: "methods",
        items: [],
      },
      {
        title: "Data Tools",
        href: "/resources/tools",
        description: "Software and analysis tools we use",
        icon: "dataTools",
        items: [],
      },
      {
        title: "Field Guides",
        href: "/resources/guides",
        description: "Practical research implementation guides",
        icon: "guides",
        items: [],
      },
    ],
  },
  {
    title: "Policy & Compliance",
    description: "Legal and regulatory information",
    href: "/policy",
    icon: "policy",
    items: [
      {
        title: "Terms of Use",
        href: "/policy/terms",
        description:
          "Legal terms governing the use of SSRG resources, website, and research portal, including intellectual property rights and permitted usage.",
        icon: "reports",
        items: [],
      },
      {
        title: "Privacy Policy",
        href: "/policy/privacy",
        description:
          "Details on how we collect, store, process, and protect personal information and research data, including GDPR compliance information.",
        icon: "privacy",
        items: [],
      },
      {
        title: "Data Protection",
        href: "/policy/data-protection",
        description:
          "Our data management standards, security protocols, data retention policies, and procedures for handling sensitive research information.",
        icon: "database",
        items: [],
      },
    ],
  },
  {
    title: "Connect With Us",
    description: "Collaborate or stay updated",
    href: "/connect",
    icon: "connect",
    items: [
      {
        title: "Contact Us",
        href: "/connect/contact",
        description:
          "Direct contact information for research departments, media inquiries, and general questions, including a contact form for research collaboration proposals.",
        icon: "user",
        items: [],
      },
      {
        title: "Newsletter",
        href: "/connect/newsletter",
        description:
          "Sign up form for our monthly research newsletter featuring recent findings, upcoming projects, and opportunities for participation in studies.",
        icon: "newsletter",
        items: [],
      },
      {
        title: "Participate",
        href: "/connect/participate",
        description:
          "Information about current and upcoming research studies seeking participants, including eligibility criteria and participation benefits.",
        icon: "megaphone",
        items: [],
      },
    ],
  },
];

// export const barActions = [
//   { value: "area", label: "Create Research Area" },
//   { value: "framework", label: "Create Research Framework" },
//   { value: "methodology", label: "Create Research Methodology" },
//   { value: "project", label: "Create Project" },
//   { value: "publication", label: "Create Publication" },
// ];
export const actions = {
  title: "Administration",
  href: "/admin",
  roles: ["admin"] as Role[],
  icon: "admin" as Icons,
  items: [
    {
      title: "Core Features",
      href: "/admin/core",
      roles: ["admin"] as Role[],
      icon: "research" as Icons,
      options: {
        area: "Create Research Area",
        framework: "Create Research Framework",
        methodology: "Create Research Methodology",
        // project: "Create Project",
      },
    },
    {
      title: "User Management",
      href: "/admin/users",
      roles: ["admin"] as Role[],
      icon: "user" as Icons,
      options: {
        user: "Create User",
        researcher: "Create Researcher",
      },
    },
    {
      title: "Project Teams",
      href: "/admin/teams",
      roles: ["admin"] as Role[],
      icon: "people" as Icons,
      options: {
        audit: "Audit Team Activities",
        policy: "Set Team Policies",
        archive: "Archive Completed Projects",
        export: "Export Team Data",
      },
    },
    {
      title: "System Settings",
      href: "/admin/settings",
      roles: ["admin"] as Role[],
      icon: "settings" as Icons,
      options: {
        event: "Add Events or Webinars",
        newsletter: "Manage Newsletter Subscribers",
      },
    },
  ],
};

export const navSecondary: Required<SocialItem>[] = [
  {
    title: "Research Inquiries",
    href: "mailto:research@ssrg.org",
    icon: "email",
    external: true,
  },
  {
    title: "LinkedIn",
    href: links.linkedIn,
    icon: "linkedin",
    external: true,
  },
  {
    title: "X (Twitter)",
    href: links.x,
    icon: "x",
    external: true,
  },
];

// Sample methodologies for quick start
export const sampleMethodologies: CreateMethodologyPayload[] = [
  {
    title: "Participatory Action Research (PAR)",
    description:
      "A collaborative approach that involves stakeholders as co-researchers, emphasizing immediate application of findings to create social change while building local capacity.",
    order: 1,
  },
  {
    title: "Community-Based Participatory Research (CBPR)",
    description:
      "Research conducted in partnership with communities, ensuring studies address community-identified problems and priorities through collaborative decision-making.",
    order: 2,
  },
  {
    title: "Mixed-Methods Sequential Explanatory Design",
    description:
      "Combines quantitative data collection followed by qualitative research to provide comprehensive understanding of complex social phenomena.",
    order: 3,
  },
  {
    title: "Ethnographic Field Studies",
    description:
      "In-depth qualitative research involving prolonged engagement with communities to understand cultural contexts and lived experiences.",
    order: 4,
  },
  {
    title: "Longitudinal Cohort Studies",
    description:
      "Research design that follows the same group of participants over extended periods to track changes and measure long-term social impact.",
    order: 5,
  },
  {
    title: "Digital Ethnography",
    description:
      "Contemporary research method analyzing online communities and digital interactions to understand modern social phenomena and communication patterns.",
    order: 6,
  },
];

export const sampleFrameworks: CreateFrameworkPayload[] = [
  {
    title: "Theory of Change Framework",
    description:
      "A comprehensive planning tool that explains how activities are understood to produce outcomes...",
    order: 0,
    href: "https://www.theoryofchange.org/what-is-theory-of-change/",
    linkText: "Learn About Theory of Change",
  },
  {
    title: "Logic Model Framework",
    description:
      "A systematic visual representation of the logical relationships between resources, activities, outputs, and outcomes...",
    order: 1,
    href: "https://www.cdc.gov/evaluation/logicmodels/index.htm",
    linkText: "CDC Logic Model Guide",
  },
];

export const research_areas = [
  {
    title: "Community Development",
    icon: Users2,
    image: "/images/research/communities.webp",
    description:
      "Investigating models of community-led development and governance to strengthen social cohesion and resilience.",
    detail:
      "Our community development research investigates models of community-led development and governance to strengthen social cohesion and resilience. We examine how communities can be empowered to drive their own development processes and create sustainable solutions to local challenges.",
    sub: "Communities are often best positioned to identify their needs and develop contextually appropriate solutions. Our research explores how to effectively support community agency while addressing structural barriers. Through collaborative methodologies, we document successful approaches to community empowerment that can be adapted and scaled across different contexts.",
    questions: [
      "How can participatory governance models improve community outcomes?",
      "What factors contribute to sustainable community-led initiatives?",
      "How can technology enhance community engagement and decision-making?",
      "What approaches best support asset-based community development?",
    ],
    methods: [
      {
        title: "Participatory Action Research",
        description:
          "We engage community members as co-researchers throughout the research process, ensuring studies address community-identified priorities and build local research capacity.",
      },
      {
        title: "Social Network Analysis",
        description:
          "We map relationships between community stakeholders to understand information flows, resource distribution, and power dynamics that affect community development outcomes.",
      },
      {
        title: "Mixed-Methods Evaluation",
        description:
          "We combine quantitative metrics with qualitative insights to assess community development initiatives, focusing on both process outcomes and impact measures.",
      },
    ],
    findings: [
      "Community-led initiatives show greater sustainability when they include robust local governance structures and transparent decision-making processes",
      "Digital tools can significantly enhance participation in community planning, particularly among traditionally underrepresented groups",
      "Effective community development requires addressing both social capital development and structural barriers to resource access",
    ],
    publications: [
      {
        title:
          "Digital Tools for Participatory Urban Governance: Case Studies from Three Metropolitan Areas",
        authors: "Rodriguez, J. & Chen, E.",
        journal: "Journal of Community Development",
        year: "2024",
        volume: "42(3)",
        pages: "215-238",
        link: "/publications/academics/participatory-urban-governance",
      },
      {
        title:
          "Building Resilient Communities: A Framework for Asset-Based Development in Post-Industrial Cities",
        authors: "Adisa, K., Williams, M., & Rodriguez, J.",
        journal: "Community Resilience Quarterly",
        year: "2023",
        volume: "18(2)",
        pages: "87-106",
        link: "/publications/academics/resilient-communities-framework",
      },
      {
        title:
          "Community Knowledge Systems: Valuing Local Expertise in Development Practice",
        authors: "Chen, E. & Rodriguez, J.",
        journal: "International Journal of Knowledge Management",
        year: "2022",
        volume: "15(4)",
        pages: "342-361",
        link: "/publications/academics/community-knowledge-systems",
      },
    ],
    href: "/research/areas/community-development",
    linkText: "Explore Community Development Research",
  },
  {
    title: "Social Policy Analysis",
    icon: ChartLine,
    image: "/images/research/collaborating.webp",
    description:
      "Evaluating the effectiveness and impact of policy interventions on vulnerable populations and marginalized communities.",
    detail:
      "Our policy research evaluates the effectiveness and impact of policy communities. We develop evidence-based policy recommendations that can drive systemic change and improve outcomes for those most affected by social challenges.",
    sub: "Using rigorous mixed-methods approaches, we analyze how policies are designed, implemented, and experienced by different population groups. Our work pays particular attention to unintended consequences and implementation gaps that can undermine policy effectiveness. By centering the lived experiences of policy-affected communities, we generate insights that can lead to more equitable and effective social policies.",
    questions: [
      "How do social policies affect different population groups?",
      "What implementation factors influence policy effectiveness?",
      "How can we better measure policy outcomes and impacts?",
      "What policy approaches are most effective for addressing systemic inequities?",
    ],
    methods: [
      {
        title: "Policy Impact Assessment",
        description:
          "We use quasi-experimental designs to evaluate the causal effects of policy interventions across different demographic groups and geographic contexts.",
      },
      {
        title: "Implementation Science",
        description:
          "We examine the processes by which policies are translated into practice, identifying facilitators and barriers to effective implementation.",
      },
      {
        title: "Narrative Policy Analysis",
        description:
          "We analyze the stories, assumptions, and frameworks that shape policy development and how these narratives influence policy outcomes.",
      },
    ],
    findings: [
      "Housing stability programs show the greatest impact when combining subsidy approaches with tenant protection policies",
      "Policy implementation effectiveness varies significantly based on local administrative capacity and community engagement",
      "Cross-sector policy coordination produces more sustainable outcomes than siloed interventions",
    ],
    publications: [
      {
        title:
          "Housing First Policy Implementation: Administrative Barriers and Success Factors",
        authors: "Adisa, K., Chen, E., & Williams, M.",
        journal: "Journal of Housing Policy",
        year: "2024",
        volume: "37(2)",
        pages: "118-142",
        link: "/publications/academics/housing-first-implementation",
      },
      {
        title:
          "Cross-Sectoral Policy Coordination: A Framework for Integrated Social Services",
        authors: "Rodriguez, J. & Adisa, K.",
        journal: "Policy Studies Journal",
        year: "2023",
        volume: "51(3)",
        pages: "289-312",
        link: "/publications/academics/cross-sectoral-policy",
      },
      {
        title:
          "Measuring What Matters: Community-Defined Metrics for Equitable Policy Evaluation",
        authors: "Chen, E. & Williams, M.",
        journal: "Public Administration Review",
        year: "2022",
        volume: "82(1)",
        pages: "75-94",
        link: "/publications/academics/community-defined-metrics",
      },
    ],
    href: "/research/areas/policy-analysis",
    linkText: "Explore Policy Research",
  },
  {
    title: "Equity & Inclusion",
    icon: HandHeart,
    image: "/images/research/communities.webp",
    description:
      "Researching barriers to equality and developing evidence-based frameworks for inclusive social systems.",
    detail:
      "Our equity and inclusion research examines barriers to equality and develops evidence-based frameworks for building inclusive social systems. We focus on understanding how intersecting factors like race, gender, class, and ability shape experiences and outcomes, and how to create more equitable structures.",
    sub: "This research area applies an intersectional lens to examine how multiple forms of advantage and disadvantage interact to shape opportunities and outcomes. We work collaboratively with marginalized communities to document exclusionary practices and develop strategies for meaningful inclusion. Our goal is to translate equity-focused research into actionable frameworks that organizations and systems can implement.",
    questions: [
      "How do multiple forms of marginalization intersect to affect outcomes?",
      "What frameworks best promote equity in organizational structures?",
      "How can communities center marginalized voices in decision-making?",
      "What measurement approaches best capture equity impacts?",
    ],
    methods: [
      {
        title: "Intersectional Analysis",
        description:
          "We use quantitative and qualitative approaches that examine how multiple social identities interact to shape experiences of privilege and oppression.",
      },
      {
        title: "Community-Based Participatory Research",
        description:
          "We partner with marginalized communities throughout the research process to ensure our work reflects their priorities and knowledge.",
      },
      {
        title: "Institutional Ethnography",
        description:
          "We examine how organizational practices, policies, and cultures reproduce or challenge systemic inequities.",
      },
    ],
    findings: [
      "Organizations implementing equity frameworks without addressing power structures show limited improvements in inclusion outcomes",
      "Community-centered decision-making processes produce more equitable resource allocation when they include specific mechanisms for power-sharing",
      "Measuring equity requires both quantitative indicators and qualitative narratives that capture lived experiences",
    ],
    publications: [
      {
        title:
          "Beyond Representation: Power-Sharing Mechanisms for Authentic Inclusion",
        authors: "Chen, E., Rodriguez, J., & Adisa, K.",
        journal: "Journal of Diversity Studies",
        year: "2024",
        volume: "29(4)",
        pages: "217-236",
        link: "/publications/academics/power-sharing-mechanisms",
      },
      {
        title:
          "Measuring Equity: A Mixed-Methods Framework for Organizational Assessment",
        authors: "Williams, M. & Chen, E.",
        journal: "Nonprofit Management and Leadership",
        year: "2023",
        volume: "33(2)",
        pages: "156-175",
        link: "/publications/academics/measuring-equity-framework",
      },
      {
        title:
          "Intersectional Approaches to Educational Equity: Moving Beyond Single-Axis Interventions",
        authors: "Adisa, K. & Rodriguez, J.",
        journal: "American Educational Research Journal",
        year: "2022",
        volume: "59(3)",
        pages: "482-504",
        link: "/publications/academics/intersectional-educational-equity",
      },
    ],
    href: "/research/areas/equity-inclusion",
    linkText: "Explore Equity Research",
  },
];

export const research_methodologies = [
  {
    title: "Community-Centered",
    description:
      "Research questions developed in partnership with communities affected by the issues we study.",
  },
  {
    title: "Multi-Method",
    description:
      "Combining qualitative and quantitative approaches to develop holistic understanding.",
  },
  {
    title: "Solution-Focused",
    description:
      "Moving beyond problem identification to develop, test, and scale effective interventions.",
  },
];

export const research_framework = [
  {
    title: "Research Impact",
    description:
      "Our comprehensive approach to impact measurement ensures our research translates into meaningful social change across academic, policy, practice, social, and capacity dimensions.",
    link: {
      text: "Learn more about our impact measurement framework →",
      href: "/research/impact",
    },
  },
  {
    title: "Research Ethics",
    description:
      "We are committed to conducting research that upholds the highest ethical standards, ensuring respect for individuals, communities, and the integrity of the research process.",
    link: {
      text: "Learn more about our research ethics framework →",
      href: "/about/ethics",
    },
  },
];

export const researchers = [
  {
    id: "james-rodriguez",
    name: "Dr. James Rodriguez",
    title: "Research Director, Community Development",
    image: "/images/researcher/james.webp",
    areas: ["Community Development", "Digital Inclusion"],
    bio: "Dr. Rodriguez leads our Community Development research, focusing on participatory governance models and digital inclusion in urban communities. With over 15 years of experience in community-based research, he specializes in developing frameworks that enable communities to drive their own development processes.",
    expertise: [
      "Participatory Action Research",
      "Urban Governance",
      "Digital Inclusion",
      "Community-Led Development",
    ],
    education: [
      "Ph.D. in Urban Planning, University of California, Berkeley",
      "M.A. in Community Development, State University of New York",
      "B.A. in Sociology, University of Washington",
    ],
    publications: [
      "Digital Tools for Participatory Urban Governance (2024)",
      "Community Knowledge Systems: Valuing Local Expertise (2022)",
      "Cross-Sectoral Policy Coordination (2023)",
    ],
    projects: [
      "Participatory Governance in Urban Communities",
      "Digital Inclusion in Rural Communities",
    ],
    contact: {
      email: "rodriguez@ssrg.org",
      phone: "(140) 371-4075",
      twitter: "@DrJRodriguez",
      orcid: "0000-0002-1234-5678",
    },
    featured: true,
  },
  {
    id: "kwame-adisa",
    name: "Dr. Kwame Adisa",
    title: "Senior Researcher, Social Policy Analysis",
    image: "/images/researcher/kwame.webp",
    areas: ["Social Policy Analysis", "Community Development"],
    bio: "Dr. Adisa specializes in housing policy and community resilience research, with particular expertise in evaluating policy impacts on marginalized communities. His work bridges academic research with practical policy implementation to create more equitable outcomes.",
    expertise: [
      "Housing Policy",
      "Policy Implementation Science",
      "Community Resilience",
      "Intersectional Policy Analysis",
    ],
    education: [
      "Ph.D. in Public Policy, Harvard University",
      "M.P.P. in Social Policy, University of Michigan",
      "B.A. in Political Science, Howard University",
    ],
    publications: [
      "Housing First Policy Implementation (2024)",
      "Building Resilient Communities: A Framework (2023)",
      "Intersectional Approaches to Educational Equity (2022)",
    ],
    projects: [
      "Affordable Housing Policy Impacts",
      "Building Resilient Communities",
    ],
    contact: {
      email: "adisa@ssrg.org",
      phone: "(140) 371-4076",
      twitter: "@KwameAdisa",
      orcid: "0000-0002-3456-7890",
    },
    featured: true,
  },
  {
    id: "emily-chen",
    name: "Dr. Emily Chen",
    title: "Senior Researcher, Equity & Inclusion",
    image: "/images/researcher/emily.webp",
    areas: ["Equity & Inclusion", "Climate Justice", "STEM Education"],
    bio: "Dr. Chen leads our equity and inclusion research initiative, focusing on intersectional approaches to creating more equitable systems. Her work examines how organizations can move beyond representational diversity to create authentic inclusion and power-sharing.",
    expertise: [
      "Intersectional Analysis",
      "Organizational Equity Frameworks",
      "Climate Justice",
      "Educational Equity in STEM",
    ],
    education: [
      "Ph.D. in Sociology, Stanford University",
      "M.S. in Environmental Justice, University of Michigan",
      "B.A. in Environmental Studies, Yale University",
    ],
    publications: [
      "Beyond Representation: Power-Sharing Mechanisms (2024)",
      "Measuring Equity: A Mixed-Methods Framework (2023)",
      "Community Knowledge Systems (2022)",
    ],
    projects: [
      "Educational Equity in STEM",
      "Climate Adaptation Strategies in Coastal Communities",
    ],
    contact: {
      email: "chen@ssrg.org",
      phone: "(140) 371-4077",
      twitter: "@DrEmilyChen",
      orcid: "0000-0002-5678-9012",
    },
    featured: true,
  },
  {
    id: "marcus-williams",
    name: "Dr. Marcus J. Williams",
    title: "Research Associate, Social Policy Analysis",
    image: "/images/researcher/williams.webp",
    areas: ["Social Policy Analysis", "Equity & Inclusion"],
    bio: "Dr. Williams specializes in measuring policy impacts on community well-being, with particular focus on developing metrics that center community priorities. His research combines quantitative analysis with community-based participatory approaches to create more nuanced understanding of policy effectiveness.",
    expertise: [
      "Policy Evaluation",
      "Impact Measurement",
      "Urban Development",
      "Community-Defined Metrics",
    ],
    education: [
      "Ph.D. in Public Administration, New York University",
      "M.U.P. in Urban Planning, University of Pennsylvania",
      "B.S. in Economics, Morehouse College",
    ],
    publications: [
      "Measuring What Matters: Community-Defined Metrics (2022)",
      "Measuring Equity: A Mixed-Methods Framework (2023)",
      "Building Resilient Communities (2023)",
    ],
    projects: [
      "Community-Based Evaluation Framework Development",
      "Urban Development Impact Assessment",
    ],
    contact: {
      email: "williams@ssrg.org",
      phone: "(140) 371-4078",
      twitter: "@MJWilliamsPhD",
      orcid: "0000-0003-1234-5678",
    },
    featured: false,
  },
  {
    id: "sofia-patel",
    name: "Dr. Sofia Patel",
    title: "Research Associate, Community Development",
    image: "/images/researcher/patel.webp",
    areas: ["Community Development", "Digital Inclusion"],
    bio: "Dr. Patel's research focuses on technology's role in community development and civic engagement. She examines how digital tools can enhance or hinder inclusive participation, with particular attention to digital literacy and access barriers across diverse communities.",
    expertise: [
      "Digital Civic Engagement",
      "Technology Accessibility",
      "Community Media",
      "Participatory Design",
    ],
    education: [
      "Ph.D. in Communication, University of Pennsylvania",
      "M.S. in Human-Computer Interaction, Georgia Tech",
      "B.A. in Anthropology, University of California, Los Angeles",
    ],
    publications: [
      "Digital Inclusion Frameworks for Rural Communities (2023)",
      "Community Co-Design of Civic Technology (2022)",
      "Bridging Digital Divides Through Participatory Methods (2024)",
    ],
    projects: [
      "Digital Inclusion in Rural Communities",
      "Community Media Development Initiative",
    ],
    contact: {
      email: "patel@ssrg.org",
      phone: "(140) 371-4079",
      twitter: "@SofiaPatelPhD",
      orcid: "0000-0003-5678-9012",
    },
    featured: false,
  },
  {
    id: "david-washington",
    name: "Dr. David Washington",
    title: "Research Associate, Equity & Inclusion",
    image: "/images/researcher/washington.webp",
    areas: ["Equity & Inclusion", "Education Policy"],
    bio: "Dr. Washington researches institutional barriers to equity in educational settings. His work examines how policies, practices, and cultural norms within educational institutions can perpetuate or disrupt systemic inequities, with a focus on creating frameworks for meaningful institutional change.",
    expertise: [
      "Educational Equity",
      "Institutional Ethnography",
      "Anti-Racist Pedagogy",
      "Policy Implementation",
    ],
    education: [
      "Ph.D. in Education Policy, Teachers College, Columbia University",
      "M.Ed. in Educational Leadership, University of Virginia",
      "B.A. in African American Studies, University of Michigan",
    ],
    publications: [
      "Beyond Representation in Educational Institutions (2023)",
      "Implementing Anti-Racist Frameworks in K-12 Settings (2024)",
      "Structural Barriers to Educational Equity (2022)",
    ],
    projects: [
      "Educational Equity in STEM",
      "Institutional Change Framework Development",
    ],
    contact: {
      email: "washington@ssrg.org",
      phone: "(140) 371-4080",
      twitter: "@DrDWashington",
      orcid: "0000-0004-1234-5678",
    },
    featured: false,
  },
  {
    id: "aisha-johnson",
    name: "Dr. Aisha Johnson",
    title: "Research Associate, Social Policy Analysis",
    image: "/images/researcher/johnson.webp",
    areas: ["Social Policy Analysis", "Health Equity"],
    bio: "Dr. Johnson specializes in health policy research, focusing on how policies affect access to care and health outcomes in marginalized communities. Her work combines policy analysis with community-based research to develop more equitable approaches to health policy development and implementation.",
    expertise: [
      "Health Policy",
      "Health Equity",
      "Community-Based Participatory Research",
      "Mixed-Methods Evaluation",
    ],
    education: [
      "Ph.D. in Health Policy, Johns Hopkins University",
      "M.P.H. in Health Policy, Emory University",
      "B.S. in Public Health, Spelman College",
    ],
    publications: [
      "Community Perspectives on Health Policy Implementation (2023)",
      "Measuring Equity in Healthcare Access (2024)",
      "Cross-Sectoral Approaches to Health Disparities (2022)",
    ],
    projects: [
      "Health Equity Impact Assessment Framework",
      "Community Health Policy Collaborative",
    ],
    contact: {
      email: "johnson@ssrg.org",
      phone: "(140) 371-4081",
      twitter: "@DrAishaJ",
      orcid: "0000-0004-5678-9012",
    },
    featured: false,
  },
];

export const projects = [
  {
    title: "Participatory Governance in Urban Communities",
    description:
      "Investigating how digital tools can enhance community participation in local governance and decision-making processes in urban neighborhoods.",
    category: ["Community Development"],
    period: "2023–2025",
    lead: {
      image: "/images/researcher/james.webp",
      name: "Dr. James Rodriguez",
    },
    location: "Metro Region",
    href: "/research/projects/participatory-governance",
    image: "/images/research/communities.webp",
  },
  {
    title: "Affordable Housing Policy Impacts",
    description:
      "Evaluating the effectiveness of recent affordable housing initiatives and their impact on housing stability and quality of life for low-income residents.",
    category: ["Policy Analysis"],
    period: "2024–2026",
    lead: { image: "/images/researcher/kwame.webp", name: "Dr. Kwame Adisa" },
    location: "Multiple Regions",
    href: "/research/projects/housing-policy",
    image: "/images/research/collaborating.webp",
  },
  {
    title: "Educational Equity in STEM",
    description:
      "Researching barriers and enablers to equitable access and outcomes in STEM education across different demographic groups.",
    category: ["Equity & Inclusion"],
    period: "2023–2025",
    lead: { image: "/images/researcher/emily.webp", name: "Dr. Emily Chen" },
    location: "National Study",
    href: "/research/projects/educational-equity",
    image: "/images/research/collaborating.webp",
  },
  {
    title: "Digital Inclusion in Rural Communities",
    description:
      "Examining barriers to technology access and digital literacy in rural areas and testing community-based approaches to bridge the digital divide.",
    category: ["Community Development", "Equity & Inclusion"],
    period: "2024–2026",
    lead: {
      image: "/images/researcher/james.webp",
      name: "Dr. James Rodriguez",
    },
    location: "Rural Districts",
    href: "/research/projects/digital-inclusion",
    image: "/images/research/communities.webp",
  },
];

export const examplePartners = [
  {
    id: "partner-1",
    name: "Harvard Kennedy School",
    description:
      "Leading public policy school focused on training public leaders and conducting research on pressing social issues. Their Government Performance Lab collaborates on evidence-based policy solutions.",
    featured: true,
    logo: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=100&h=100&fit=crop&crop=center",
    website: "https://hks.harvard.edu",
    partnerType: "academic" as const,
    projects: [
      {
        id: "proj-1",
        title: "Urban Housing Policy Impact Assessment",
        description:
          "Evaluating affordable housing initiatives across major cities",
        status: "active" as const,
        creatorId: "user-1",
        shortDescription: "Housing policy research",
        priority: "high" as const,
        featured: true,
        leadResearcherId: "researcher-1",
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-12-15"),
        actualEndDate: null,
        progressPercentage: 65,
        budgetTotal: "250000",
        budgetUsed: "162500",
        isPublic: true,
      },
      {
        id: "proj-2",
        title: "Community Engagement in Local Governance",
        description: "Studying participatory democracy mechanisms",
        status: "planning" as const,
        creatorId: "user-1",
        shortDescription: "Democracy & participation study",
        priority: "medium" as const,
        featured: false,
        leadResearcherId: "researcher-2",
        startDate: new Date("2024-03-01"),
        endDate: new Date("2024-11-30"),
        actualEndDate: null,
        progressPercentage: 25,
        budgetTotal: "180000",
        budgetUsed: "45000",
        isPublic: true,
      },
    ],
  },
  {
    id: "partner-2",
    name: "United Nations Development Programme",
    description:
      "Global development network advocating for change and connecting countries to knowledge, experience and resources to help people build a better life.",
    featured: true,
    logo: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=100&h=100&fit=crop&crop=center",
    website: "https://undp.org",
    partnerType: "government" as const,
    projects: [
      {
        id: "proj-3",
        title: "Sustainable Development Goals Monitoring",
        description: "Tracking progress on SDGs in developing nations",
        status: "active" as const,
        creatorId: "user-2",
        shortDescription: "SDG progress tracking",
        priority: "critical" as const,
        featured: true,
        leadResearcherId: "researcher-3",
        startDate: new Date("2023-06-01"),
        endDate: new Date("2025-06-01"),
        actualEndDate: null,
        progressPercentage: 45,
        budgetTotal: "500000",
        budgetUsed: "225000",
        isPublic: true,
      },
    ],
  },
  {
    id: "partner-3",
    name: "Oxfam International",
    description:
      "Global movement of people working together to end the injustice of poverty. We help people build better futures for themselves, hold the powerful accountable.",
    featured: false,
    logo: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop&crop=center",
    website: "https://oxfam.org",
    partnerType: "ngo" as const,
    projects: [
      {
        id: "proj-4",
        title: "Economic Inequality Research Initiative",
        description: "Multi-country study on wealth distribution trends",
        status: "completed" as const,
        creatorId: "user-3",
        shortDescription: "Inequality research",
        priority: "high" as const,
        featured: false,
        leadResearcherId: "researcher-4",
        startDate: new Date("2023-01-01"),
        endDate: new Date("2023-12-31"),
        actualEndDate: new Date("2023-12-20"),
        progressPercentage: 100,
        budgetTotal: "320000",
        budgetUsed: "315000",
        isPublic: true,
      },
      {
        id: "proj-5",
        title: "Climate Adaptation in Rural Communities",
        description:
          "Supporting agricultural communities adapt to climate change",
        status: "active" as const,
        creatorId: "user-3",
        shortDescription: "Climate adaptation study",
        priority: "high" as const,
        featured: true,
        leadResearcherId: "researcher-5",
        startDate: new Date("2024-02-01"),
        endDate: new Date("2025-01-31"),
        actualEndDate: null,
        progressPercentage: 30,
        budgetTotal: "275000",
        budgetUsed: "82500",
        isPublic: true,
      },
    ],
  },
  {
    id: "partner-4",
    name: "Microsoft Research",
    description:
      "Advancing the state of the art in computer science and providing a scientific foundation for Microsoft's products and services with focus on AI for social good.",
    featured: false,
    logo: "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=100&h=100&fit=crop&crop=center",
    website: "https://microsoft.com/research",
    partnerType: "corporate" as const,
    projects: [
      {
        id: "proj-6",
        title: "AI for Social Impact Platform",
        description: "Developing AI tools for nonprofit organizations",
        status: "active" as const,
        creatorId: "user-4",
        shortDescription: "AI tools for nonprofits",
        priority: "medium" as const,
        featured: false,
        leadResearcherId: "researcher-6",
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-08-31"),
        actualEndDate: null,
        progressPercentage: 70,
        budgetTotal: "400000",
        budgetUsed: "280000",
        isPublic: false,
      },
    ],
  },
  {
    id: "partner-5",
    name: "World Health Organization",
    description:
      "Specialized agency of the United Nations responsible for international public health. WHO works worldwide to promote health and serve the vulnerable.",
    featured: true,
    logo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=100&h=100&fit=crop&crop=center",
    website: "https://who.int",
    partnerType: "international" as const,
    projects: [],
  },
  {
    id: "partner-6",
    name: "Local Community Foundation",
    description:
      "Grassroots organization focused on community-driven development initiatives and supporting local social entrepreneurs in underserved areas.",
    featured: false,
    logo: null,
    website: "https://localcommunityfoundation.org",
    partnerType: "ngo" as const,
    projects: [
      {
        id: "proj-7",
        title: "Community Asset Mapping",
        description:
          "Identifying and cataloging community resources and assets",
        status: "planning" as const,
        creatorId: "user-5",
        shortDescription: "Asset mapping project",
        priority: "low" as const,
        featured: false,
        leadResearcherId: "researcher-7",
        startDate: new Date("2024-04-01"),
        endDate: new Date("2024-10-31"),
        actualEndDate: null,
        progressPercentage: 10,
        budgetTotal: "75000",
        budgetUsed: "7500",
        isPublic: true,
      },
    ],
  },
];

export const exampleMembers = [
  {
    id: "member-1",
    name: "Dr. Sarah Chen",
    email: "s.chen@university.edu",
    slug: "sarah-chen",
    affiliation: "Stanford University - Department of Sociology",
    type: "individual" as const,
    userId: "user-101",
    status: "approved" as const,
    updated_at: new Date("2024-01-15"),
    interests: [
      "Social Policy",
      "Urban Development",
      "Community Engagement",
      "Data Analytics",
    ],
    joinedAt: new Date("2023-09-15"),
  },
  {
    id: "member-2",
    name: "Prof. Michael Rodriguez",
    email: "m.rodriguez@research.org",
    slug: "michael-rodriguez",
    affiliation: "International Development Research Centre",
    type: "individual" as const,
    userId: "user-102",
    status: "approved" as const,
    updated_at: new Date("2024-01-20"),
    interests: ["Sustainable Development", "Climate Change", "Economic Policy"],
    joinedAt: new Date("2022-11-08"),
  },
  {
    id: "member-3",
    name: "Dr. Amina Hassan",
    email: "amina.hassan@ngo.org",
    slug: "amina-hassan",
    affiliation: "Global Health Initiative - East Africa",
    type: "individual" as const,
    userId: "user-103",
    status: "approved" as const,
    updated_at: new Date("2024-02-01"),
    interests: [
      "Public Health",
      "Community Development",
      "Gender Equality",
      "Education Policy",
    ],
    joinedAt: new Date("2023-03-22"),
  },
  {
    id: "member-4",
    name: "Innovation Labs Collective",
    email: "contact@innovationlabs.org",
    slug: "innovation-labs-collective",
    affiliation: "Technology for Social Good Network",
    type: "organization" as const,
    userId: "user-104",
    status: "approved" as const,
    updated_at: new Date("2024-01-30"),
    interests: [
      "Technology Innovation",
      "Digital Inclusion",
      "Social Entrepreneurship",
    ],
    joinedAt: new Date("2023-07-10"),
  },
  {
    id: "member-5",
    name: "Dr. James Thompson",
    email: "j.thompson@policy.gov",
    slug: "james-thompson",
    affiliation: "Department of Social Affairs - Policy Research Division",
    type: "individual" as const,
    userId: "user-105",
    status: "pending" as const,
    updated_at: new Date("2024-02-05"),
    interests: [
      "Public Policy",
      "Government Innovation",
      "Evidence-Based Practice",
    ],
    joinedAt: new Date("2024-01-20"),
  },
  {
    id: "member-6",
    name: "Maria Gonzalez",
    email: "maria.g@community.org",
    slug: "maria-gonzalez",
    affiliation: "Community Development Institute",
    type: "individual" as const,
    userId: "user-106",
    status: "approved" as const,
    updated_at: new Date("2024-01-25"),
    interests: [
      "Community Organizing",
      "Social Justice",
      "Participatory Research",
      "Housing Rights",
      "Immigration Policy",
    ],
    joinedAt: new Date("2023-12-01"),
  },
  {
    id: "member-7",
    name: "Dr. Robert Kim",
    email: "robert.kim@university.edu",
    slug: "robert-kim",
    affiliation: null,
    type: "individual" as const,
    userId: "user-107",
    status: "approved" as const,
    updated_at: new Date("2024-02-03"),
    interests: ["Data Science", "Machine Learning"],
    joinedAt: new Date("2023-05-18"),
  },
  {
    id: "member-8",
    name: "Youth Development Alliance",
    email: "info@youthdev.org",
    slug: "youth-development-alliance",
    affiliation: "National Youth Network",
    type: "organization" as const,
    userId: "user-108",
    status: "approved" as const,
    updated_at: new Date("2024-01-18"),
    interests: [
      "Youth Development",
      "Education",
      "Mental Health",
      "Digital Literacy",
    ],
    joinedAt: new Date("2023-08-25"),
  },
  {
    id: "member-9",
    name: "Dr. Lisa Park",
    email: "l.park@rejected.example",
    slug: "lisa-park",
    affiliation: "Independent Researcher",
    type: "individual" as const,
    userId: "user-109",
    status: "rejected" as const,
    updated_at: new Date("2024-01-10"),
    interests: ["Environmental Policy"],
    joinedAt: new Date("2023-12-15"),
  },
  {
    id: "member-10",
    name: "Alex Johnson",
    email: "alex.johnson@student.edu",
    slug: "alex-johnson",
    affiliation:
      "University of California, Berkeley - Graduate School of Public Policy",
    type: "individual" as const,
    userId: "user-110",
    status: "approved" as const,
    updated_at: new Date("2024-02-07"),
    interests: null,
    joinedAt: new Date("2024-01-05"),
  },
];

export const termsOfUse = [
  {
    title: "1. Acceptance of Terms",
    content: [
      "By accessing or using the Social Solutions Research Group (SSRG) website, research portal, resources, or services, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our services.",
    ],
  },
  {
    title: "2. Description of Services",
    content: [
      "Public access to research findings, publications, and educational resources",
      "Secure researcher portal for authorized users",
      "Collaborative tools for research partners and community organizations",
      "Training materials and methodological resources",
      "Policy briefings and advocacy materials",
    ],
  },
  {
    title: "3. User Accounts and Access",
    subsections: [
      {
        subtitle: "3.1 Account Registration",
        content: [
          "Researcher portal access requires account registration and verification",
          "Users must provide accurate, current, and complete information",
          "Account holders are responsible for maintaining the confidentiality of login credentials",
          "Users must notify SSRG immediately of any unauthorized account access",
        ],
      },
      {
        subtitle: "3.2 User Categories and Access Levels",
        content: [
          "Public Users: Access to published research, resources, and general information",
          "Community Partners: Enhanced access to collaboration tools and unpublished findings",
          "Researchers: Full portal access including data repositories, analysis tools, and project management",
          "Administrators: Complete system access and user management capabilities",
        ],
      },
      {
        subtitle: "3.3 Account Termination",
        content: [
          "SSRG reserves the right to suspend or terminate accounts for terms violations",
          "Users may request account deletion at any time",
          "Data associated with terminated accounts will be handled according to our data retention policies",
        ],
      },
    ],
  },
  {
    title: "4. Intellectual Property Rights",
    subsections: [
      {
        subtitle: "4.1 SSRG Content",
        content: [
          "All original content, research methodologies, and educational materials are owned by SSRG",
          "Published research findings are made available under Creative Commons licenses where applicable",
          "Users may cite and reference SSRG materials with proper attribution",
          "Commercial use of SSRG materials requires explicit written permission",
        ],
      },
      {
        subtitle: "4.2 User-Generated Content",
        content: [
          "Users retain ownership of original content they contribute",
          "By submitting content, users grant SSRG a non-exclusive license to use, modify, and distribute the content for research and educational purposes",
          "Users warrant they have the right to submit all contributed content",
          "SSRG reserves the right to remove user content that violates these terms",
        ],
      },
      {
        subtitle: "4.3 Third-Party Content",
        content: [
          "Some resources may include third-party materials used under fair use or with permission",
          "Users are responsible for obtaining necessary permissions for any third-party content they use",
          "SSRG does not guarantee the accuracy or reliability of third-party content",
        ],
      },
    ],
  },
  {
    title: "5. Research Data and Publications",
    subsections: [
      {
        subtitle: "5.1 Data Sharing",
        content: [
          "Research data is shared in accordance with IRB approvals and participant consent",
          "De-identified datasets may be made available for secondary analysis",
          "Requests for sensitive or restricted data require additional approval processes",
          "Data use agreements may be required for certain datasets",
        ],
      },
      {
        subtitle: "5.2 Publication Guidelines",
        content: [
          "Users may publish findings based on SSRG data with proper attribution",
          "Co-authorship expectations are outlined in collaboration agreements",
          "Community partners have the right to review findings before publication",
          "SSRG reserves the right to publish corrections or clarifications to research findings",
        ],
      },
    ],
  },
  {
    title: "6. Prohibited Uses",
    content: [
      "Use SSRG services for illegal activities or to violate others' rights",
      "Attempt to gain unauthorized access to restricted areas or data",
      "Share login credentials or allow others to use their accounts",
      "Upload malicious software or attempt to disrupt services",
      "Use automated tools to scrape or download large amounts of content without permission",
      "Misrepresent affiliation with SSRG or use our name without authorization",
      "Violate research ethics or participant confidentiality agreements",
    ],
  },
  {
    title: "7. Privacy and Data Protection",
    content: [
      "Personal information is collected and used in accordance with our Privacy Policy",
      "Research data is protected according to our Data Protection protocols",
      "Users should review our privacy practices before using SSRG services",
      "Questions about privacy practices can be directed to our privacy officer",
    ],
  },
  {
    title: "8. Disclaimer of Warranties",
    content: [
      "SSRG services are provided 'as is' without warranties of any kind. While we strive for accuracy and reliability:",
      "We do not guarantee the accuracy, completeness, or timeliness of all information",
      "Research findings are subject to peer review and may be updated based on new evidence",
      "Technical services may experience interruptions or downtime",
      "Users are responsible for evaluating the suitability of information for their purposes",
    ],
  },
  {
    title: "9. Limitation of Liability",
    content: [
      "To the fullest extent permitted by law, SSRG shall not be liable for:",
      "Indirect, incidental, special, or consequential damages",
      "Loss of data, profits, or business opportunities",
      "Damages arising from user reliance on information provided",
      "Technical failures or service interruptions",
    ],
  },
  {
    title: "10. Indemnification",
    content: [
      "Users agree to indemnify and hold SSRG harmless from claims arising from:",
      "User violations of these terms",
      "User-generated content or data",
      "Unauthorized use of user accounts",
      "Violation of third-party rights",
    ],
  },
  {
    title: "11. Governing Law and Dispute Resolution",
    content: [
      "These terms are governed by the laws of [State/Jurisdiction]",
      "Disputes will be resolved through binding arbitration",
      "Users consent to the jurisdiction of [Jurisdiction] courts for legal matters",
      "Class action waivers apply where legally permissible",
    ],
  },
  {
    title: "12. Changes to Terms",
    content: [
      "SSRG reserves the right to modify these terms at any time",
      "Users will be notified of significant changes via email or website notice",
      "Continued use of services after changes constitutes acceptance of new terms",
      "Users who disagree with changes may terminate their accounts",
    ],
  },
  // {
  //   title: "13. Contact Information",
  //   content: [
  //     "For questions about these Terms of Use:",
  //     "Email: legal@ssrg.org",
  //     "Phone: [Phone Number]",
  //     "Address: [Physical Address]",
  //   ],
  // },
];

export const privacyPolicy = [
  {
    title: "1. Introduction and Scope",
    content: [
      "The Social Solutions Research Group (SSRG) is committed to protecting the privacy and confidentiality of all individuals who interact with our organization, participate in our research, or use our services.",
      "This Privacy Policy explains how we collect, use, store, and protect personal information.",
      "This policy applies to:",
    ],
    list: [
      "Website visitors and users",
      "Research participants",
      "Community partners and collaborators",
      "Employees and contractors",
      "Newsletter subscribers and event attendees",
    ],
  },
  {
    title: "2. Information We Collect",
    subsections: [
      {
        subtitle: "2.1 Personal Information",
        subsubsections: [
          {
            subtitle: "Directly Provided Information",
            content: [
              "Name, email address, phone number, and mailing address",
              "Professional affiliation and credentials",
              "Demographic information (when voluntarily provided)",
              "Research interests and expertise areas",
              "Communication preferences",
            ],
          },
          {
            subtitle: "Account Information",
            content: [
              "Username and encrypted passwords",
              "Profile information and preferences",
              "Usage history and activity logs",
              "File uploads and contributions",
            ],
          },
        ],
      },
      {
        subtitle: "2.2 Research Participation Data",
        subsubsections: [
          {
            subtitle: "Participant Information",
            content: [
              "Contact information for recruitment and follow-up",
              "Demographic and socioeconomic information",
              "Survey responses and interview transcripts",
              "Photos, videos, or audio recordings (with explicit consent)",
              "Geographic location data (when relevant to research)",
            ],
          },
          {
            subtitle: "Sensitive Categories",
            content: [
              "Health information (collected only when necessary for research)",
              "Information about vulnerable populations",
              "Data about minors (with appropriate guardian consent)",
              "Information about marginalized communities",
            ],
          },
        ],
      },
      {
        subtitle: "2.3 Technical Information",
        subsubsections: [
          {
            subtitle: "Website Usage Data",
            content: [
              "IP addresses and browser information",
              "Pages visited and time spent on site",
              "Referral sources and search terms",
              "Device information and screen resolution",
              "Cookies and similar tracking technologies",
            ],
          },
          {
            subtitle: "Portal Usage Data",
            content: [
              "Login times and session duration",
              "Features accessed and documents viewed",
              "Download and upload activity",
              "Collaboration and communication logs",
            ],
          },
        ],
      },
    ],
  },
  {
    title: "3. How We Use Your Information",
    subsections: [
      {
        subtitle: "3.1 Research Purposes",
        content: [
          "Conducting approved research studies and analyses",
          "Recruiting participants for current and future studies",
          "Following up with participants for longitudinal research",
          "Creating de-identified datasets for secondary analysis",
          "Evaluating and improving research methodologies",
        ],
      },
      {
        subtitle: "3.2 Service Provision",
        content: [
          "Providing access to research portal and resources",
          "Facilitating collaboration between researchers and community partners",
          "Delivering newsletters and updates about research findings",
          "Responding to inquiries and providing technical support",
          "Personalizing user experience and content recommendations",
        ],
      },
      {
        subtitle: "3.3 Legal and Compliance",
        content: [
          "Complying with Institutional Review Board (IRB) requirements",
          "Meeting legal obligations and regulatory requirements",
          "Protecting the rights and safety of research participants",
          "Maintaining records for audit and oversight purposes",
          "Responding to valid legal requests for information",
        ],
      },
    ],
  },
  {
    title: "4. Information Sharing and Disclosure",
    subsections: [
      {
        subtitle: "4.1 Research Collaborators",
        content: [
          "Authorized team members working on specific research projects",
          "Community partners involved in participatory research",
          "Academic collaborators at partner institutions",
          "External evaluators and auditors (with appropriate agreements)",
        ],
      },
      {
        subtitle: "4.2 Service Providers",
        content: [
          "Cloud storage and technical infrastructure providers",
          "Survey and data collection platform vendors",
          "Transcription and translation services",
          "Legal and compliance consultants",
        ],
      },
      {
        subtitle: "4.3 Required Disclosures",
        content: [
          "Law enforcement agencies with valid legal requests",
          "Regulatory bodies conducting oversight activities",
          "IRB and ethics review committees",
          "Legal proceedings where disclosure is required",
        ],
      },
      {
        subtitle: "4.4 Public Information",
        content: [
          "Published research findings with appropriate de-identification",
          "Aggregate statistics and trends (without personal identifiers)",
          "Case studies and examples (with explicit participant consent)",
          "Educational materials and resources",
        ],
      },
    ],
  },
  {
    title: "5. Data Security and Protection",
    subsections: [
      {
        subtitle: "5.1 Technical Safeguards",
        content: [
          "Encryption of data in transit and at rest",
          "Multi-factor authentication for portal access",
          "Regular security audits and vulnerability assessments",
          "Secure backup and disaster recovery procedures",
          "Access controls and user permission management",
        ],
      },
      {
        subtitle: "5.2 Physical Safeguards",
        content: [
          "Locked offices and secure storage facilities",
          "Restricted access to research spaces",
          "Secure disposal of physical documents",
          "Controlled access to research equipment and devices",
        ],
      },
      {
        subtitle: "5.3 Administrative Safeguards",
        content: [
          "Regular privacy and security training for staff",
          "Clear data handling procedures and protocols",
          "Incident response and breach notification procedures",
          "Regular review and update of security measures",
          "Vendor management and due diligence processes",
        ],
      },
    ],
  },
  {
    title: "6. Data Retention and Deletion",
    subsections: [
      {
        subtitle: "6.1 Retention Periods",
        content: [
          "Research Data: Retained according to IRB approvals and funder requirements (typically 3-7 years)",
          "Account Information: Retained while accounts are active plus 2 years",
          "Website Usage Data: Retained for 2 years unless longer retention is required",
          "Communications: Retained for 3 years for business and legal purposes",
        ],
      },
      {
        subtitle: "6.2 Deletion Procedures",
        content: [
          "Secure deletion of electronic files using industry-standard methods",
          "Physical destruction of paper documents and storage media",
          "Verification of deletion completion and documentation",
          "Notification to relevant parties when deletion is complete",
        ],
      },
      {
        subtitle: "6.3 Exceptions to Deletion",
        content: [
          "Information required for ongoing legal proceedings",
          "Data needed for longitudinal research with participant consent",
          "Information required by law or regulation to be retained",
          "De-identified data used for secondary research purposes",
        ],
      },
    ],
  },
  {
    title: "7. Individual Rights and Choices",
    subsections: [
      {
        subtitle: "7.1 Access and Correction",
        content: [
          "Right to access personal information we hold",
          "Right to request correction of inaccurate information",
          "Right to receive copies of data in portable formats",
          "Assistance with understanding how data is used",
        ],
      },
      {
        subtitle: "7.2 Consent and Withdrawal",
        content: [
          "Right to withdraw consent for research participation",
          "Right to opt out of non-essential communications",
          "Right to request deletion of personal information (subject to research obligations)",
          "Right to object to certain uses of personal information",
        ],
      },
      {
        subtitle: "7.3 Research Participant Rights",
        content: [
          "Right to review research findings before publication",
          "Right to request removal from future research contact lists",
          "Right to file complaints about research conduct",
          "Right to receive updates about research progress and findings",
        ],
      },
    ],
  },
  {
    title: "8. International Data Transfers",
    content: [
      "When we transfer personal information internationally:",
      "We ensure adequate protection through legal mechanisms",
      "We use standard contractual clauses or other approved safeguards",
      "We conduct due diligence on international partners and vendors",
      "We comply with applicable cross-border data transfer regulations",
    ],
  },
  {
    title: "9. Children's Privacy",
    subsubsections: [
      {
        subtitle: "Protection for Minors",
        content: [
          "We do not knowingly collect personal information from children under 13 without parental consent",
          "Research involving minors requires special IRB approval and parental/guardian consent",
          "We use age-appropriate methods for obtaining assent from minor participants",
          "We provide enhanced protection for sensitive information about minors",
        ],
      },
    ],
  },
  {
    title: "10. Changes to This Privacy Policy",
    content: [
      "We review and update this policy regularly to reflect changes in our practices",
      "We will notify users of significant changes via email or website notice",
      "We will obtain additional consent for material changes that affect research participants",
      "Previous versions of the policy are archived and available upon request",
    ],
  },
  {
    title: "11. Contact Information and Complaints",
    subsections: [
      {
        subtitle: "Privacy Officer",
        content: [
          "Email: privacy@ssrg.org",
          "Phone: [Phone Number]",
          "Address: [Physical Address]",
        ],
      },
      {
        subtitle: "Data Protection Officer (for EU residents)",
        content: ["Email: dpo@ssrg.org", "Phone: [Phone Number]"],
      },
      {
        subtitle: "Complaint Procedures",
        content: [
          "Internal complaint process through privacy officer",
          "External complaints to relevant regulatory authorities",
          "IRB complaints for research-related privacy concerns",
        ],
      },
    ],
  },
];

export const dataProtectionPolicy = [
  {
    title: "Overview and Commitment",
    content: [
      "The Social Solutions Research Group (SSRG) upholds comprehensive data protection standards that exceed regulatory requirements and reflect our commitment to participant privacy, research integrity, and community trust.",
      "Our framework integrates international security best practices with ethical research principles, ensuring respect for participant rights across jurisdictions.",
    ],
    list: [
      "Protect the privacy and confidentiality of all research participants",
      "Maintain the highest standards of data security and integrity",
      "Ensure transparent and accountable data management practices",
      "Comply with international and local privacy laws and regulations",
      "Empower communities with meaningful control over their data",
    ],
  },
  {
    title: "Regulatory Compliance Framework",
    subsections: [
      {
        subtitle: "U.S. Federal Regulations",
        subsubsections: [
          {
            subtitle: "Common Rule (45 CFR 46)",
            content: [
              "IRB review and approval for all human subjects research",
              "Informed consent procedures and documentation",
              "Special protections for vulnerable populations",
              "Ongoing monitoring and reporting requirements",
            ],
          },
          {
            subtitle:
              "HIPAA (Health Insurance Portability and Accountability Act)",
            content: [
              "Protection of health information in health-related research",
              "Business associate agreements with covered entities",
              "Minimum necessary standards for data access",
              "Breach notification and incident response procedures",
            ],
          },
          {
            subtitle: "FERPA (Family Educational Rights and Privacy Act)",
            content: [
              "Protection of educational records in education research",
              "Consent requirements for disclosure of educational information",
              "Directory information policies and procedures",
              "Record retention and destruction requirements",
            ],
          },
        ],
      },
      {
        subtitle: "International Regulations",
        subsubsections: [
          {
            subtitle: "General Data Protection Regulation (GDPR - EU/UK)",
            content: [
              "Lawful basis for processing personal data",
              "Respect for data subject rights (access, erasure, portability, objection)",
              "Data protection impact assessments (DPIAs)",
              "Cross-border data transfer mechanisms",
              "Data Protection Officer (DPO) appointment where required",
            ],
          },
          {
            subtitle: "UK Data Protection Act (2018)",
            content: [
              "UK-specific implementation of GDPR standards",
              "Special category data handling for health, ethnicity, and research purposes",
              "Safeguards for academic and research exemptions",
            ],
          },
          {
            subtitle:
              "Canada: PIPEDA (Personal Information Protection and Electronic Documents Act)",
            content: [
              "Consent-based framework for collection, use, and disclosure",
              "Requirements for transparency and accountability in research",
              "Individual rights of access and correction",
              "Safeguards appropriate to sensitivity of information",
            ],
          },
          {
            subtitle: "Nigeria: NDPR (Nigeria Data Protection Regulation)",
            content: [
              "Lawful processing principles (consent, contract, legal obligation, vital interest, public task)",
              "Registration of Data Controllers/Processors with NITDA",
              "Cross-border data transfer restrictions and safeguards",
              "Rights to erasure, portability, and objection",
            ],
          },
          {
            subtitle: "California Consumer Privacy Act (CCPA - USA)",
            content: [
              "Consumer rights regarding personal information",
              "Disclosure and deletion request procedures",
              "Opt-out mechanisms for data sales",
              "Non-discrimination policies for privacy rights exercise",
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Data Classification and Handling",
    subsections: [
      {
        subtitle: "Data Classification Levels",
        subsubsections: [
          {
            subtitle: "Public Data",
            content: [
              "Published research findings and reports",
              "Educational resources and outreach materials",
              "Aggregate statistics without identifiers",
            ],
          },
          {
            subtitle: "Internal Data",
            content: [
              "Organizational documents and communications",
              "Administrative and financial records",
              "Non-sensitive staff and contractor information",
            ],
          },
          {
            subtitle: "Confidential Data",
            content: [
              "Research participant personal information",
              "Unpublished analysis and proprietary methodologies",
              "Legal and compliance documentation",
            ],
          },
          {
            subtitle: "Restricted Data",
            content: [
              "Sensitive health, demographic, or biometric information",
              "Recordings or media involving participants",
              "Data from vulnerable or high-risk populations",
            ],
          },
        ],
      },
      {
        subtitle: "Data Handling Procedures",
        subsubsections: [
          {
            subtitle: "Collection",
            content: [
              "Minimize collection to necessary data only",
              "Secure consent management with clear documentation",
              "Use encrypted and certified collection platforms",
            ],
          },
          {
            subtitle: "Storage",
            content: [
              "Encrypted storage with geographically distributed backups",
              "Strict access controls based on least privilege",
              "Regular backup testing and system hardening",
            ],
          },
          {
            subtitle: "Processing",
            content: [
              "Data used only for approved research purposes",
              "De-identification and anonymization where possible",
              "Full audit trails and reproducibility documentation",
            ],
          },
          {
            subtitle: "Sharing",
            content: [
              "Authorized personnel only, under data use agreements",
              "Secure transfer protocols for external collaboration",
              "Monitoring and logging of all data access events",
            ],
          },
        ],
      },
    ],
  },
];
