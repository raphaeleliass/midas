"use client";

import { useState } from "react";
import { checkFirstVisit } from "@/lib/visited-pages";

export function useFirstVisit(page: string): boolean {
	const [isFirst] = useState(() => {
		if (typeof window === "undefined") return true;
		return checkFirstVisit(page);
	});
	return isFirst;
}
