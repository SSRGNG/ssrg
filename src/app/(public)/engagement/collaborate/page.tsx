import type { Metadata } from "next";

import { Page } from "@/components/shell";
import { Hero } from "@/components/views/engagement/collaborate";

export const metadata: Metadata = {
  title: "Collaborate",
};

export default function Collaborate() {
  return (
    <Page>
      <Hero />
      {/* Include your form here (you already drafted great copy). */}
      {/* Add a note: "Membership is free and open to individuals and organizations committed to advancing social solutions." */}
    </Page>
  );
}
