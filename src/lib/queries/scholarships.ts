import "server-only";

import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  awardMedia,
  events,
  files,
  recipients,
  scholarships,
} from "@/db/schema";

export const getScholarshipWithRecipients = async (scholarshipId: string) => {
  return await db.query.scholarships.findFirst({
    where: eq(scholarships.id, scholarshipId),
    with: {
      recipients: {
        with: {
          media: true,
        },
      },
      media: true,
    },
  });
};

export const getAllActiveScholarships = async () => {
  return await db.query.scholarships.findMany({
    where: eq(scholarships.active, true),
    with: {
      recipients: {
        with: {
          media: {
            where: eq(awardMedia.isPublic, true),
          },
        },
      },
    },
    orderBy: [desc(scholarships.created_at)],
  });
};

export const getScholarships = async () => {
  return await db.query.scholarships.findMany({
    with: {
      recipients: {
        with: {
          media: {
            where: eq(awardMedia.isPublic, true),
          },
        },
      },
    },
    orderBy: [desc(scholarships.created_at)],
  });
};

export const getRecipients = async () => {
  return await db.query.recipients.findMany({
    with: {
      media: {
        where: eq(awardMedia.isPublic, true),
      },
    },
    orderBy: [desc(recipients.created_at)],
  });
};

export const getAwardMedia = async () => {
  return await db.query.awardMedia.findMany({
    where: eq(awardMedia.isPublic, true),
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
    },
    orderBy: [desc(awardMedia.created_at)],
  });
};

export const getEvents = async () => {
  return await db.query.events.findMany({
    orderBy: [desc(events.created_at)],
  });
};

export async function getAwardMediaWithFiles(filters?: {
  scholarshipId?: string;
  recipientId?: string;
  eventId?: string;
  isPublic?: boolean;
}) {
  const query = db
    .select({
      id: awardMedia.id,
      scholarshipId: awardMedia.scholarshipId,
      recipientId: awardMedia.recipientId,
      eventId: awardMedia.eventId,
      caption: awardMedia.caption,
      isPublic: awardMedia.isPublic,
      sortOrder: awardMedia.sortOrder,
      createdAt: awardMedia.created_at,
      // File details
      fileId: files.id,
      filename: files.filename,
      originalName: files.originalName,
      mimeType: files.mimeType,
      size: files.size,
      url: files.url,
      uploadthingUrl: files.uploadthingUrl,
      altText: files.altText,
    })
    .from(awardMedia)
    .innerJoin(files, eq(awardMedia.fileId, files.id))
    .orderBy(awardMedia.sortOrder, awardMedia.created_at);

  if (filters) {
    if (filters.scholarshipId) {
      query.where(eq(awardMedia.scholarshipId, filters.scholarshipId));
    }
    if (filters.recipientId) {
      query.where(eq(awardMedia.recipientId, filters.recipientId));
    }
    if (filters.eventId) {
      query.where(eq(awardMedia.eventId, filters.eventId));
    }
    if (filters.isPublic !== undefined) {
      query.where(eq(awardMedia.isPublic, filters.isPublic));
    }
  }

  return await query;
}
