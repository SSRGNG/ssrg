DROP INDEX "research_methodologies_title_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "research_methodologies_title_unique" ON "research_methodologies" USING btree ("title");