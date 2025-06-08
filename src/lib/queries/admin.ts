import "server-only";

import { eq } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

import {
  CACHED_FORMATTED_RESEARCHER,
  CACHED_FORMATTED_RESEARCHERS,
  CACHED_PROJECTS,
  CACHED_RESEARCH_AREAS,
  CACHED_RESEARCH_FRAMEWORKS,
  CACHED_RESEARCH_METHODOLOGIES,
} from "@/config/constants";
import { db } from "@/db";
import {
  researcherAreas,
  researcherEducation,
  researcherExpertise,
  researchers,
} from "@/db/schema";

export async function getResearchAreas(limit = Infinity, offset = 0) {
  return await db.query.researchAreas.findMany({
    columns: {
      id: true,
      title: true,
      icon: true,
      image: true,
      description: true,
      detail: true,
      href: true,
      linkText: true,
    },
    with: {
      questions: {
        columns: {
          question: true,
          order: true,
        },
        orderBy: (q, { asc }) => [asc(q.order)],
      },
      methods: {
        columns: {
          title: true,
          description: true,
          order: true,
        },
        orderBy: (m, { asc }) => [asc(m.order)],
      },
      findings: {
        columns: {
          finding: true,
          order: true,
        },
        orderBy: (f, { asc }) => [asc(f.order)],
      },
      publications: {
        columns: {
          publicationId: true,
          order: true,
        },
        with: {
          publication: {
            columns: {
              id: true,
              title: true,
              type: true,
              doi: true,
              publicationDate: true,
              venue: true,
              metadata: true,
            },
            with: {
              authors: {
                columns: {
                  order: true,
                  isCorresponding: true,
                },
                with: {
                  author: {
                    columns: {
                      name: true,
                      email: true,
                      affiliation: true,
                      orcid: true,
                    },
                    with: {
                      researcher: {
                        columns: { title: true, orcid: true },
                      },
                    },
                  },
                },
                orderBy: (q, { asc }) => [asc(q.order)],
              },
            },
          },
        },
        orderBy: (p, { asc }) => [asc(p.order)],
      },
    },
    limit: limit === Infinity ? undefined : limit,
    offset,
  });
}
export async function getResearchFrameworks(limit = Infinity, offset = 0) {
  return await db.query.researchFrameworks.findMany({
    columns: {
      id: true,
      title: true,
      description: true,
      href: true,
      linkText: true,
    },
    orderBy: (f, { asc }) => [asc(f.order)],
    limit: limit === Infinity ? undefined : limit,
    offset,
  });
}
export async function getResearchMethodologies(limit = Infinity, offset = 0) {
  return await db.query.researchMethodologies.findMany({
    columns: {
      id: true,
      title: true,
      description: true,
    },
    orderBy: (f, { asc }) => [asc(f.order)],
    limit: limit === Infinity ? undefined : limit,
    offset,
  });
}

export async function getProjects(limit = Infinity, offset = 0) {
  return await db.query.projects.findMany({
    columns: {
      id: true,
      title: true,
      description: true,
    },
    with: {
      leadResearcher: {
        columns: {
          bio: true,
          featured: true,
          id: true,
          orcid: true,
          title: true,
        },
        with: {
          user: {
            columns: {
              name: true,
              affiliation: true,
              email: true,
              image: true,
              id: true,
            },
          },
          education: {
            columns: {
              education: true,
              order: true,
            },
          },
          expertise: {
            columns: {
              expertise: true,
              order: true,
            },
          },
        },
      },
    },
    orderBy: (f, { asc }) => [asc(f.created_at)],
    limit: limit === Infinity ? undefined : limit,
    offset,
  });
}
// 1. Get a researcher with the provided researcherId
export async function getResearcher(researcherId: string) {
  try {
    const researcher = await db.query.researchers.findFirst({
      where: eq(researchers.id, researcherId),
      with: {
        user: true,
        expertise: {
          orderBy: (expertise, { asc }) => [asc(expertise.order)],
        },
        education: {
          orderBy: (education, { asc }) => [asc(education.order)],
        },
        areas: {
          with: {
            area: true,
          },
        },
      },
    });

    // Handle not found case
    if (!researcher) {
      throw new Error(`Researcher with ID ${researcherId} not found`);
    }

    return researcher;
  } catch (error) {
    console.error(`Failed to fetch researcher ${researcherId}:`, error);
    throw error; // Re-throw to allow caller to handle
  }
}

export async function getResearchers() {
  try {
    const researchers = await db.query.researchers.findMany({
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        expertise: {
          orderBy: (expertise, { asc }) => [asc(expertise.order)],
          columns: {
            expertise: true,
          },
        },
        education: {
          orderBy: (education, { asc }) => [asc(education.order)],
          columns: {
            education: true,
          },
        },
        areas: {
          with: {
            area: {
              columns: {
                title: true,
              },
            },
          },
        },
        author: {
          with: {
            publications: {
              with: {
                publication: {
                  columns: {
                    title: true,
                    publicationDate: true,
                  },
                },
              },
              orderBy: (pa, { desc }) => [desc(pa.order)],
            },
          },
        },
        leadProjects: {
          columns: {
            title: true,
          },
        },
      },
      orderBy: (researchers, { asc }) => [asc(researchers.created_at)],
    });
    return researchers;
  } catch (error) {
    console.error("Failed to fetch researchers:", error);
    throw new Error("Failed to fetch researchers");
  }
}

export async function getFeaturedResearchers() {
  const featuredResearchers = await db.query.researchers.findMany({
    where: eq(researchers.featured, true),
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          email: true,
          affiliation: true,
          image: true,
        },
      },
      expertise: {
        orderBy: (expertise, { asc }) => [asc(expertise.order)],
      },
    },
    orderBy: (researchers, { asc }) => [asc(researchers.created_at)],
  });

  return featuredResearchers;
}

// 7. Add expertise to a researcher
export async function addResearcherExpertise(
  researcherId: string,
  expertiseList: string[]
) {
  // First delete existing expertise
  await db
    .delete(researcherExpertise)
    .where(eq(researcherExpertise.researcherId, researcherId));

  // Then add new expertise
  const expertiseToInsert = expertiseList.map((expertise, index) => ({
    researcherId,
    expertise,
    order: index,
  }));

  return db.insert(researcherExpertise).values(expertiseToInsert).returning();
}

// 8. Add education to a researcher
export async function addResearcherEducation(
  researcherId: string,
  educationList: string[]
) {
  // First delete existing education entries
  await db
    .delete(researcherEducation)
    .where(eq(researcherEducation.researcherId, researcherId));

  // Then add new education entries
  const educationToInsert = educationList.map((education, index) => ({
    researcherId,
    education,
    order: index,
  }));

  return db.insert(researcherEducation).values(educationToInsert).returning();
}

// 9. Associate researcher with research areas
export async function setResearcherAreas(
  researcherId: string,
  areaIds: string[]
) {
  // First delete existing area associations
  await db
    .delete(researcherAreas)
    .where(eq(researcherAreas.researcherId, researcherId));

  // Then add new area associations
  const areasToInsert = areaIds.map((areaId) => ({
    researcherId,
    areaId,
  }));

  return db.insert(researcherAreas).values(areasToInsert).returning();
}

// 10. Search researchers by name or expertise
export async function searchResearchers(searchTerm: string) {
  const userResults = await db.query.users.findMany({
    where: (users, { ilike }) => ilike(users.name, `%${searchTerm}%`),
    with: {
      researcher: {
        with: {
          expertise: true,
        },
      },
    },
  });

  // Filter to only include users who have a researcher profile
  const researchersFromUserSearch = userResults
    .filter((user) => user.researcher)
    .map((user) => user.researcher);

  // Also search by expertise
  const expertiseResults = await db.query.researcherExpertise.findMany({
    where: (expertise, { ilike }) =>
      ilike(expertise.expertise, `%${searchTerm}%`),
    with: {
      researcher: {
        with: {
          user: true,
          expertise: true,
        },
      },
    },
  });

  const researchersFromExpertiseSearch = expertiseResults.map(
    (result) => result.researcher
  );

  // Merge and deduplicate results
  const allResults = [
    ...researchersFromUserSearch,
    ...researchersFromExpertiseSearch,
  ];
  const uniqueResults = Array.from(
    new Map(allResults.map((item) => [item.id, item])).values()
  );

  return uniqueResults;
}

export const getCachedResearchers = cache(
  async () => getResearchers(),
  [CACHED_FORMATTED_RESEARCHERS],
  { tags: [CACHED_FORMATTED_RESEARCHERS], revalidate: 60 * 60 * 72 } // 72 hours
);

export async function getCachedResearcher(researcherId: string) {
  return await cache(
    async () => getResearcher(researcherId),
    [CACHED_FORMATTED_RESEARCHER],
    {
      tags: [`${CACHED_FORMATTED_RESEARCHER}-${researcherId}`],
      revalidate: 60 * 60 * 24,
    } // 24 hours
  )();
}

export const getCachedAdminResearchAreas = cache(
  async () => getResearchAreas(),
  [CACHED_RESEARCH_AREAS],
  { tags: [CACHED_RESEARCH_AREAS], revalidate: 60 * 60 * 72 } // 72 hours
);

export const getCachedResearchFrameworks = cache(
  async () => getResearchFrameworks(),
  [CACHED_RESEARCH_FRAMEWORKS],
  { tags: [CACHED_RESEARCH_FRAMEWORKS], revalidate: 60 * 60 * 72 } // 72 hours
);

export const getCachedResearchMethodologies = cache(
  async () => getResearchMethodologies(),
  [CACHED_RESEARCH_METHODOLOGIES],
  { tags: [CACHED_RESEARCH_METHODOLOGIES], revalidate: 60 * 60 * 72 } // 72 hours
);

export const getCachedProjects = cache(
  async () => getProjects(),
  [CACHED_PROJECTS],
  { tags: [CACHED_PROJECTS], revalidate: 60 * 60 * 72 } // 72 hours
);
