CREATE TABLE "authors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"affiliation" text,
	"orcid" varchar(20),
	"researcher_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "valid_orcid" CHECK ("authors"."orcid" IS NULL OR "authors"."orcid" ~* '^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]$'),
	CONSTRAINT "valid_email" CHECK ("authors"."email" IS NULL OR "authors"."email" ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$')
);
--> statement-breakpoint
ALTER TABLE "pub_authors" RENAME COLUMN "researcher_id" TO "author_id";--> statement-breakpoint
ALTER TABLE "pub_authors" DROP CONSTRAINT "pub_authors_researcher_id_researchers_id_fk";
--> statement-breakpoint
ALTER TABLE "pub_authors" DROP CONSTRAINT "pub_authors_pub_id_researcher_id_pk";--> statement-breakpoint
ALTER TABLE "pub_authors" ADD CONSTRAINT "pub_authors_pub_id_author_id_pk" PRIMARY KEY("pub_id","author_id");--> statement-breakpoint
ALTER TABLE "pub_authors" ADD COLUMN "is_corresponding" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "authors" ADD CONSTRAINT "authors_researcher_id_researchers_id_fk" FOREIGN KEY ("researcher_id") REFERENCES "public"."researchers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "authors_name_idx" ON "authors" USING btree ("name");--> statement-breakpoint
CREATE INDEX "authors_email_idx" ON "authors" USING btree ("email");--> statement-breakpoint
CREATE INDEX "authors_orcid_idx" ON "authors" USING btree ("orcid");--> statement-breakpoint
CREATE INDEX "authors_researcher_idx" ON "authors" USING btree ("researcher_id");--> statement-breakpoint
ALTER TABLE "pub_authors" ADD CONSTRAINT "pub_authors_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "pub_author_corresponding_idx" ON "pub_authors" USING btree ("pub_id","is_corresponding");