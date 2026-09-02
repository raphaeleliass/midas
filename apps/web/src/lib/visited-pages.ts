const visitedPages = new Set<string>();

export function checkFirstVisit(page: string): boolean {
	if (visitedPages.has(page)) return false;
	visitedPages.add(page);
	return true;
}
