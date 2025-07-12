import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { users } from "@/db/schema";
import type { VideoCategory, VideoMetadata } from "@/types";

export const videos = pgTable(
  "videos",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    // Basic video info
    title: text("title").notNull(),
    description: text("description"),
    youtubeUrl: varchar("youtube_url", { length: 500 }).notNull(),
    youtubeId: varchar("youtube_id", { length: 50 }).notNull(),

    // Timestamps
    publishedAt: timestamp("published_at").notNull(), // When published on YouTube
    recordedAt: timestamp("recorded_at"), // When actually recorded

    // Categorization
    category: varchar("category", { length: 50 }).$type<VideoCategory>(),
    series: varchar("series", { length: 255 }), // If part of a series

    // Creators and contributors
    creatorId: uuid("creator_id").references(() => users.id, {
      onDelete: "set null",
    }),

    // Metadata and metrics
    metadata: jsonb("metadata").$type<VideoMetadata>(),

    // Engagement tracking
    viewCount: integer("view_count").default(0),
    lastMetricsUpdate: timestamp("last_metrics_update"),

    // Status
    isPublic: boolean("is_public").default(true).notNull(),
    isFeatured: boolean("is_featured").default(false).notNull(),

    // Standard timestamps
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [
    index("videos_youtube_id_idx").on(t.youtubeId),
    index("videos_published_at_idx").on(t.publishedAt),
    index("videos_category_idx").on(t.category),
    index("videos_series_idx").on(t.series),
    index("videos_creator_idx").on(t.creatorId),
    index("videos_featured_idx").on(t.isFeatured),
    index("videos_public_idx").on(t.isPublic),

    // Ensure unique YouTube IDs
    unique("videos_youtube_id_unique").on(t.youtubeId),
  ]
);
