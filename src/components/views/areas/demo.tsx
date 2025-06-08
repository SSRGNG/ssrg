"use client";

import Link from "next/link";
import * as React from "react";

import { Section } from "@/components/shell/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Section>;

const faqs = [
  {
    question: "How can I access your research findings?",
    answer:
      "Our research findings are accessible through multiple channels. You can browse our publications page for peer-reviewed articles and reports, download resources from our research toolkit section, or subscribe to our newsletter for regular updates. For specific research inquiries, you can contact our research team directly.",
  },
  {
    question:
      "Do you offer research partnerships with community organizations?",
    answer:
      "Yes, we actively seek partnerships with community organizations. We believe in collaborative research approaches that center community expertise and experiences. If you represent a community organization interested in partnering with us, please visit our Partnerships page to learn about our approach and to submit an inquiry.",
  },
  {
    question:
      "How do you ensure your research benefits the communities you study?",
    answer:
      "We follow a community-centered research approach that involves communities throughout the research process—from question development to data collection and dissemination of findings. We implement benefit-sharing mechanisms, provide accessible versions of our research, and develop practical tools for community use. Our impact measurement framework also tracks how our research translates into meaningful social change.",
  },
  {
    question: "Can I propose a research idea or project?",
    answer:
      "We welcome research ideas that align with our focus areas and methodological approach. Please review our research priorities on this page, and then reach out through our Contact page with a brief description of your research idea. Our team regularly reviews proposals and will follow up if there's potential alignment with our work.",
  },
];
function Demo({ className, ...props }: Props) {
  return (
    <Section
      spacing="snug"
      className={cn(className)}
      header={{ title: "Frequently Asked Questions" }}
      {...props}
    >
      <Accordion type="multiple" className="w-full max-w-4xl mx-auto space-y-2">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="text-center space-y-4">
        <p className="text-muted-foreground">
          Have other questions about our research?
        </p>
        <Link
          href="/contact"
          className={cn(buttonVariants({ variant: "default", size: "lg" }))}
        >
          Contact Our Research Team
        </Link>
      </div>
    </Section>
  );
}

export { Demo };
