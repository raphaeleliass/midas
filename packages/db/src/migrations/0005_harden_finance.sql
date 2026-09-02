DELETE FROM "entry_category" AS ec
USING "entry" AS e, "category" AS c
WHERE ec."entry_id" = e."id"
	AND ec."category_id" = c."id"
	AND c."user_id" IS NOT NULL
	AND c."user_id" <> e."user_id";
--> statement-breakpoint
ALTER TABLE "entry"
	ADD CONSTRAINT "entry_amount_cents_positive"
	CHECK ("amount_cents" > 0) NOT VALID;
--> statement-breakpoint
ALTER TABLE "entry"
	ADD CONSTRAINT "entry_type_allowed"
	CHECK ("type" IN ('expense', 'income')) NOT VALID;
