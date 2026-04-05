import { sparql } from "@tpluscode/sparql-builder";
import type { SelectQuery } from "node_modules/@tpluscode/sparql-builder/lib/SelectBuilder";
import { schema } from "./namespaces";
import { order } from "./variables";

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

export function filterDateRange(startDate?: string, endDate?: string) {
	if (!startDate && !endDate) {
		return sparql``;
	}

	return sparql`
    ${order} ${schema.orderDate} ?orderDate .
    BIND(xsd:date(SUBSTR(STR(?orderDate), 1, 10)) AS ?dtOrderDate)
    ${
			startDate
				? sparql`FILTER(?dtOrderDate >= xsd:date("${sanitizeDate(startDate)}"))`
				: sparql``
		}
    ${
			endDate
				? sparql`FILTER(?dtOrderDate <= xsd:date("${sanitizeDate(endDate)}"))`
				: sparql``
		}
  `;
}

export function limitQuery(query: SelectQuery, limit?: number) {
	if (limit) {
		return query.LIMIT(limit);
	}

	return query;
}
