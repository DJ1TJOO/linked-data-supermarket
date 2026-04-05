import { getSparqlClient } from "./client";
import { highestTurnoverProductsQuery } from "./queries/highestTurnoverProductsQuery";

export type HighestTurnoverProduct = {
	productName: string;
	turnover: number;
};

export const getHighestTurnoverProducts = async (
	startDate?: string,
	endDate?: string,
	limit?: number,
) => {
	const {
		results: { bindings },
	} = await getSparqlClient().select<"productName" | "turnover">(
		highestTurnoverProductsQuery(startDate, endDate, limit),
	);

	return bindings.map((row) => ({
		productName: row.productName.value,
		turnover: Number(row.turnover.value),
	}));
};
