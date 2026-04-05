import { getSparqlClient } from "./client";
import { bestPerformingCategoriesQuery } from "./queries/bestPerformingCategoriesQuery";

export type BestPerformingCategory = {
	categoryName: string;
	totalRevenue: number;
	totalQuantity: number;
};

export const bestPerformingCategories = async (): Promise<
	BestPerformingCategory[]
> =>
	getSparqlClient()
		.query.select(bestPerformingCategoriesQuery)
		.then((rows) =>
			rows.map((row) => ({
				categoryName: row.categoryName.value,
				totalRevenue: Number(row.totalRevenue.value),
				totalQuantity: Number(row.totalQuantity.value),
			})),
		);
