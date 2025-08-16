ALTER TABLE "user" ADD COLUMN "slug" text;--> statement-breakpoint
CREATE INDEX "users_slug_idx" ON "user" USING btree ("slug");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_slug_unique" UNIQUE("slug");