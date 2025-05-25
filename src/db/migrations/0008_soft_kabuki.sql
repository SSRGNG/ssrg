DROP INDEX "methodologies_title_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "methodologies_unique_title" ON "methodologies" USING btree (lower("title"));