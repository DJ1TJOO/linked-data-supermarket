import { getSparqlClient } from "./client";
import { highestTurnoverProductsQuery } from "./queries/highestTurnoverProductsQuery";

export type HighestTurnoverProduct = {
	productName: string;
	turnover: number;
};

export const highestTurnoverProducts = async (): Promise<
	HighestTurnoverProduct[]
> =>
	getSparqlClient()
		.query.select(highestTurnoverProductsQuery)
		.then((rows) =>
			rows.map((row) => ({
				productName: row.productName.value,
				turnover: Number(row.turnover.value),
			})),
		);
