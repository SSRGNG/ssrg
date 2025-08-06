CREATE TABLE "project_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"researcher_id" uuid NOT NULL,
	"role" varchar(100) DEFAULT 'Researcher' NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"left_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_milestones" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"due_date" timestamp,
	"completed_date" timestamp,
	"is_completed" boolean DEFAULT false NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "short_description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "status" varchar(50) DEFAULT 'planning' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "priority" varchar(50) DEFAULT 'medium' NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "creator_id" uuid;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "start_date" timestamp;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "end_date" timestamp;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "actual_end_date" timestamp;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "progress_percentage" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "budget_total" numeric(12, 2);--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "budget_used" numeric(12, 2) DEFAULT '0';--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "is_public" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "featured" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_researcher_id_researchers_id_fk" FOREIGN KEY ("researcher_id") REFERENCES "public"."researchers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_milestones" ADD CONSTRAINT "project_milestones_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "project_members_project_idx" ON "project_members" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "project_members_researcher_idx" ON "project_members" USING btree ("researcher_id");--> statement-breakpoint
CREATE INDEX "project_milestones_project_idx" ON "project_milestones" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "project_milestones_order_idx" ON "project_milestones" USING btree ("project_id","order");--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "projects_status_idx" ON "projects" USING btree ("status");--> statement-breakpoint
CREATE INDEX "projects_featured_idx" ON "projects" USING btree ("featured");--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "period";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "location";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "href";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "image";--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "valid_progress" CHECK ("projects"."progress_percentage" >= 0 AND "projects"."progress_percentage" <= 100);--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "valid_budget" CHECK ("projects"."budget_used" <= "projects"."budget_total");