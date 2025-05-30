import "server-only";

import { auth } from "@/auth";
import { appConfig } from "@/config";
import { db } from "@/db";
import { redirect } from "next/navigation";

export async function getPublications(limit = Infinity, offset = 0) {
  return await db.query.publications.findMany({
    columns: {
      id: true,
      title: true,
      type: true,
      doi: true,
      publicationDate: true,
    },
    with: {
      authors: {
        columns: {
          order: true,
        },
        with: {
          researcher: {
            columns: {
              title: true,
              orcid: true,
            },
            with: {
              user: {
                columns: {
                  name: true,
                  affiliation: true,
                },
              },
            },
          },
        },
        orderBy: (q, { asc }) => [asc(q.order)],
      },
    },
    orderBy: (f, { asc }) => [asc(f.publicationDate)],
    limit: limit === Infinity ? undefined : limit,
    offset,
  });
}

export async function getResearcherPublications() {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) redirect(appConfig.url);

  const researcher = await db.query.researchers.findFirst({
    columns: { id: true },
    where: (model, { eq }) => eq(model.userId, userId),
  });
  if (!researcher) throw new Error(`Sorry you can't complete this query`);

  const researcherPubs = await db.query.publicationAuthors.findMany({
    where: (model, { eq }) => eq(model.researcherId, researcher.id),
    with: {
      publication: {
        with: {
          authors: {
            columns: {
              order: true,
              researcherId: true,
            },
            with: {
              researcher: {
                columns: {
                  title: true,
                },
                with: {
                  user: {
                    columns: {
                      name: true,
                    },
                  },
                },
              },
            },
            orderBy: (pa, { asc }) => [asc(pa.order)],
          },
        },
      },
    },
    // orderBy: (pa, { desc }) => [desc(pa.publication.publicationDate)], // Most recent first
  });

  return researcherPubs.map((rp) => ({
    ...rp.publication,
    // Add the current user's author order for permission checking
    userAuthorOrder: rp.order,
    // Add flag to easily check if user is lead author (order 0)
    isLeadAuthor: rp.order === 0,
    // Add flag to check if user has minimum order (can delete)
    canDelete:
      rp.publication.authors.length > 0 &&
      rp.order === Math.min(...rp.publication.authors.map((a) => a.order)),
  }));
}
