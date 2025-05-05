import { Icons } from "@/components/shared/icons";
import {
  actions,
  appName,
  appNav,
  auth,
  authors,
  creator,
  footerNav,
  keywords,
  links,
  mainNav,
  navSecondary,
  userNav,
} from "@/config/constants";
import { mapUserNav } from "@/lib/utils";
import { UserNavItem } from "@/types";

export type AppConfig = typeof appConfig;

export const appConfig = {
  name: appName,
  keywords,
  authors,
  creator,
  description:
    "Advancing social solutions through rigorous research and data-driven insights",
  url: "/",
  email: "ssrg@socialsolutionsresearchgroup.org",
  displayEmail: "ssrg@...group.org",
  phone: "14037140758",
  address: "123 Research Way, Academic City, AC 12345",
  ogImage: "",
  apps: {
    title: "Research Tools",
    description:
      "Featured research applications developed and maintained by SSRG",
    icon: "dataTools" as Icons,
  },
  home: {
    title: `Social Solutions Research Group`,
    description:
      "Bridging research and practice to create meaningful social impact",
  },
  auth,
  entry: {
    title: `Researcher Portal`,
    description: "Your personalized research workspace",
    href: "/portal",
  },
  support: {
    request: {
      title: `Research Support`,
      description: "Get assistance with our research tools and resources",
      href: "/support/request",
    },
    contact: {
      title: `Contact Research Team`,
      description: "Reach out to our researchers and staff",
      href: "/support/contact",
    },
  },
  links,
  docs: {
    privacy: {
      text: `By proceeding, you acknowledge that you are creating a research account with ${appName} and consent to abide by our`,
      agreement: `Research Terms`,
      agreement_url: "/docs/terms-of-service",
      policy: "Data Privacy Policy",
      policy_url: "/docs/privacy-policy",
    },
    ethics: {
      text: `Our research complies with`,
      standards: `Ethical Standards`,
      standards_url: "/docs/research-ethics",
    },
  },
  quote: {
    text: `&ldquo;SSRG's research has fundamentally changed how we approach community development. Their data-driven insights are invaluable.&rdquo;`,
    footer: "Dr. Melda Z., Community Solutions Institute",
  },
  research: {
    title: "Our Research",
    description: "Explore our current projects and publications",
    icon: "research" as Icons,
  },
  mainNav,
  appNav,
  navSecondary,
  actions,
  userNav: mapUserNav(userNav) satisfies UserNavItem[],
  footerNav,
  social: {
    title: "Connect With Our Researchers",
    description: "Join the conversation on social media",
    icon: "connect" as Icons,
    items: navSecondary,
  },
  metrics: {
    title: "Research Impact",
    description: "Measuring the real-world effects of our work",
    icon: "metrics" as Icons,
    items: [
      {
        title: "Case Studies",
        href: "/impact/case-studies",
        icon: "caseStudy" as Icons,
      },
      {
        title: "Annual Reports",
        href: "/impact/reports",
        icon: "reports" as Icons,
      },
    ],
  },
} as const;
