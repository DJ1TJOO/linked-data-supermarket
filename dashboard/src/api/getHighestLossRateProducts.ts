import { getSparqlClient } from "./client";
import { highestLossRateProductsQuery } from "./queries/highestLossRateProductsQuery";

export type HighestLossRateProduct = {
	productName: string;
	lossRate: number;
};

export const getHighestLossRateProducts = async (limit?: number) => {
	const {
		results: { bindings },
	} = await getSparqlClient().select<"productName" | "lossRate">(
		highestLossRateProductsQuery(limit),
	);

	return bindings.map((row) => ({
		productName: row.productName.value,
		lossRate: Number(row.lossRate.value),
	}));
};
