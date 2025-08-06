import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  decimal,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { researchers, users } from "@/db/schema";
import { ProjectPriority, ProjectStatus } from "@/types";

// Projects table
export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    shortDescription: text("short_description").notNull(),
    status: varchar("status", { length: 50 })
      .$type<ProjectStatus>()
      .default("planning")
      .notNull(),
    priority: varchar("priority", { length: 50 })
      .$type<ProjectPriority>()
      .default("medium")
      .notNull(),
    leadResearcherId: uuid("lead_researcher_id")
      .notNull()
      .references(() => researchers.id, { onDelete: "restrict" }),
    creatorId: uuid("creator_id").references(() => users.id, {
      onDelete: "set null",
    }),
    startDate: timestamp("start_date"),
    endDate: timestamp("end_date"),
    actualEndDate: timestamp("actual_end_date"),
    progressPercentage: integer("progress_percentage").default(0).notNull(),
    budgetTotal: decimal("budget_total", { precision: 12, scale: 2 }),
    budgetUsed: decimal("budget_used", { precision: 12, scale: 2 }).default(
      "0"
    ),
    isPublic: boolean("is_public").default(false).notNull(),
    featured: boolean("featured").default(false).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => [
    index("projects_lead_researcher_idx").on(t.leadResearcherId),
    index("projects_title_idx").on(t.title),
    index("projects_status_idx").on(t.status),
    index("projects_featured_idx").on(t.featured),
    check(
      "valid_progress",
      sql`${t.progressPercentage} >= 0 AND ${t.progressPercentage} <= 100`
    ),
    check("valid_budget", sql`${t.budgetUsed} <= ${t.budgetTotal}`),
  ]
);

// Project team members
export const projectMembers = pgTable(
  "project_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    researcherId: uuid("researcher_id")
      .notNull()
      .references(() => researchers.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 100 }).default("Researcher").notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    leftAt: timestamp("left_at"),
    isActive: boolean("is_active").default(true).notNull(),
  },
  (t) => [
    index("project_members_project_idx").on(t.projectId),
    index("project_members_researcher_idx").on(t.researcherId),
    // Add unique constraint to prevent duplicate active memberships
    index("project_members_unique_active")
      .on(t.projectId, t.researcherId)
      .where(sql`${t.isActive} = true`),
  ]
);

// Project milestones
export const projectMilestones = pgTable(
  "project_milestones",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    dueDate: timestamp("due_date"),
    completedDate: timestamp("completed_date"),
    isCompleted: boolean("is_completed").default(false).notNull(),
    order: integer("order").notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("project_milestones_project_idx").on(t.projectId),
    index("project_milestones_order_idx").on(t.projectId, t.order),
  ]
);
