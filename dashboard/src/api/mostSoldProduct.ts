import { getSparqlClient } from "./client";
import { mostSoldProductsQuery } from "./queries/mostSoldProductsQuery";

export type MostSoldProduct = {
	productName: string;
	sum: number;
};

export const mostSoldProducts = async (): Promise<MostSoldProduct[]> =>
	getSparqlClient()
		.query.select(mostSoldProductsQuery)
		.then((rows) =>
			rows
				.map((row) => ({
					productName: row.productName.value,
					sum: Number(row.sum.value),
				}))
				.sort((a, b) => b.sum - a.sum),
		);
