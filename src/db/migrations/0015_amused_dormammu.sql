ALTER TABLE "publications" RENAME TO "pubs";--> statement-breakpoint
ALTER TABLE "pubs" DROP CONSTRAINT "main_types_need_venue";--> statement-breakpoint
ALTER TABLE "pubs" DROP CONSTRAINT "valid_url";--> statement-breakpoint
ALTER TABLE "pub_authors" DROP CONSTRAINT "pub_authors_pub_id_publications_id_fk";
--> statement-breakpoint
ALTER TABLE "area_pubs" DROP CONSTRAINT "area_pubs_pub_id_publications_id_fk";
--> statement-breakpoint
ALTER TABLE "pubs" DROP CONSTRAINT "publications_creator_id_user_id_fk";
--> statement-breakpoint
DROP INDEX "publication_type_idx";--> statement-breakpoint
DROP INDEX "publication_date_idx";--> statement-breakpoint
DROP INDEX "publication_doi_idx";--> statement-breakpoint
ALTER TABLE "pub_authors" ADD CONSTRAINT "pub_authors_pub_id_pubs_id_fk" FOREIGN KEY ("pub_id") REFERENCES "public"."pubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "area_pubs" ADD CONSTRAINT "area_pubs_pub_id_pubs_id_fk" FOREIGN KEY ("pub_id") REFERENCES "public"."pubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pubs" ADD CONSTRAINT "pubs_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pub_type_idx" ON "pubs" USING btree ("type");--> statement-breakpoint
CREATE INDEX "pub_date_idx" ON "pubs" USING btree ("publication_date");--> statement-breakpoint
CREATE INDEX "pub_doi_idx" ON "pubs" USING btree ("doi");--> statement-breakpoint
ALTER TABLE "pubs" ADD CONSTRAINT "main_types_need_venue" CHECK ("pubs"."type" NOT IN ('journal_article', 'conference_paper') OR "pubs"."venue" IS NOT NULL);--> statement-breakpoint
ALTER TABLE "pubs" ADD CONSTRAINT "valid_url" CHECK ("pubs"."link" IS NULL OR "pubs"."link" ~* '^https?://');