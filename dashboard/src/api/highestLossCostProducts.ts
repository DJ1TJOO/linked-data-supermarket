import { getSparqlClient } from "./client";
import { highestLossCostProductsQuery } from "./queries/highestLossCostProductsQuery";

export type HighestLossCostProduct = {
	productName: string;
	losses: number;
};

export const highestLossCostProducts = async (): Promise<
	HighestLossCostProduct[]
> =>
	getSparqlClient()
		.query.select(highestLossCostProductsQuery)
		.then((rows) =>
			rows.map((row) => ({
				productName: row.productName.value,
				losses: Number(row.losses.value),
			})),
		);
