ALTER TABLE "entry" ADD COLUMN "status" text DEFAULT 'posted' NOT NULL;--> statement-breakpoint
CREATE INDEX "entry_userId_status_date_idx" ON "entry" USING btree ("user_id","status","date");--> statement-breakpoint
ALTER TABLE "entry" ADD CONSTRAINT "entry_status_allowed" CHECK ("entry"."status" in ('posted', 'scheduled'));