CREATE INDEX "authors_affiliation_idx" ON "authors" USING btree ("affiliation");--> statement-breakpoint
CREATE INDEX "researchers_orcid_idx" ON "researchers" USING btree ("orcid");