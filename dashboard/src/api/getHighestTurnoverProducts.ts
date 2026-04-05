import { getSparqlClient } from "./client";
import { highestTurnoverProductsQuery } from "./queries/highestTurnoverProductsQuery";

export type HighestTurnoverProduct = {
	productName: string;
	turnover: number;
};

export const getHighestTurnoverProducts = async () => {
	const {
		results: { bindings },
	} = await getSparqlClient().select<"productName" | "turnover">(
		highestTurnoverProductsQuery,
	);

	return bindings.map((row) => ({
		productName: row.productName.value,
		turnover: Number(row.turnover.value),
	}));
};
