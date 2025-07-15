// "use server";

// import { and, eq, ilike, isNull, or, sql } from "drizzle-orm";
// import { revalidatePath, revalidateTag } from "next/cache";

// import { auth } from "@/auth";
// import { CACHED_PUBLICATIONS } from "@/config/constants";
// import { db } from "@/db";
// import {
//   authors,
//   publicationAuthors,
//   publications,
//   researchers,
//   users,
// } from "@/db/schema";
// import { getCitationCount } from "@/lib/actions/citations";
// import { isRoleAllowed } from "@/lib/utils";
// import {
//   type CreateAuthorPayload,
//   createAuthorSchema,
// } from "@/lib/validations/author";
// import {
//   CreatePublicationPayload,
//   createPublicationSchema,
// } from "@/lib/validations/publication";

// import { videos, videoAuthors } from "@/db/schema";
// import type { CreateVideoInput } from "@/lib/validations/videos";

// export async function createVideo(data: CreateVideoInput) {
//   try {
//     const [video] = await db
//       .insert(videos)
//       .values({
//         title: data.title,
//         description: data.description,
//         youtubeUrl: data.youtubeUrl,
//         youtubeId: data.youtubeId,
//         publishedAt: data.publishedAt,
//         recordedAt: data.recordedAt,
//         category: data.category,
//         series: data.series,
//         creatorId: data.creatorId,
//         metadata: data.metadata,
//         isPublic: data.isPublic,
//         isFeatured: data.isFeatured,
//       })
//       .returning();

//     if (data.authors && data.authors.length > 0) {
//       await db.insert(videoAuthors).values(
//         data.authors.map((author) => ({
//           videoId: video.id,
//           authorId: author.authorId!,
//           role: author.role,
//           order: author.order,
//         }))
//       );
//     }

//     return {
//       success: true as const,
//       video,
//     };
//   } catch (error) {
//     console.error("Failed to create video:", error);
//     return {
//       success: false as const,
//       error: "Failed to create video",
//     };
//   }
// }
// ```

// {
//     "title": "Community Development",
//     "description": "some description",
//     "youtubeUrl": "https://www.youtube.com/watch?v=iHzzSao6ypE",
//     "publishedAt": "2025-07-14T23:19:21.860Z",
//     "recordedAt": "2025-06-30T23:00:00.000Z",
//     "category": "research_explanation",
//     "series": "S-E2",
//     "creatorId": "628cdb45-2960-47ac-9a71-e00a99a9162b",
//     "metadata": {
//         "youtubeId": "iHzzSao6ypE",
//         "duration": "PT0M0S"
//     },
//     "isPublic": true,
//     "isFeatured": false,
//     "authors": [
//         {
//             "role": "host",
//             "order": 0,
//             "researcherId": "65eeb6e0-db6c-45ba-8f3d-d03f11b54137",
//             "orcid": null,
//             "name": "Richmond Davis",
//             "email": "emrrich@gmail.com",
//             "affiliation": "Resydia inc"
//         },
//         {
//             "role": "host",
//             "order": 1,
//             "researcherId": "7d1d8a64-8763-4033-b35e-b7ae3c43c955",
//             "orcid": "0000-0002-1787-536X",
//             "name": "Prince Chiagozie Ekoh",
//             "email": "Princechiagozie.ekoh@gmail.com",
//             "affiliation": "University of Calgary"
//         },
//         {
//             "role": "host",
//             "order": 2,
//             "id": "aac1a65b-5801-4507-b085-336bdc9e64ee",
//             "researcherId": null,
//             "orcid": null,
//             "name": "Irene R. Davis",
//             "email": "irene@resydia.com",
//             "affiliation": "Resydia"
//         }
//     ]
// }
