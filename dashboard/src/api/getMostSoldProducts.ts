import { getSparqlClient } from "./client";
import { mostSoldProductsQuery } from "./queries/mostSoldProductsQuery";

export type MostSoldProduct = {
	productName: string;
	sum: number;
};

export const getMostSoldProducts = async (
	startDate?: string,
	endDate?: string,
	limit?: number,
) => {
	const {
		results: { bindings },
	} = await getSparqlClient().select<"productName" | "sum">(
		mostSoldProductsQuery(startDate, endDate, limit),
	);

	return bindings.map((row) => ({
		productName: row.productName.value,
		sum: Number(row.sum.value),
	}));
};
