ALTER TABLE "partner_projects" RENAME TO "partner_projs";--> statement-breakpoint
ALTER TABLE "project_categories" RENAME TO "proj_areas";--> statement-breakpoint
ALTER TABLE "publication_authors" RENAME TO "pub_authors";--> statement-breakpoint
ALTER TABLE "research_area_publications" RENAME TO "area_pubs";--> statement-breakpoint
ALTER TABLE "research_area_findings" RENAME TO "area_findings";--> statement-breakpoint
ALTER TABLE "research_area_methods" RENAME TO "area_methods";--> statement-breakpoint
ALTER TABLE "research_area_questions" RENAME TO "area_questions";--> statement-breakpoint
ALTER TABLE "research_areas" RENAME TO "areas";--> statement-breakpoint
ALTER TABLE "research_frameworks" RENAME TO "frameworks";--> statement-breakpoint
ALTER TABLE "research_methodologies" RENAME TO "methodologies";--> statement-breakpoint
ALTER TABLE "partner_projs" RENAME COLUMN "project_id" TO "proj_id";--> statement-breakpoint
ALTER TABLE "proj_areas" RENAME COLUMN "project_id" TO "proj_id";--> statement-breakpoint
ALTER TABLE "pub_authors" RENAME COLUMN "publication_id" TO "pub_id";--> statement-breakpoint
ALTER TABLE "area_pubs" RENAME COLUMN "research_area_id" TO "area_id";--> statement-breakpoint
ALTER TABLE "area_pubs" RENAME COLUMN "publication_id" TO "pub_id";--> statement-breakpoint
ALTER TABLE "area_findings" RENAME COLUMN "research_area_id" TO "area_id";--> statement-breakpoint
ALTER TABLE "area_methods" RENAME COLUMN "research_area_id" TO "area_id";--> statement-breakpoint
ALTER TABLE "area_questions" RENAME COLUMN "research_area_id" TO "area_id";--> statement-breakpoint
ALTER TABLE "frameworks" DROP CONSTRAINT "research_frameworks_href_unique";--> statement-breakpoint
ALTER TABLE "partner_projs" DROP CONSTRAINT "partner_projects_partner_id_partners_id_fk";
--> statement-breakpoint
ALTER TABLE "partner_projs" DROP CONSTRAINT "partner_projects_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "proj_areas" DROP CONSTRAINT "project_categories_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "proj_areas" DROP CONSTRAINT "project_categories_area_id_research_areas_id_fk";
--> statement-breakpoint
ALTER TABLE "pub_authors" DROP CONSTRAINT "publication_authors_publication_id_publications_id_fk";
--> statement-breakpoint
ALTER TABLE "pub_authors" DROP CONSTRAINT "publication_authors_researcher_id_researchers_id_fk";
--> statement-breakpoint
ALTER TABLE "area_pubs" DROP CONSTRAINT "research_area_publications_research_area_id_research_areas_id_fk";
--> statement-breakpoint
ALTER TABLE "area_pubs" DROP CONSTRAINT "research_area_publications_publication_id_publications_id_fk";
--> statement-breakpoint
ALTER TABLE "researcher_areas" DROP CONSTRAINT "researcher_areas_area_id_research_areas_id_fk";
--> statement-breakpoint
ALTER TABLE "area_findings" DROP CONSTRAINT "research_area_findings_research_area_id_research_areas_id_fk";
--> statement-breakpoint
ALTER TABLE "area_methods" DROP CONSTRAINT "research_area_methods_research_area_id_research_areas_id_fk";
--> statement-breakpoint
ALTER TABLE "area_questions" DROP CONSTRAINT "research_area_questions_research_area_id_research_areas_id_fk";
--> statement-breakpoint
DROP INDEX "partner_projects_project_idx";--> statement-breakpoint
DROP INDEX "project_categories_area_idx";--> statement-breakpoint
DROP INDEX "research_area_findings_order_idx";--> statement-breakpoint
DROP INDEX "research_area_methods_order_idx";--> statement-breakpoint
DROP INDEX "research_area_questions_order_idx";--> statement-breakpoint
DROP INDEX "research_frameworks_order_idx";--> statement-breakpoint
DROP INDEX "research_frameworks_lower_title_idx";--> statement-breakpoint
DROP INDEX "research_frameworks_title_unique";--> statement-breakpoint
DROP INDEX "research_methodologies_order_idx";--> statement-breakpoint
DROP INDEX "research_methodologies_title_unique";--> statement-breakpoint
DROP INDEX "pub_author_order_idx";--> statement-breakpoint
DROP INDEX "area_pub_order_idx";--> statement-breakpoint
ALTER TABLE "partner_projs" DROP CONSTRAINT "partner_projects_partner_id_project_id_pk";--> statement-breakpoint
ALTER TABLE "proj_areas" DROP CONSTRAINT "project_categories_project_id_area_id_pk";--> statement-breakpoint
ALTER TABLE "pub_authors" DROP CONSTRAINT "publication_authors_publication_id_researcher_id_pk";--> statement-breakpoint
ALTER TABLE "area_pubs" DROP CONSTRAINT "research_area_publications_research_area_id_publication_id_pk";--> statement-breakpoint
ALTER TABLE "partner_projs" ADD CONSTRAINT "partner_projs_partner_id_proj_id_pk" PRIMARY KEY("partner_id","proj_id");--> statement-breakpoint
ALTER TABLE "proj_areas" ADD CONSTRAINT "proj_areas_proj_id_area_id_pk" PRIMARY KEY("proj_id","area_id");--> statement-breakpoint
ALTER TABLE "pub_authors" ADD CONSTRAINT "pub_authors_pub_id_researcher_id_pk" PRIMARY KEY("pub_id","researcher_id");--> statement-breakpoint
ALTER TABLE "area_pubs" ADD CONSTRAINT "area_pubs_area_id_pub_id_pk" PRIMARY KEY("area_id","pub_id");--> statement-breakpoint
ALTER TABLE "partner_projs" ADD CONSTRAINT "partner_projs_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_projs" ADD CONSTRAINT "partner_projs_proj_id_projects_id_fk" FOREIGN KEY ("proj_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proj_areas" ADD CONSTRAINT "proj_areas_proj_id_projects_id_fk" FOREIGN KEY ("proj_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proj_areas" ADD CONSTRAINT "proj_areas_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pub_authors" ADD CONSTRAINT "pub_authors_pub_id_publications_id_fk" FOREIGN KEY ("pub_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pub_authors" ADD CONSTRAINT "pub_authors_researcher_id_researchers_id_fk" FOREIGN KEY ("researcher_id") REFERENCES "public"."researchers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "area_pubs" ADD CONSTRAINT "area_pubs_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "area_pubs" ADD CONSTRAINT "area_pubs_pub_id_publications_id_fk" FOREIGN KEY ("pub_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "researcher_areas" ADD CONSTRAINT "researcher_areas_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "area_findings" ADD CONSTRAINT "area_findings_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "area_methods" ADD CONSTRAINT "area_methods_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "area_questions" ADD CONSTRAINT "area_questions_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "partner_projs_proj_idx" ON "partner_projs" USING btree ("proj_id");--> statement-breakpoint
CREATE INDEX "proj_areas_area_idx" ON "proj_areas" USING btree ("area_id");--> statement-breakpoint
CREATE INDEX "area_findings_order_idx" ON "area_findings" USING btree ("area_id","order");--> statement-breakpoint
CREATE INDEX "area_methods_order_idx" ON "area_methods" USING btree ("area_id","order");--> statement-breakpoint
CREATE INDEX "area_questions_order_idx" ON "area_questions" USING btree ("area_id","order");--> statement-breakpoint
CREATE INDEX "frameworks_order_idx" ON "frameworks" USING btree ("order");--> statement-breakpoint
CREATE INDEX "frameworks_lower_title_idx" ON "frameworks" USING btree (lower("title"));--> statement-breakpoint
CREATE UNIQUE INDEX "frameworks_title_unique" ON "frameworks" USING btree (lower("title"));--> statement-breakpoint
CREATE INDEX "methodologies_order_idx" ON "methodologies" USING btree ("order");--> statement-breakpoint
CREATE UNIQUE INDEX "methodologies_title_unique" ON "methodologies" USING btree (lower("title"));--> statement-breakpoint
CREATE INDEX "pub_author_order_idx" ON "pub_authors" USING btree ("pub_id","order");--> statement-breakpoint
CREATE INDEX "area_pub_order_idx" ON "area_pubs" USING btree ("area_id","order");--> statement-breakpoint
ALTER TABLE "frameworks" ADD CONSTRAINT "frameworks_href_unique" UNIQUE("href");--> statement-breakpoint
ALTER TABLE "methodologies" ADD CONSTRAINT "methodologies_title_unique" UNIQUE("title");