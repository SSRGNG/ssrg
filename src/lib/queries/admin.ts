import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
  projects,
  publicationAuthors,
  researcherAreas,
  researcherEducation,
  researcherExpertise,
  researchers,
} from "@/db/schema";

export type ResearcherOutput = {
  id: string;
  name: string;
  title: string;
  image: string;
  areas: string[];
  bio: string;
  expertise: string[];
  education: string[];
  publications: string[];
  projects: string[];
  contact: {
    email: string;
    phone?: string;
    twitter?: string;
    orcid?: string;
  };
  featured: boolean;
};

type ResearchMethodOutput = {
  title: string;
  description: string;
};

type ResearchPublicationOutput = {
  title: string;
  authors: string;
  journal: string;
  year: string;
  volume: string;
  pages: string;
  link: string;
};

export type ResearchAreaOutput = {
  title: string;
  icon: string;
  image: string;
  description: string;
  detail: string;
  sub: string;
  questions: string[];
  methods: ResearchMethodOutput[];
  findings: string[];
  publications: ResearchPublicationOutput[];
  href: string;
  linkText: string;
};

// 1. Get a researcher with the provided researcherId
export async function getResearcher(researcherId: string) {
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

  return researcher;
}

export async function getResearchers() {
  const researcherData = await db.query.researchers.findMany({
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
      education: {
        orderBy: (education, { asc }) => [asc(education.order)],
      },
      areas: {
        with: {
          area: true,
        },
      },
    },
    // orderBy: (researchers, { asc }) => [asc(researchers.createdAt)],
  });

  const formattedResearchers = await Promise.all(
    researcherData.map(async (researcher) => {
      // Get publications
      const publicationsData = await db.query.publicationAuthors.findMany({
        where: eq(publicationAuthors.researcherId, researcher.id),
        with: {
          publication: true,
        },
        orderBy: (pa, { desc }) => [desc(pa.order)],
      });

      const publicationTitles = publicationsData.map((pa) => {
        const pub = pa.publication;
        let title = pub.title;
        if (pub.publicationDate) {
          const year = new Date(pub.publicationDate).getFullYear();
          title += ` (${year})`;
        }
        return title;
      });

      // Get projects
      const projectsData = await db.query.projects.findMany({
        where: eq(projects.leadResearcherId, researcher.id),
      });

      const projectTitles = projectsData.map((project) => project.title);

      // Get research areas
      const researchAreaTitles = researcher.areas.map(
        (area) => area.area.title
      );

      // Format contact info
      const contact = {
        email: researcher.user.email,
        orcid: researcher.orcid || undefined,
        twitter: researcher.x ? `@${researcher.x.replace("@", "")}` : undefined,
      };

      // Return formatted data
      return {
        id: researcher.id,
        name: researcher.user.name,
        title: researcher.title,
        image: researcher.user.image || "/images/placeholder.webp",
        areas: researchAreaTitles,
        bio: researcher.bio,
        expertise: researcher.expertise.map((e) => e.expertise),
        education: researcher.education.map((e) => e.education),
        publications: publicationTitles,
        projects: projectTitles,
        contact,
        featured: researcher.featured,
      };
    })
  );

  return formattedResearchers;
}

export async function getFormattedResearchAreas() {
  // Get all research areas with their relations
  const researchAreaData = await db.query.researchAreas.findMany({
    with: {
      questions: {
        orderBy: (q, { asc }) => [asc(q.order)],
      },
      methods: {
        orderBy: (m, { asc }) => [asc(m.order)],
      },
      findings: {
        orderBy: (f, { asc }) => [asc(f.order)],
      },
      publications: {
        with: {
          publication: true,
        },
        orderBy: (p, { asc }) => [asc(p.order)],
      },
    },
  });

  // Format the research areas
  const formattedResearchAreas = await Promise.all(
    researchAreaData.map(async (area) => {
      // Format publications with author information
      const formattedPublications = await Promise.all(
        area.publications.map(async (pub) => {
          // Get authors for this publication
          const authorData = await db.query.publicationAuthors.findMany({
            where: eq(publicationAuthors.publicationId, pub.publication.id),
            with: {
              researcher: {
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
          });

          // Format author names (Last, F. & Last, F.)
          const authorNames = authorData.map((author) => {
            const fullName = author.researcher.user.name;
            const nameParts = fullName.split(" ");
            const lastName = nameParts[nameParts.length - 1];
            const firstInitial = nameParts[0][0];
            return `${lastName}, ${firstInitial}.`;
          });

          // Join authors with & for last author
          let authorText = "";
          if (authorNames.length === 1) {
            authorText = authorNames[0];
          } else if (authorNames.length === 2) {
            authorText = `${authorNames[0]} & ${authorNames[1]}`;
          } else {
            const lastAuthor = authorNames.pop();
            authorText = `${authorNames.join(", ")} & ${lastAuthor}`;
          }

          // Get year from publication date
          let year = "";
          if (pub.publication.publicationDate) {
            year = new Date(pub.publication.publicationDate)
              .getFullYear()
              .toString();
          }

          // Create formatted publication
          return {
            title: pub.publication.title,
            authors: authorText,
            journal: pub.publication.journal || "Journal not specified",
            year,
            volume: pub.publication.volume || "",
            pages: pub.publication.pages || "",
            link: `/publications/academic/${pub.publication.id}`,
          };
        })
      );

      // Format methods
      const formattedMethods = area.methods.map((method) => ({
        title: method.title,
        description: method.description,
      }));

      // Prepare URL-friendly slug from the title
      const slug = area.title.toLowerCase().replace(/\s+/g, "-");
      const href = `/research/areas/${slug}`;

      // Return formatted research area
      return {
        title: area.title,
        icon: area.icon,
        image: area.image,
        description: area.description,
        detail: area.detail,
        sub: area.detail, // Using 'detail' as 'sub' since it's not in the database schema
        questions: area.questions.map((q) => q.question),
        methods: formattedMethods,
        findings: area.findings.map((f) => f.finding),
        publications: formattedPublications,
        href,
        linkText: `Explore ${area.title} Research`,
      };
    })
  );

  return formattedResearchAreas;
}
// 2. Get all featured researchers with their user info
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

// 3. Get all publications by a researcher
export async function getResearcherPublications(researcherId: string) {
  const researcherPubs = await db.query.publicationAuthors.findMany({
    where: eq(publicationAuthors.researcherId, researcherId),
    with: {
      publication: true,
    },
    orderBy: (pa, { asc }) => [asc(pa.order)],
  });

  return researcherPubs.map((rp) => rp.publication);
}

// 4. Get all projects led by a researcher
export async function getResearcherProjects(researcherId: string) {
  const researcherProjects = await db.query.projects.findMany({
    where: eq(projects.leadResearcherId, researcherId),
    with: {
      categories: {
        with: {
          area: true,
        },
      },
      partners: {
        with: {
          partner: true,
        },
      },
    },
  });

  return researcherProjects;
}

// 5. Get all researchers in a specific research area
export async function getResearchersByArea(areaId: string) {
  const areaResearchers = await db.query.researcherAreas.findMany({
    where: eq(researcherAreas.areaId, areaId),
    with: {
      researcher: {
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              affiliation: true,
              image: true,
            },
          },
          expertise: {
            orderBy: (expertise, { asc }) => [asc(expertise.order)],
          },
        },
      },
    },
  });

  return areaResearchers.map((ar) => ar.researcher);
}

// 6. Create or update a researcher profile
export async function upsertResearcher(
  userId: string,
  data: {
    title: string;
    bio: string;
    x?: string;
    orcid?: string;
    featured?: boolean;
  }
) {
  // Check if researcher already exists
  const existingResearcher = await db.query.researchers.findFirst({
    where: eq(researchers.userId, userId),
  });

  if (existingResearcher) {
    // Update existing researcher
    return db
      .update(researchers)
      .set({
        ...data,
        updated_at: new Date(),
      })
      .where(eq(researchers.userId, userId))
      .returning();
  } else {
    // Create new researcher
    return db
      .insert(researchers)
      .values({
        userId,
        title: data.title,
        bio: data.bio,
        x: data.x,
        orcid: data.orcid,
        featured: data.featured || false,
      })
      .returning();
  }
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
// export async function getResearcherr(researcherId: string) {
//   const session = await auth();
//   if (!session || session.user.role !== 'admin') return null;

//   const userId = session.user.id;
//   return await cache(
//     async () => {
//       try {
//         const results = await db
//           .select({
//             id: researchers.id,
//             name: users.name,
//             title: researchers.title,
//             email: users.email,
//             image: users.image,
//             role: userRoles.role,
//           })
//           .from(researchers)
//           .leftJoin(users, eq(users.id, researchers.userId))
//           .where(eq(researchers.id, researcherId))
//           .execute();

//         if (results.length === 0) return null;

//         // Extract basic user data (same across all results)
//         const userData = {
//           id: results[0].id,
//           name: results[0].name,
//           email: results[0].email,
//           image: results[0].image,
//         };

//         // Get all non-null roles
//         const roles = results
//           .map((r) => r.role)
//           .filter((role): role is Role => !!role);

//         return {
//           ...userData,
//           roles,
//         };
//       } catch (error) {
//         console.error(`Error fetching user with id: ${userId}`, error);
//         return null;
//       }
//     },
//     [`user:${userId}`], // More specific cache key format
//     {
//       tags: [`user:${userId}`, "users"], // Both specific and general tags
//       revalidate: 60 * 60 * 12, // 12 hours
//     }
//   )();
// }
