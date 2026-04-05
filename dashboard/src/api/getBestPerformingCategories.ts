import { getSparqlClient } from "./client";
import { bestPerformingCategoriesQuery } from "./queries/bestPerformingCategoriesQuery";

export type BestPerformingCategory = {
	categoryName: string;
	totalRevenue: number;
	totalQuantity: number;
};

export const getBestPerformingCategories = async (
	startDate?: string,
	endDate?: string,
	limit?: number,
) => {
	const {
		results: { bindings },
	} = await getSparqlClient().select<
		"categoryName" | "totalRevenue" | "totalQuantity"
	>(bestPerformingCategoriesQuery(startDate, endDate, limit));

	return bindings.map((row) => ({
		categoryName: row.categoryName.value,
		totalRevenue: Number(row.totalRevenue.value),
		totalQuantity: Number(row.totalQuantity.value),
	}));
};
