ALTER TABLE "publications" ADD COLUMN "type" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "publications" ADD COLUMN "venue" varchar(255);--> statement-breakpoint
ALTER TABLE "publications" ADD COLUMN "metadata" jsonb;--> statement-breakpoint
ALTER TABLE "publications" ADD COLUMN "citation_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "publications" ADD COLUMN "last_citation_update" timestamp;--> statement-breakpoint
CREATE INDEX "publication_type_idx" ON "publications" USING btree ("type");--> statement-breakpoint
CREATE INDEX "citation_count_idx" ON "publications" USING btree ("citation_count");--> statement-breakpoint
CREATE INDEX "venue_idx" ON "publications" USING btree ("venue");--> statement-breakpoint
ALTER TABLE "publications" DROP COLUMN "journal";--> statement-breakpoint
ALTER TABLE "publications" DROP COLUMN "volume";--> statement-breakpoint
ALTER TABLE "publications" DROP COLUMN "issue";--> statement-breakpoint
ALTER TABLE "publications" DROP COLUMN "pages";--> statement-breakpoint
ALTER TABLE "publications" DROP COLUMN "isbn";--> statement-breakpoint
ALTER TABLE "publications" DROP COLUMN "city";--> statement-breakpoint
ALTER TABLE "publications" DROP COLUMN "publisher";--> statement-breakpoint
ALTER TABLE "publications" DROP COLUMN "edited_book";--> statement-breakpoint
ALTER TABLE "publications" DROP COLUMN "conference_name";--> statement-breakpoint
ALTER TABLE "publications" DROP COLUMN "conference_location";--> statement-breakpoint
ALTER TABLE "publications" DROP COLUMN "conference_date";--> statement-breakpoint
ALTER TABLE "publications" ADD CONSTRAINT "main_types_need_venue" CHECK ("publications"."type" NOT IN ('journal_article', 'conference_paper') OR "publications"."venue" IS NOT NULL);--> statement-breakpoint
ALTER TABLE "publications" ADD CONSTRAINT "valid_url" CHECK ("publications"."link" IS NULL OR "publications"."link" ~* '^https?://');