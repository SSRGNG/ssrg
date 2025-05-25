DROP INDEX "research_methodologies_lower_title_idx";--> statement-breakpoint
DROP INDEX "research_methodologies_title_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "research_methodologies_title_unique" ON "research_methodologies" USING btree (lower("title"));