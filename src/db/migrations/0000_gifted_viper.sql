CREATE TABLE "account" (
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE "authenticator" (
	"credentialID" text NOT NULL,
	"userId" uuid NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_userId_credentialID_pk" PRIMARY KEY("userId","credentialID"),
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"affiliation" text,
	"emailVerified" timestamp,
	"image" text,
	"password" text NOT NULL,
	"role" varchar(20) DEFAULT 'member' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "valid_email" CHECK ("user"."email" ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$')
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "event_presenters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"researcher_id" uuid,
	"external_name" text,
	"external_affiliation" text,
	"role" varchar(20) NOT NULL,
	"order" integer NOT NULL,
	CONSTRAINT "valid_presenter" CHECK ("event_presenters"."researcher_id" IS NOT NULL OR "event_presenters"."external_name" IS NOT NULL)
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"event_type" varchar(50) NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"location" text,
	"virtual_link" text,
	"image" text,
	"registration_link" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "valid_date_range" CHECK ("events"."end_date" IS NULL OR "events"."start_date" <= "events"."end_date")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"referred_by" uuid,
	"communication" boolean DEFAULT false NOT NULL,
	"newsletter" boolean DEFAULT false NOT NULL,
	"marketing" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "notifications_email_unique" UNIQUE("email"),
	CONSTRAINT "notifications_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "partner_projects" (
	"partner_id" uuid NOT NULL,
	"project_id" uuid NOT NULL,
	CONSTRAINT "partner_projects_partner_id_project_id_pk" PRIMARY KEY("partner_id","project_id")
);
--> statement-breakpoint
CREATE TABLE "project_categories" (
	"project_id" uuid NOT NULL,
	"area_id" uuid NOT NULL,
	CONSTRAINT "project_categories_project_id_area_id_pk" PRIMARY KEY("project_id","area_id")
);
--> statement-breakpoint
CREATE TABLE "publication_authors" (
	"publication_id" uuid NOT NULL,
	"researcher_id" uuid NOT NULL,
	"order" integer NOT NULL,
	"contribution" text,
	CONSTRAINT "publication_authors_publication_id_researcher_id_pk" PRIMARY KEY("publication_id","researcher_id")
);
--> statement-breakpoint
CREATE TABLE "research_area_publications" (
	"research_area_id" uuid NOT NULL,
	"publication_id" uuid NOT NULL,
	"order" integer NOT NULL,
	CONSTRAINT "research_area_publications_research_area_id_publication_id_pk" PRIMARY KEY("research_area_id","publication_id")
);
--> statement-breakpoint
CREATE TABLE "researcher_areas" (
	"researcher_id" uuid NOT NULL,
	"area_id" uuid NOT NULL,
	CONSTRAINT "researcher_areas_researcher_id_area_id_pk" PRIMARY KEY("researcher_id","area_id")
);
--> statement-breakpoint
CREATE TABLE "partners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"logo" text,
	"website" text,
	"description" text NOT NULL,
	"partner_type" varchar(50) NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scholarships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"eligibility" text NOT NULL,
	"amount" text,
	"deadline" timestamp,
	"application_link" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"period" varchar(100) NOT NULL,
	"lead_researcher_id" uuid NOT NULL,
	"location" varchar(255) NOT NULL,
	"href" text NOT NULL,
	"image" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "publications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"abstract" text,
	"link" varchar(500),
	"creator_id" uuid,
	"publication_date" timestamp,
	"journal" varchar(255),
	"volume" varchar(50),
	"issue" varchar(50),
	"pages" varchar(50),
	"doi" varchar(255),
	"isbn" varchar(20),
	"city" varchar(255),
	"publisher" varchar(255),
	"edited_book" boolean,
	"conference_name" varchar(255),
	"conference_location" varchar(255),
	"conference_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "valid_doi" CHECK ("publications"."doi" IS NULL OR "publications"."doi" ~* '^10\.[0-9]{4,}(\.[0-9]+)*\/[-\._\(\)\[\]:;a-zA-Z0-9]+$'),
	CONSTRAINT "valid_isbn" CHECK ("publications"."isbn" IS NULL OR "publications"."isbn" ~* '^(97(8|9)-?)?d{9}(d|X)$')
);
--> statement-breakpoint
CREATE TABLE "research_area_findings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"research_area_id" uuid NOT NULL,
	"finding" text NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_area_methods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"research_area_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_area_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"research_area_id" uuid NOT NULL,
	"question" text NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_areas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"icon" varchar(50) NOT NULL,
	"image" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"detail" text NOT NULL,
	"href" varchar(100) NOT NULL,
	"link_text" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_frameworks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"link_text" varchar(100) NOT NULL,
	"href" varchar(100) NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "research_methodologies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "researcher_education" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"researcher_id" uuid NOT NULL,
	"education" varchar(255) NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "researcher_expertise" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"researcher_id" uuid NOT NULL,
	"expertise" varchar(255) NOT NULL,
	"order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "researchers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" text NOT NULL,
	"bio" text NOT NULL,
	"x" varchar(50),
	"orcid" varchar(20),
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "researchers_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "valid_orcid" CHECK ("researchers"."orcid" IS NULL OR "researchers"."orcid" ~* '^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{3}[0-9X]$')
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_presenters" ADD CONSTRAINT "event_presenters_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_presenters" ADD CONSTRAINT "event_presenters_researcher_id_researchers_id_fk" FOREIGN KEY ("researcher_id") REFERENCES "public"."researchers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_referred_by_user_id_fk" FOREIGN KEY ("referred_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_projects" ADD CONSTRAINT "partner_projects_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_projects" ADD CONSTRAINT "partner_projects_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_categories" ADD CONSTRAINT "project_categories_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_categories" ADD CONSTRAINT "project_categories_area_id_research_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."research_areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_authors" ADD CONSTRAINT "publication_authors_publication_id_publications_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publication_authors" ADD CONSTRAINT "publication_authors_researcher_id_researchers_id_fk" FOREIGN KEY ("researcher_id") REFERENCES "public"."researchers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_area_publications" ADD CONSTRAINT "research_area_publications_research_area_id_research_areas_id_fk" FOREIGN KEY ("research_area_id") REFERENCES "public"."research_areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_area_publications" ADD CONSTRAINT "research_area_publications_publication_id_publications_id_fk" FOREIGN KEY ("publication_id") REFERENCES "public"."publications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "researcher_areas" ADD CONSTRAINT "researcher_areas_researcher_id_researchers_id_fk" FOREIGN KEY ("researcher_id") REFERENCES "public"."researchers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "researcher_areas" ADD CONSTRAINT "researcher_areas_area_id_research_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."research_areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_lead_researcher_id_researchers_id_fk" FOREIGN KEY ("lead_researcher_id") REFERENCES "public"."researchers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publications" ADD CONSTRAINT "publications_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_area_findings" ADD CONSTRAINT "research_area_findings_research_area_id_research_areas_id_fk" FOREIGN KEY ("research_area_id") REFERENCES "public"."research_areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_area_methods" ADD CONSTRAINT "research_area_methods_research_area_id_research_areas_id_fk" FOREIGN KEY ("research_area_id") REFERENCES "public"."research_areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_area_questions" ADD CONSTRAINT "research_area_questions_research_area_id_research_areas_id_fk" FOREIGN KEY ("research_area_id") REFERENCES "public"."research_areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "researcher_education" ADD CONSTRAINT "researcher_education_researcher_id_researchers_id_fk" FOREIGN KEY ("researcher_id") REFERENCES "public"."researchers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "researcher_expertise" ADD CONSTRAINT "researcher_expertise_researcher_id_researchers_id_fk" FOREIGN KEY ("researcher_id") REFERENCES "public"."researchers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "researchers" ADD CONSTRAINT "researchers_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_user_id_idx" ON "account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "authenticators_user_id_idx" ON "authenticator" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "session" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "user" USING btree ("role");--> statement-breakpoint
CREATE INDEX "event_presenters_event_idx" ON "event_presenters" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "event_presenters_researcher_idx" ON "event_presenters" USING btree ("researcher_id");--> statement-breakpoint
CREATE INDEX "events_start_date_idx" ON "events" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "events_type_idx" ON "events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "partner_projects_project_idx" ON "partner_projects" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "project_categories_area_idx" ON "project_categories" USING btree ("area_id");--> statement-breakpoint
CREATE INDEX "pub_author_order_idx" ON "publication_authors" USING btree ("publication_id","order");--> statement-breakpoint
CREATE INDEX "area_pub_order_idx" ON "research_area_publications" USING btree ("research_area_id","order");--> statement-breakpoint
CREATE INDEX "researcher_areas_area_idx" ON "researcher_areas" USING btree ("area_id");--> statement-breakpoint
CREATE INDEX "partners_featured_idx" ON "partners" USING btree ("featured");--> statement-breakpoint
CREATE INDEX "partners_type_idx" ON "partners" USING btree ("partner_type");--> statement-breakpoint
CREATE INDEX "scholarships_active_idx" ON "scholarships" USING btree ("active");--> statement-breakpoint
CREATE INDEX "scholarships_deadline_idx" ON "scholarships" USING btree ("deadline");--> statement-breakpoint
CREATE INDEX "projects_lead_researcher_idx" ON "projects" USING btree ("lead_researcher_id");--> statement-breakpoint
CREATE INDEX "projects_title_idx" ON "projects" USING btree ("title");--> statement-breakpoint
CREATE INDEX "publication_date_idx" ON "publications" USING btree ("publication_date");--> statement-breakpoint
CREATE INDEX "publication_doi_idx" ON "publications" USING btree ("doi");--> statement-breakpoint
CREATE INDEX "research_area_findings_order_idx" ON "research_area_findings" USING btree ("research_area_id","order");--> statement-breakpoint
CREATE INDEX "research_area_methods_order_idx" ON "research_area_methods" USING btree ("research_area_id","order");--> statement-breakpoint
CREATE INDEX "research_area_questions_order_idx" ON "research_area_questions" USING btree ("research_area_id","order");--> statement-breakpoint
CREATE INDEX "research_frameworks_order_idx" ON "research_frameworks" USING btree ("order");--> statement-breakpoint
CREATE INDEX "research_methodologies_order_idx" ON "research_methodologies" USING btree ("order");--> statement-breakpoint
CREATE INDEX "researcher_education_order_idx" ON "researcher_education" USING btree ("researcher_id","order");--> statement-breakpoint
CREATE INDEX "researcher_expertise_order_idx" ON "researcher_expertise" USING btree ("researcher_id","order");--> statement-breakpoint
CREATE INDEX "researchers_featured_idx" ON "researchers" USING btree ("featured");