DROP INDEX "award_media_type_idx";--> statement-breakpoint
ALTER TABLE "award_media" ADD COLUMN "file_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "award_media" ADD CONSTRAINT "award_media_file_id_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "award_media_file_idx" ON "award_media" USING btree ("file_id");--> statement-breakpoint
ALTER TABLE "award_media" DROP COLUMN "media_type";--> statement-breakpoint
ALTER TABLE "award_media" DROP COLUMN "media_url";--> statement-breakpoint
ALTER TABLE "award_media" DROP COLUMN "alt_text";