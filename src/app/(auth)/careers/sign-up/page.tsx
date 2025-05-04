import { Signup } from "@/components/auth/signup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Careers`,
};

export default function Page() {
  return <Signup />;
}
