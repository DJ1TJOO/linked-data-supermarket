import { getSparqlClient } from "./client";
import { highestLossCostProductsQuery } from "./queries/highestLossCostProductsQuery";

export type HighestLossCostProduct = {
	productName: string;
	losses: number;
};

export const getHighestLossCostProducts = async (
	startDate?: string,
	endDate?: string,
	limit?: number,
	endpoint?: string
) => {
	const {
		results: { bindings },
	} = await getSparqlClient(endpoint).select<"productName" | "losses">(
		highestLossCostProductsQuery(startDate, endDate, limit),
	);

	return bindings.map((row) => ({
		productName: row.productName.value,
		losses: Number(row.losses.value),
	}));
};
