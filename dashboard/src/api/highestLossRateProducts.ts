import { getSparqlClient } from "./client";
import { highestLossRateProductsQuery } from "./queries/highestLossRateProductsQuery";

export type HighestLossRateProduct = {
	productName: string;
	lossRate: number;
};

export const highestLossRateProducts = async (): Promise<
	HighestLossRateProduct[]
> =>
	getSparqlClient()
		.query.select(highestLossRateProductsQuery)
		.then((rows) =>
			rows.map((row) => ({
				productName: row.productName.value,
				lossRate: Number(row.lossRate.value),
			})),
		);
