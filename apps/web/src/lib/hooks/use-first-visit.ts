"use client";

import { useEffect, useRef, useState } from "react";
import { checkFirstVisit } from "@/lib/visited-pages";

export function useFirstVisit(page: string): boolean {
	const [isFirst, setIsFirst] = useState(true);
	const checkedPage = useRef<string | null>(null);

	useEffect(() => {
		if (checkedPage.current === page) return;
		checkedPage.current = page;
		setIsFirst(checkFirstVisit(page));
	}, [page]);

	return isFirst;
}
