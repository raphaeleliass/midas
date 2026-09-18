import assert from "node:assert/strict";
import {
	capitalizeMonthNames,
	type Entry,
	filterEntriesByPeriod,
	getDateKey,
	getPreviousPeriodReference,
} from "./finance";

const entries = [
	{ id: "aug", date: "2026-08-31T15:00:00.000Z" },
	{ id: "sep", date: "2026-09-01T15:00:00.000Z" },
	{ id: "late", date: "2026-09-03T02:30:00.000Z" },
] as Entry[];

const september = new Date("2026-09-03T15:00:00.000Z");

assert.deepEqual(
	filterEntriesByPeriod(entries, "month", september).map((entry) => entry.id),
	["sep", "late"],
);
assert.equal(getDateKey("2026-09-03T02:30:00.000Z"), "2026-09-02");
assert.equal(
	getDateKey(getPreviousPeriodReference("month", september)),
	"2026-08-03",
);
assert.equal(
	capitalizeMonthNames("16 de setembro de 2026"),
	"16 de Setembro de 2026",
);
assert.equal(capitalizeMonthNames("16 de set."), "16 de Set.");
