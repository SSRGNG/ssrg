import type { Metadata, ResolvingMetadata } from "next";

import { Page } from "@/components/shell";
import { GetInvolved } from "@/components/views/research";
import {
  Findings,
  Hero,
  Projects,
  Publications,
  ResearchMethods,
  ResearchTeam,
} from "@/components/views/research/areas/slug";
import { getCachedAdminResearchAreas } from "@/lib/queries/admin";
import { mapResearchAreas } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug;
  const rawAreas = await getCachedAdminResearchAreas();
  const areas = mapResearchAreas(rawAreas);
  const area = areas.find((a) => {
    const hrefSlug = a.href.split("/").pop();
    return hrefSlug === slug;
  });

  return {
    title: area?.title || (await parent).title,
    description: area?.description || (await parent).description,
  };
}

export default async function FocusArea({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const rawAreas = await getCachedAdminResearchAreas();
  const areas = mapResearchAreas(rawAreas);

  // console.log({ areas });
  const area = areas.find((a) => {
    const hrefSlug = a.href.split("/").pop();
    return hrefSlug === slug;
  });

  return (
    <Page>
      <Hero area={area} />
      <Projects area={area} />
      <ResearchMethods area={area} />
      <Findings area={area} />
      <Publications area={area} />
      <ResearchTeam area={area} />
      <GetInvolved />
    </Page>
  );
}
