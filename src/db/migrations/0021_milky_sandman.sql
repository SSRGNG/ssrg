CREATE TABLE "dataset_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dataset_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"can_view" boolean DEFAULT false NOT NULL,
	"can_download" boolean DEFAULT false NOT NULL,
	"can_edit" boolean DEFAULT false NOT NULL,
	"granted_by" uuid,
	"granted_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "datasets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"category" varchar(100) NOT NULL,
	"file_name" varchar(255),
	"file_size" integer,
	"file_type" varchar(50),
	"file_path" text,
	"version" varchar(20) DEFAULT '1.0' NOT NULL,
	"status" varchar(50) DEFAULT 'draft' NOT NULL,
	"access_level" varchar(50) DEFAULT 'private' NOT NULL,
	"creator_id" uuid,
	"project_id" uuid,
	"methodology" text,
	"data_schema" jsonb,
	"keywords" text,
	"collection_start_date" timestamp,
	"collection_end_date" timestamp,
	"last_processed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" varchar(255) NOT NULL,
	"original_name" varchar(255) NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"size" integer NOT NULL,
	"path" text NOT NULL,
	"url" text,
	"uploadthing_key" text,
	"uploadthing_url" text,
	"category" varchar(50) DEFAULT 'general' NOT NULL,
	"tags" text,
	"alt_text" text,
	"caption" text,
	"project_id" uuid,
	"publication_id" uuid,
	"dataset_id" uuid,
	"researcher_id" uuid,
	"uploaded_by" uuid,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "files_uploadthing_key_unique" UNIQUE("uploadthing_key")
);
--> statement-breakpoint
ALTER TABLE "dataset_permissions" ADD CONSTRAINT "dataset_permissions_dataset_id_datasets_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."datasets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dataset_permissions" ADD CONSTRAINT "dataset_permissions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dataset_permissions" ADD CONSTRAINT "dataset_permissions_granted_by_user_id_fk" FOREIGN KEY ("granted_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "datasets" ADD CONSTRAINT "datasets_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "datasets" ADD CONSTRAINT "datasets_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_publication_id_publications_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_dataset_id_datasets_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."datasets"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_researcher_id_researchers_id_fk" FOREIGN KEY ("researcher_id") REFERENCES "public"."researchers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_uploaded_by_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "dataset_permissions_dataset_idx" ON "dataset_permissions" USING btree ("dataset_id");--> statement-breakpoint
CREATE INDEX "dataset_permissions_user_idx" ON "dataset_permissions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "datasets_category_idx" ON "datasets" USING btree ("category");--> statement-breakpoint
CREATE INDEX "datasets_status_idx" ON "datasets" USING btree ("status");--> statement-breakpoint
CREATE INDEX "datasets_access_level_idx" ON "datasets" USING btree ("access_level");--> statement-breakpoint
CREATE INDEX "datasets_creator_idx" ON "datasets" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "datasets_project_idx" ON "datasets" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "files_project_idx" ON "files" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "files_publication_idx" ON "files" USING btree ("publication_id");--> statement-breakpoint
CREATE INDEX "files_dataset_idx" ON "files" USING btree ("dataset_id");--> statement-breakpoint
CREATE INDEX "files_uploader_idx" ON "files" USING btree ("uploaded_by");--> statement-breakpoint
CREATE INDEX "files_category_idx" ON "files" USING btree ("category");--> statement-breakpoint
CREATE INDEX "files_key_idx" ON "files" USING btree ("uploadthing_key");