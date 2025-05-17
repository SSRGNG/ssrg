import "server-only";

import { eq } from "drizzle-orm";
import { unstable_cache as cache } from "next/cache";

import {
  CACHED_FORMATTED_RESEARCH_AREAS,
  CACHED_FORMATTED_RESEARCHER,
  CACHED_FORMATTED_RESEARCHERS,
  CACHED_RESEARCH_AREAS,
} from "@/config/constants";
import { db } from "@/db";
import {
  projects,
  publicationAuthors,
  researcherAreas,
  researcherEducation,
  researcherExpertise,
  researchers,
} from "@/db/schema";

export async function getResearchAreas(limit = 10, offset = 0) {
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
        orderBy: (p, { asc }) => [asc(p.order)],
      },
    },
    limit,
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

    const researcherPromises = researcherData.map(async (researcher) => {
      try {
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
          twitter: researcher.x
            ? `@${researcher.x.replace("@", "")}`
            : undefined,
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
      } catch (error) {
        console.error(`Error processing researcher ${researcher.id}:`, error);
        return null; // Or handle this error differently
      }
    });

    // Wait for all researcher processing and filter out nulls
    const formattedResearchers = (await Promise.all(researcherPromises)).filter(
      Boolean
    );

    // Handle not found case
    if (formattedResearchers.length === 0) {
      console.warn(`Researchers were not found`);
    }

    return formattedResearchers;
  } catch (error) {
    console.error("Failed to fetch researchers:", error);
    throw error; // Or return a fallback value
  }
}

// export async function getFormattedResearchAreas() {
//   try {
//     // Get all research areas with their relations
//     const researchAreaData = await db.query.researchAreas.findMany({
//       with: {
//         questions: {
//           orderBy: (q, { asc }) => [asc(q.order)],
//         },
//         methods: {
//           orderBy: (m, { asc }) => [asc(m.order)],
//         },
//         findings: {
//           orderBy: (f, { asc }) => [asc(f.order)],
//         },
//         publications: {
//           with: {
//             publication: true,
//           },
//           orderBy: (p, { asc }) => [asc(p.order)],
//         },
//       },
//     });

//     // Process each research area with error handling
//     const researchAreaPromises = researchAreaData.map(async (area) => {
//       try {
//         // Format publications with author information
//         const publicationPromises = area.publications.map(async (pub) => {
//           try {
//             // Get authors for this publication
//             const authorData = await db.query.publicationAuthors.findMany({
//               where: eq(publicationAuthors.publicationId, pub.publication.id),
//               with: {
//                 researcher: {
//                   with: {
//                     user: {
//                       columns: {
//                         name: true,
//                       },
//                     },
//                   },
//                 },
//               },
//               orderBy: (pa, { asc }) => [asc(pa.order)],
//             });

//             // Format author names (Last, F. & Last, F.)
//             const authorNames = authorData.map((author) => {
//               const fullName = author.researcher.user.name;
//               const nameParts = fullName.split(" ");
//               const lastName = nameParts[nameParts.length - 1];
//               const firstInitial = nameParts[0][0];
//               return `${lastName}, ${firstInitial}.`;
//             });

//             // Join authors with & for last author
//             let authorText = "";
//             if (authorNames.length === 1) {
//               authorText = authorNames[0];
//             } else if (authorNames.length === 2) {
//               authorText = `${authorNames[0]} & ${authorNames[1]}`;
//             } else {
//               const lastAuthor = authorNames.pop();
//               authorText = `${authorNames.join(", ")} & ${lastAuthor}`;
//             }

//             // Get year from publication date
//             let year = "";
//             if (pub.publication.publicationDate) {
//               year = new Date(pub.publication.publicationDate)
//                 .getFullYear()
//                 .toString();
//             }

//             // Create formatted publication
//             return {
//               title: pub.publication.title,
//               authors: authorText,
//               journal: pub.publication.journal || "Journal not specified",
//               year,
//               volume: pub.publication.volume || "",
//               pages: pub.publication.pages || "",
//               link: `/publications/academic/${pub.publication.id}`,
//             };
//           } catch (error) {
//             console.error(
//               `Error processing publication ${pub.publication.id}:`,
//               error
//             );
//             return null;
//           }
//         });

//         // Wait for all publication promises and filter out any nulls
//         const formattedPublications = (
//           await Promise.all(publicationPromises)
//         ).filter(Boolean);

//         // Format methods
//         const formattedMethods = area.methods.map((method) => ({
//           title: method.title,
//           description: method.description,
//         }));

//         // Prepare URL-friendly slug from the title
//         const slug = area.title.toLowerCase().replace(/\s+/g, "-");
//         const href = `/research/areas/${slug}`;

//         // Return formatted research area
//         return {
//           title: area.title,
//           icon: area.icon,
//           image: area.image,
//           description: area.description,
//           detail: area.detail,
//           questions: area.questions.map((q) => q.question),
//           methods: formattedMethods,
//           findings: area.findings.map((f) => f.finding),
//           publications: formattedPublications,
//           href,
//           linkText: `Explore ${area.title} Research`,
//         };
//       } catch (error) {
//         console.error(`Error processing research area ${area.id}:`, error);
//         return null;
//       }
//     });

//     // Wait for all research area promises and filter out any nulls
//     const formattedResearchAreas = (
//       await Promise.all(researchAreaPromises)
//     ).filter(Boolean);

//     // Throw error if no research areas were found after processing
//     // if (formattedResearchAreas.length === 0) {
//     //   throw new Error("No research areas were found after processing");
//     // }
//     if (formattedResearchAreas.length === 0) {
//       console.warn("No research areas were found after processing.");
//     }

//     return formattedResearchAreas;
//   } catch (error) {
//     console.error("Failed to fetch research areas:", error);
//     throw error; // Re-throw to prevent caching an error state
//   }
// }

// export async function getFormattedResearchAreas() {
//   // Get all research areas with their relations
//   const researchAreaData = await db.query.researchAreas.findMany({
//     with: {
//       questions: {
//         orderBy: (q, { asc }) => [asc(q.order)],
//       },
//       methods: {
//         orderBy: (m, { asc }) => [asc(m.order)],
//       },
//       findings: {
//         orderBy: (f, { asc }) => [asc(f.order)],
//       },
//       publications: {
//         with: {
//           publication: true,
//         },
//         orderBy: (p, { asc }) => [asc(p.order)],
//       },
//     },
//   });

//   // Format the research areas
//   const formattedResearchAreas = await Promise.all(
//     researchAreaData.map(async (area) => {
//       // Format publications with author information
//       const formattedPublications = await Promise.all(
//         area.publications.map(async (pub) => {
//           // Get authors for this publication
//           const authorData = await db.query.publicationAuthors.findMany({
//             where: eq(publicationAuthors.publicationId, pub.publication.id),
//             with: {
//               researcher: {
//                 with: {
//                   user: {
//                     columns: {
//                       name: true,
//                     },
//                   },
//                 },
//               },
//             },
//             orderBy: (pa, { asc }) => [asc(pa.order)],
//           });

//           // Format author names (Last, F. & Last, F.)
//           const authorNames = authorData.map((author) => {
//             const fullName = author.researcher.user.name;
//             const nameParts = fullName.split(" ");
//             const lastName = nameParts[nameParts.length - 1];
//             const firstInitial = nameParts[0][0];
//             return `${lastName}, ${firstInitial}.`;
//           });

//           // Join authors with & for last author
//           let authorText = "";
//           if (authorNames.length === 1) {
//             authorText = authorNames[0];
//           } else if (authorNames.length === 2) {
//             authorText = `${authorNames[0]} & ${authorNames[1]}`;
//           } else {
//             const lastAuthor = authorNames.pop();
//             authorText = `${authorNames.join(", ")} & ${lastAuthor}`;
//           }

//           // Get year from publication date
//           let year = "";
//           if (pub.publication.publicationDate) {
//             year = new Date(pub.publication.publicationDate)
//               .getFullYear()
//               .toString();
//           }

//           // Create formatted publication
//           return {
//             title: pub.publication.title,
//             authors: authorText,
//             journal: pub.publication.journal || "Journal not specified",
//             year,
//             volume: pub.publication.volume || "",
//             pages: pub.publication.pages || "",
//             link: `/publications/academic/${pub.publication.id}`,
//           };
//         })
//       );

//       // Format methods
//       const formattedMethods = area.methods.map((method) => ({
//         title: method.title,
//         description: method.description,
//       }));

//       // Prepare URL-friendly slug from the title
//       const slug = area.title.toLowerCase().replace(/\s+/g, "-");
//       const href = `/research/areas/${slug}`;

//       // Return formatted research area
//       return {
//         title: area.title,
//         icon: area.icon,
//         image: area.image,
//         description: area.description,
//         detail: area.detail,
//         sub: area.detail, // Using 'detail' as 'sub' since it's not in the database schema
//         questions: area.questions.map((q) => q.question),
//         methods: formattedMethods,
//         findings: area.findings.map((f) => f.finding),
//         publications: formattedPublications,
//         href,
//         linkText: `Explore ${area.title} Research`,
//       };
//     })
//   );

//   return formattedResearchAreas;
// }
// 2. Get all featured researchers with their user info

export async function getFormattedResearchAreas() {
  try {
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

    // Process all research areas in parallel
    const formattedResearchAreas = await Promise.all(
      researchAreaData.map(async (area) => {
        try {
          // Process all publications for this area in parallel
          const formattedPublications = (
            await Promise.all(
              area.publications.map(async (pub) => {
                try {
                  // Get authors for this publication
                  const authorData = await db.query.publicationAuthors.findMany(
                    {
                      where: eq(
                        publicationAuthors.publicationId,
                        pub.publication.id
                      ),
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
                    }
                  );

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

                  // Return formatted publication
                  return {
                    title: pub.publication.title,
                    authors: authorText,
                    journal: pub.publication.journal || "Journal not specified",
                    year,
                    volume: pub.publication.volume || "",
                    pages: pub.publication.pages || "",
                    link: `/publications/academic/${pub.publication.id}`,
                  };
                } catch (error) {
                  console.error(
                    `Error processing publication ${pub.publication.id}:`,
                    error
                  );
                  // Return undefined instead of null
                  return undefined;
                }
              })
            )
          ).filter((pub): pub is NonNullable<typeof pub> => pub !== undefined);

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
            questions: area.questions.map((q) => q.question),
            methods: formattedMethods,
            findings: area.findings.map((f) => f.finding),
            publications: formattedPublications,
            href,
            linkText: `Explore ${area.title} Research`,
          };
        } catch (error) {
          console.error(`Error processing research area ${area.id}:`, error);
          // Return undefined instead of null
          return undefined;
        }
      })
    ).then((results) =>
      results.filter(
        (area): area is NonNullable<typeof area> => area !== undefined
      )
    );

    if (formattedResearchAreas.length === 0) {
      console.warn("No research areas were found after processing.");
    }

    return formattedResearchAreas;
  } catch (error) {
    console.error("Failed to fetch research areas:", error);
    throw error; // Re-throw to prevent caching an error state
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
  return db
    .insert(researchers)
    .values({
      userId,
      title: data.title,
      bio: data.bio,
      x: data.x,
      orcid: data.orcid,
      featured: data.featured ?? false,
    })
    .onConflictDoUpdate({
      target: [researchers.userId],
      set: {
        title: data.title,
        bio: data.bio,
        x: data.x,
        orcid: data.orcid,
        featured: data.featured ?? false,
        updated_at: new Date(),
      },
    })
    .returning();
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

export const getCachedResearchAreas = cache(
  async () => getFormattedResearchAreas(),
  [CACHED_FORMATTED_RESEARCH_AREAS],
  { tags: [CACHED_FORMATTED_RESEARCH_AREAS], revalidate: 60 * 60 * 72 } // 72 hours
);
