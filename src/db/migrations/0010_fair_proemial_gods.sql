DROP INDEX "frameworks_title_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "frameworks_unique_title" ON "frameworks" USING btree (lower("title"));