import Image from "next/image";
import Link from "next/link";

import { Section } from "@/components/shell/section";
import { cn } from "@/lib/utils";

function CallToAction({ className }: { className?: string }) {
  return (
    <Section spacing="snug" className={cn("bg-muted", className)}>
      <div className="bg-brand text-white rounded-xl overflow-hidden shadow-xl max-w-5xl mx-auto">
        <div className="md:flex">
          <div className="md:w-1/3 bg-brand/90">
            <Image
              src="/images/research/collaborating.webp"
              alt="Research collaboration"
              width={400}
              height={300}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:w-2/3 p-10 space-y-6">
            <h2 className="text-3xl font-bold">Ready to collaborate?</h2>
            <p className="text-xl">
              We&apos;re always seeking new research partners, community
              collaborators, and funding relationships to expand our work.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="bg-white text-brand px-6 py-3 rounded-lg font-semibold hover:bg-muted"
              >
                Contact Us
              </Link>
              <Link
                href="/partnerships"
                className="bg-brand-foreground text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-foreground/90"
              >
                Explore Partnerships
              </Link>
              <Link
                href="/subscribe"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand/80"
              >
                Subscribe to Updates
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

export { CallToAction };
