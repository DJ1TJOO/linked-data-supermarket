// Validate date string in YYYY-MM-DD format
export function sanitizeDate(dateString: string): string {
	const match = /^\d{4}-\d{2}-\d{2}$/.test(dateString);
	if (!match) {
		throw new Error("Invalid date format. Expected YYYY-MM-DD.");
	}
	return dateString;
}
// The builder puts order by before group by, which is not valid SPARQL.
export function normalizeClauseOrder(query: string): string {
	const orderIndex = query.search(/\bORDER\s+BY\b/i);
	const groupIndex = query.search(/\bGROUP\s+BY\b/i);
	if (orderIndex === -1 || groupIndex === -1 || groupIndex < orderIndex)
		return query;
	return query.replace(
		/(ORDER\s+BY[\s\S]*?)(GROUP\s+BY[\s\S]*?)(?=(\n(?:LIMIT|OFFSET)\b|$))/i,
		"$2\n$1",
	);
}
