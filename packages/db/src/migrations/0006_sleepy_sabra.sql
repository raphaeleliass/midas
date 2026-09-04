CREATE TABLE "monthly_goal" (
	"user_id" text PRIMARY KEY NOT NULL,
	"expense_target_cents" integer,
	"income_target_cents" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "monthly_goal_expense_target_positive" CHECK ("monthly_goal"."expense_target_cents" is null or "monthly_goal"."expense_target_cents" > 0),
	CONSTRAINT "monthly_goal_income_target_positive" CHECK ("monthly_goal"."income_target_cents" is null or "monthly_goal"."income_target_cents" > 0)
);
--> statement-breakpoint
ALTER TABLE "monthly_goal" ADD CONSTRAINT "monthly_goal_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
