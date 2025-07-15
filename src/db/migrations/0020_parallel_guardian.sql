CREATE TABLE "video_authors" (
	"video_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"role" varchar(20),
	"order" integer DEFAULT 0,
	CONSTRAINT "video_authors_video_id_author_id_pk" PRIMARY KEY("video_id","author_id")
);
--> statement-breakpoint
DROP TABLE "video_researchers" CASCADE;--> statement-breakpoint
ALTER TABLE "video_authors" ADD CONSTRAINT "video_authors_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_authors" ADD CONSTRAINT "video_authors_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "video_authors_video_idx" ON "video_authors" USING btree ("video_id");--> statement-breakpoint
CREATE INDEX "video_authors_author_idx" ON "video_authors" USING btree ("author_id");