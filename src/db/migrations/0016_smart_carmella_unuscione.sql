ALTER TABLE "pubs" RENAME TO "publications";--> statement-breakpoint
ALTER TABLE "publications" DROP CONSTRAINT "main_types_need_venue";--> statement-breakpoint
ALTER TABLE "publications" DROP CONSTRAINT "valid_url";--> statement-breakpoint
ALTER TABLE "pub_authors" DROP CONSTRAINT "pub_authors_pub_id_pubs_id_fk";
--> statement-breakpoint
ALTER TABLE "area_pubs" DROP CONSTRAINT "area_pubs_pub_id_pubs_id_fk";
--> statement-breakpoint
ALTER TABLE "publications" DROP CONSTRAINT "pubs_creator_id_user_id_fk";
--> statement-breakpoint
DROP INDEX "pub_type_idx";--> statement-breakpoint
DROP INDEX "pub_date_idx";--> statement-breakpoint
DROP INDEX "pub_doi_idx";--> statement-breakpoint
ALTER TABLE "pub_authors" ADD CONSTRAINT "pub_authors_pub_id_publications_id_fk" FOREIGN KEY ("pub_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "area_pubs" ADD CONSTRAINT "area_pubs_pub_id_publications_id_fk" FOREIGN KEY ("pub_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publications" ADD CONSTRAINT "publications_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "publication_type_idx" ON "publications" USING btree ("type");--> statement-breakpoint
CREATE INDEX "publication_date_idx" ON "publications" USING btree ("publication_date");--> statement-breakpoint
CREATE INDEX "publication_doi_idx" ON "publications" USING btree ("doi");--> statement-breakpoint
ALTER TABLE "publications" ADD CONSTRAINT "main_types_need_venue" CHECK ("publications"."type" NOT IN ('journal_article', 'conference_paper') OR "publications"."venue" IS NOT NULL);--> statement-breakpoint
ALTER TABLE "publications" ADD CONSTRAINT "valid_url" CHECK ("publications"."link" IS NULL OR "publications"."link" ~* '^https?://');