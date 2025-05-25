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
import { ChartLine, HandHeart, Users2 } from "lucide-react";

export const appName = "SSRG";
export const appFullName = "Social Solutions Research Group";
export const links = {
  x: "https://x.com/ssrg",
  facebook: "https://facebook.com/ssrg",
  gitHub: "https://github.com/ssrg",
  discord: "https://discord.com/users/ssrg",
  linkedIn: "https://linkedin.com/company/ssrg",
} as const;

export const PASSWORD_KEY_LENGTH = 64;
export const PIN_KEY_LENGTH = 32;

export const CACHED_RESEARCH_AREAS = "cached-research-areas";
export const CACHED_FORMATTED_RESEARCH_AREAS =
  "cached-formatted-research-areas";

export const CACHED_RESEARCHERS = "cached-researchers";
export const CACHED_FORMATTED_RESEARCHERS = "cached-formatted-researchers";

export const CACHED_RESEARCHER = "cached-researcher";
export const CACHED_FORMATTED_RESEARCHER = "cached-formatted-researcher";

export const CACHED_RESEARCH_FRAMEWORKS = "cached-research-frameworks";
export const CACHED_RESEARCH_METHODOLOGIES = "cached-research-methodologies";
export const CACHED_PROJECTS = "cached-projects";

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
    roles: ["admin", "researcher", "member"],
    icon: "dashboard",
    items: [],
  },
  {
    title: "Research Projects",
    href: "/portal/projects",
    description: "Current and past research initiatives",
    roles: ["admin", "researcher"],
    icon: "research",
    items: [],
  },
  {
    title: "Publications",
    href: "/portal/publications",
    description: "Research papers, reports, and findings",
    roles: ["admin", "researcher", "member"],
    icon: "publications",
    items: [],
  },
  {
    title: "Data Repository",
    href: "/portal/data",
    description: "Access research datasets and resources",
    roles: ["admin", "researcher"],
    icon: "database",
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
        href: "/publications/academic",
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
        project: "Create Project",
      },
    },
    {
      title: "User Management",
      href: "/admin/users",
      roles: ["admin"] as Role[],
      icon: "user" as Icons,
      options: {
        user: "Create User",
      },
    },
    {
      title: "Research Team",
      href: "/admin/teams",
      roles: ["admin"] as Role[],
      icon: "people" as Icons,
      options: {
        partner: "Manage Partners & Collaborators",
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
        link: "/publications/academic/participatory-urban-governance",
      },
      {
        title:
          "Building Resilient Communities: A Framework for Asset-Based Development in Post-Industrial Cities",
        authors: "Adisa, K., Williams, M., & Rodriguez, J.",
        journal: "Community Resilience Quarterly",
        year: "2023",
        volume: "18(2)",
        pages: "87-106",
        link: "/publications/academic/resilient-communities-framework",
      },
      {
        title:
          "Community Knowledge Systems: Valuing Local Expertise in Development Practice",
        authors: "Chen, E. & Rodriguez, J.",
        journal: "International Journal of Knowledge Management",
        year: "2022",
        volume: "15(4)",
        pages: "342-361",
        link: "/publications/academic/community-knowledge-systems",
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
        link: "/publications/academic/housing-first-implementation",
      },
      {
        title:
          "Cross-Sectoral Policy Coordination: A Framework for Integrated Social Services",
        authors: "Rodriguez, J. & Adisa, K.",
        journal: "Policy Studies Journal",
        year: "2023",
        volume: "51(3)",
        pages: "289-312",
        link: "/publications/academic/cross-sectoral-policy",
      },
      {
        title:
          "Measuring What Matters: Community-Defined Metrics for Equitable Policy Evaluation",
        authors: "Chen, E. & Williams, M.",
        journal: "Public Administration Review",
        year: "2022",
        volume: "82(1)",
        pages: "75-94",
        link: "/publications/academic/community-defined-metrics",
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
        link: "/publications/academic/power-sharing-mechanisms",
      },
      {
        title:
          "Measuring Equity: A Mixed-Methods Framework for Organizational Assessment",
        authors: "Williams, M. & Chen, E.",
        journal: "Nonprofit Management and Leadership",
        year: "2023",
        volume: "33(2)",
        pages: "156-175",
        link: "/publications/academic/measuring-equity-framework",
      },
      {
        title:
          "Intersectional Approaches to Educational Equity: Moving Beyond Single-Axis Interventions",
        authors: "Adisa, K. & Rodriguez, J.",
        journal: "American Educational Research Journal",
        year: "2022",
        volume: "59(3)",
        pages: "482-504",
        link: "/publications/academic/intersectional-educational-equity",
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
