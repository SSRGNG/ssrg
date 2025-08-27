CREATE TABLE "award_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scholarship_id" uuid,
	"recipient_id" uuid,
	"event_id" uuid,
	"media_type" varchar(20) DEFAULT 'image' NOT NULL,
	"media_url" text NOT NULL,
	"caption" text,
	"alt_text" text,
	"is_public" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "valid_media_parent" CHECK ("award_media"."scholarship_id" IS NOT NULL OR "award_media"."recipient_id" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "recipients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"scholarship_id" uuid NOT NULL,
	"name" text NOT NULL,
	"affiliation" text,
	"year" integer NOT NULL,
	"amount" text,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "scholarships" ADD COLUMN "type" varchar(30) DEFAULT 'other' NOT NULL;--> statement-breakpoint
ALTER TABLE "scholarships" ADD COLUMN "category" varchar(50) DEFAULT 'student' NOT NULL;--> statement-breakpoint
ALTER TABLE "scholarships" ADD COLUMN "recurring" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "scholarships" ADD COLUMN "max_recipients" integer;--> statement-breakpoint
ALTER TABLE "award_media" ADD CONSTRAINT "award_media_scholarship_id_scholarships_id_fk" FOREIGN KEY ("scholarship_id") REFERENCES "public"."scholarships"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "award_media" ADD CONSTRAINT "award_media_recipient_id_recipients_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."recipients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "award_media" ADD CONSTRAINT "award_media_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipients" ADD CONSTRAINT "recipients_scholarship_id_scholarships_id_fk" FOREIGN KEY ("scholarship_id") REFERENCES "public"."scholarships"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "award_media_scholarship_idx" ON "award_media" USING btree ("scholarship_id");--> statement-breakpoint
CREATE INDEX "award_media_recipient_idx" ON "award_media" USING btree ("recipient_id");--> statement-breakpoint
CREATE INDEX "award_media_event_idx" ON "award_media" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "award_media_type_idx" ON "award_media" USING btree ("media_type");--> statement-breakpoint
CREATE INDEX "award_media_public_idx" ON "award_media" USING btree ("is_public");--> statement-breakpoint
CREATE INDEX "recipients_scholarship_idx" ON "recipients" USING btree ("scholarship_id");--> statement-breakpoint
CREATE INDEX "recipients_year_idx" ON "recipients" USING btree ("year");--> statement-breakpoint
CREATE INDEX "recipients_name_idx" ON "recipients" USING btree ("name");--> statement-breakpoint
CREATE INDEX "scholarships_type_idx" ON "scholarships" USING btree ("type");--> statement-breakpoint
CREATE INDEX "scholarships_category_idx" ON "scholarships" USING btree ("category");