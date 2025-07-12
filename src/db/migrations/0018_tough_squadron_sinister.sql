CREATE TABLE "video_researchers" (
	"video_id" uuid NOT NULL,
	"researcher_id" uuid NOT NULL,
	"role" varchar(100),
	"order" integer DEFAULT 0,
	CONSTRAINT "video_researchers_video_id_researcher_id_pk" PRIMARY KEY("video_id","researcher_id")
);
--> statement-breakpoint
CREATE TABLE "videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"youtube_url" varchar(500) NOT NULL,
	"youtube_id" varchar(50) NOT NULL,
	"published_at" timestamp NOT NULL,
	"recorded_at" timestamp,
	"category" varchar(100),
	"series" varchar(255),
	"creator_id" uuid,
	"metadata" jsonb,
	"view_count" integer DEFAULT 0,
	"last_metrics_update" timestamp,
	"is_public" boolean DEFAULT true NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "videos_youtube_id_unique" UNIQUE("youtube_id")
);
--> statement-breakpoint
ALTER TABLE "video_researchers" ADD CONSTRAINT "video_researchers_video_id_videos_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."videos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "video_researchers" ADD CONSTRAINT "video_researchers_researcher_id_researchers_id_fk" FOREIGN KEY ("researcher_id") REFERENCES "public"."researchers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "videos" ADD CONSTRAINT "videos_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "video_researchers_video_idx" ON "video_researchers" USING btree ("video_id");--> statement-breakpoint
CREATE INDEX "video_researchers_researcher_idx" ON "video_researchers" USING btree ("researcher_id");--> statement-breakpoint
CREATE INDEX "videos_youtube_id_idx" ON "videos" USING btree ("youtube_id");--> statement-breakpoint
CREATE INDEX "videos_published_at_idx" ON "videos" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "videos_category_idx" ON "videos" USING btree ("category");--> statement-breakpoint
CREATE INDEX "videos_series_idx" ON "videos" USING btree ("series");--> statement-breakpoint
CREATE INDEX "videos_creator_idx" ON "videos" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "videos_featured_idx" ON "videos" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "videos_public_idx" ON "videos" USING btree ("is_public");