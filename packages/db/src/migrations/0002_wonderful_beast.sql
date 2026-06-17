CREATE TABLE "subscription" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"status" text DEFAULT 'expired' NOT NULL,
	"abacate_checkout_id" text,
	"abacate_billing_id" text,
	"current_period_end" timestamp with time zone,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscription_userId_unique" UNIQUE("user_id")
);
--> statement-breakpoint
ALTER TABLE "entry_category" ALTER COLUMN "entry_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "entry_category" ALTER COLUMN "category_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "subscription_userId_idx" ON "subscription" USING btree ("user_id");