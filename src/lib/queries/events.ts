import "server-only";

import { and, asc, desc, eq, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  awardMedia,
  eventMedia,
  events,
  files,
  recipients,
  scholarships,
} from "@/db/schema";

export const getEventMedia = async () => {
  return await db.query.eventMedia.findMany({
    with: {
      file: {
        columns: {
          id: true,
          filename: true,
          url: true,
          mimeType: true,
          size: true,
          altText: true,
        },
      },
      event: { columns: { id: true, title: true } },
    },
    orderBy: [eventMedia.sortOrder, desc(eventMedia.created_at)],
  });
};

export const getEventMediaById = async (id: string) => {
  return await db.query.eventMedia.findMany({
    where: eq(eventMedia.id, id),
    with: {
      file: {
        columns: {
          id: true,
          filename: true,
          url: true,
          mimeType: true,
          size: true,
          altText: true,
        },
      },
      event: {
        columns: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: [eventMedia.sortOrder, desc(eventMedia.created_at)],
  });
};

export const getPublicEventMediaById = async (id: string) => {
  return await db.query.eventMedia.findMany({
    where: and(eq(eventMedia.isPublic, true), eq(eventMedia.id, id)),
    with: {
      file: {
        columns: {
          id: true,
          filename: true,
          url: true,
          mimeType: true,
          size: true,
          altText: true,
        },
      },
      event: {
        columns: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: [eventMedia.sortOrder, desc(eventMedia.created_at)],
  });
};

export async function getFeaturedEventMedia() {
  try {
    const featuredEventMedia = await db
      .select({
        id: eventMedia.id,
        eventId: eventMedia.eventId,
        fileId: eventMedia.fileId,
        caption: eventMedia.caption,
        externalEvent: eventMedia.externalEvent,
        externalLocation: eventMedia.externalLocation,
        externalDate: eventMedia.externalDate,
        isPublic: eventMedia.isPublic,
        isFeatured: eventMedia.isFeatured,
        sortOrder: eventMedia.sortOrder,
        created_at: eventMedia.created_at,
        updated_at: eventMedia.updated_at,
        // File information
        file: {
          id: files.id,
          filename: files.filename,
          url: files.url,
          mimeType: files.mimeType,
          size: files.size,
          altText: files.altText,
        },
        // Event information (if linked)
        event: {
          id: events.id,
          title: events.title,
        },
      })
      .from(eventMedia)
      .leftJoin(files, eq(eventMedia.fileId, files.id))
      .leftJoin(events, eq(eventMedia.eventId, events.id))
      .where(eq(eventMedia.isFeatured, true))
      .orderBy(eventMedia.sortOrder, desc(eventMedia.created_at));

    return featuredEventMedia;
  } catch (error) {
    console.error("Error fetching featured event media:", error);
    return [];
  }
}

export const getPublicEventMedia = async () => {
  return await db.query.eventMedia.findMany({
    where: eq(eventMedia.isPublic, true),
    with: {
      file: {
        columns: {
          id: true,
          filename: true,
          url: true,
          mimeType: true,
          size: true,
          altText: true,
        },
      },
      event: {
        columns: {
          id: true,
          title: true,
        },
      },
    },
    orderBy: [eventMedia.sortOrder, desc(eventMedia.created_at)],
  });
};

export async function getCarouselData() {
  try {
    const [awardMediaResult, eventMediaResult] = await Promise.all([
      db
        .select({
          id: awardMedia.id,
          type: sql<string>`'award'`,
          caption: awardMedia.caption,
          sortOrder: awardMedia.sortOrder,
          createdAt: awardMedia.created_at,

          // File info
          fileUrl: files.url,

          // Award-specific fields
          scholarshipId: awardMedia.scholarshipId,
          scholarshipTitle: scholarships.title,
          recipientYear: recipients.year,

          // Event info (for both award and event media)
          eventId: events.id,
          eventTitle: events.title,
          eventStartDate: events.startDate,

          // Event-specific fields (null for award media)
          externalEvent: sql<string | null>`null`,
          externalDate: sql<string | null>`null`,
        })
        .from(awardMedia)
        .innerJoin(files, eq(awardMedia.fileId, files.id))
        .leftJoin(scholarships, eq(awardMedia.scholarshipId, scholarships.id))
        .leftJoin(recipients, eq(awardMedia.recipientId, recipients.id))
        .leftJoin(events, eq(awardMedia.eventId, events.id))
        .where(
          and(eq(awardMedia.isPublic, true), eq(awardMedia.isFeatured, true))
        )
        .orderBy(asc(awardMedia.sortOrder), desc(awardMedia.created_at)),

      db
        .select({
          id: eventMedia.id,
          type: sql<string>`'event'`,
          caption: eventMedia.caption,
          sortOrder: eventMedia.sortOrder,
          createdAt: eventMedia.created_at,

          // File info
          fileUrl: files.url,

          // Award-specific fields (null for event media)
          scholarshipId: sql<string | null>`null`,
          scholarshipTitle: sql<string | null>`null`,
          recipientYear: sql<string | null>`null`,

          // Event info
          eventId: events.id,
          eventTitle: events.title,
          eventStartDate: events.startDate,

          // Event-specific fields
          externalEvent: eventMedia.externalEvent,
          externalDate: eventMedia.externalDate,
        })
        .from(eventMedia)
        .innerJoin(files, eq(eventMedia.fileId, files.id))
        .leftJoin(events, eq(eventMedia.eventId, events.id))
        .where(
          and(eq(eventMedia.isPublic, true), eq(eventMedia.isFeatured, true))
        )
        .orderBy(asc(eventMedia.sortOrder), desc(eventMedia.created_at)),
    ]);

    // Combine and transform the results
    const combinedResults = [...awardMediaResult, ...eventMediaResult];

    const carouselItems = combinedResults
      .map((item) => ({
        id: item.id,
        type: item.type as "award" | "event",
        title:
          item.caption ??
          (item.type === "award"
            ? item.scholarshipTitle ?? "Award Moment"
            : item.eventTitle ?? item.externalEvent ?? "Event Moment"),
        date:
          item.eventStartDate ??
          (item.type === "award" ? item.recipientYear : item.externalDate) ??
          null,
        imageUrl: item.fileUrl,
        link: item.eventId
          ? `/events/${item.eventId}`
          : item.type === "award"
          ? `/awards/${item.scholarshipId}`
          : null,
        sortOrder: item.sortOrder,
        createdAt: item.createdAt,
      }))
      .sort((a, b) => {
        // First sort by sortOrder (ascending)
        if (a.sortOrder !== b.sortOrder) {
          return (a.sortOrder ?? 999) - (b.sortOrder ?? 999);
        }
        // Then by date (most recent first)
        const dateA = new Date(a.date ?? 0).getTime();
        const dateB = new Date(b.date ?? 0).getTime();
        if (dateA !== dateB) {
          return dateB - dateA;
        }
        // Finally by createdAt (most recent first)
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

    return {
      success: true as const,
      data: carouselItems,
    };
  } catch (error) {
    console.error("Error fetching carousel data:", error);
    return {
      success: false as const,
      error: "Failed to fetch carousel data",
    };
  }
}
