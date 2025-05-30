import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { projects, publications, researchers, users } from "@/db/schema";
import { AccessLevel, DatasetStatus } from "@/types";

// export const datasetStatusEnum = pgEnum("dataset_status", [
//   "draft",
//   "processing",
//   "active",
//   "archived",
//   "deprecated"
// ]);

// export const accessLevelEnum = pgEnum("access_level", [
//   "public",
//   "restricted",
//   "private",
//   "confidential"
// ]);

export const datasets = pgTable(
  "datasets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    category: varchar("category", { length: 100 }).notNull(),

    // File information
    fileName: varchar("file_name", { length: 255 }),
    fileSize: integer("file_size"), // in bytes
    fileType: varchar("file_type", { length: 50 }),
    filePath: text("file_path"), // Storage path/URL

    // Metadata
    version: varchar("version", { length: 20 }).default("1.0").notNull(),
    // status: datasetStatusEnum("status").default("draft").notNull(),
    // accessLevel: accessLevelEnum("access_level").default("private").notNull(),
    status: varchar("status", { length: 50 })
      .$type<DatasetStatus>()
      .default("draft")
      .notNull(),
    accessLevel: varchar("access_level", { length: 50 })
      .$type<AccessLevel>()
      .default("private")
      .notNull(),

    // Attribution
    creatorId: uuid("creator_id").references(() => users.id),
    projectId: uuid("project_id").references(() => projects.id),

    // Documentation
    methodology: text("methodology"),
    dataSchema: jsonb("data_schema"), // JSON description of data structure
    keywords: text("keywords"), // Comma-separated tags

    // Timestamps
    collectionStartDate: timestamp("collection_start_date"),
    collectionEndDate: timestamp("collection_end_date"),
    lastProcessedAt: timestamp("last_processed_at"),

    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [
    index("datasets_category_idx").on(t.category),
    index("datasets_status_idx").on(t.status),
    index("datasets_access_level_idx").on(t.accessLevel),
    index("datasets_creator_idx").on(t.creatorId),
    index("datasets_project_idx").on(t.projectId),
  ]
);

// Dataset access permissions
export const datasetPermissions = pgTable(
  "dataset_permissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    datasetId: uuid("dataset_id")
      .notNull()
      .references(() => datasets.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    canView: boolean("can_view").default(false).notNull(),
    canDownload: boolean("can_download").default(false).notNull(),
    canEdit: boolean("can_edit").default(false).notNull(),
    grantedBy: uuid("granted_by").references(() => users.id),
    grantedAt: timestamp("granted_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at"),
  },
  (t) => [
    index("dataset_permissions_dataset_idx").on(t.datasetId),
    index("dataset_permissions_user_idx").on(t.userId),
  ]
);

export const files = pgTable(
  "files",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    filename: varchar("filename", { length: 255 }).notNull(),
    originalName: varchar("original_name", { length: 255 }).notNull(),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    size: integer("size").notNull(), // in bytes
    path: text("path").notNull(),
    url: text("url"),

    // References - what this file belongs to
    projectId: uuid("project_id").references(() => projects.id),
    publicationId: uuid("publication_id").references(() => publications.id),
    datasetId: uuid("dataset_id").references(() => datasets.id),
    researcherId: uuid("researcher_id").references(() => researchers.id),

    // Metadata
    uploadedBy: uuid("uploaded_by").references(() => users.id),
    isPublic: boolean("is_public").default(false).notNull(),

    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("files_project_idx").on(t.projectId),
    index("files_publication_idx").on(t.publicationId),
    index("files_dataset_idx").on(t.datasetId),
    index("files_uploader_idx").on(t.uploadedBy),
  ]
);

// =====================
// ADDITIONAL JUNCTION TABLES
// =====================

// Project publications relationship
export const projectPublications = pgTable(
  "project_publications",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    publicationId: uuid("publication_id")
      .notNull()
      .references(() => publications.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.projectId, t.publicationId] }),
    index("project_pubs_project_idx").on(t.projectId),
  ]
);

// Project datasets relationship
export const projectDatasets = pgTable(
  "project_datasets",
  {
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    datasetId: uuid("dataset_id")
      .notNull()
      .references(() => datasets.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.projectId, t.datasetId] }),
    index("project_datasets_project_idx").on(t.projectId),
  ]
);

// Publication datasets relationship (datasets used in publications)
export const publicationDatasets = pgTable(
  "publication_datasets",
  {
    publicationId: uuid("publication_id")
      .notNull()
      .references(() => publications.id, { onDelete: "cascade" }),
    datasetId: uuid("dataset_id")
      .notNull()
      .references(() => datasets.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.publicationId, t.datasetId] }),
    index("pub_datasets_pub_idx").on(t.publicationId),
  ]
);

// =====================
// EXPORT CONFIGURATIONS
// =====================

// For different export/report configurations
export const exportConfigs = pgTable(
  "export_configs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    type: varchar("type", { length: 50 }).notNull(), // "pdf", "csv", "json", "excel"

    // What to export
    entityType: varchar("entity_type", { length: 50 }).notNull(), // "projects", "publications", "datasets"

    // Configuration
    config: jsonb("config").notNull(), // JSON configuration for export

    // Access
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    isPublic: boolean("is_public").default(false).notNull(),

    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [
    index("export_configs_type_idx").on(t.type),
    index("export_configs_entity_idx").on(t.entityType),
    index("export_configs_creator_idx").on(t.createdBy),
  ]
);
