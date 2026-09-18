import assert from "node:assert/strict";
import { updateGoalSchema } from "./goals.schema.js";

assert.equal(
	updateGoalSchema.safeParse({ expenseTargetCents: 100 }).success,
	true,
);
assert.equal(
	updateGoalSchema.safeParse({ incomeTargetCents: null }).success,
	true,
);
assert.equal(
	updateGoalSchema.safeParse({ expenseTargetCents: 0 }).success,
	false,
);
assert.equal(updateGoalSchema.safeParse({}).success, false);
