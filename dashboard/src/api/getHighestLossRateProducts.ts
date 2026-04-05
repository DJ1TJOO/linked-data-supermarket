import { getSparqlClient } from "./client";
import { highestLossRateProductsQuery } from "./queries/highestLossRateProductsQuery";

export type HighestLossRateProduct = {
	productName: string;
	lossRate: number;
};

export const getHighestLossRateProducts = async () => {
	const {
		results: { bindings },
	} = await getSparqlClient().select<"productName" | "lossRate">(
		highestLossRateProductsQuery,
	);

	return bindings.map((row) => ({
		productName: row.productName.value,
		lossRate: Number(row.lossRate.value),
	}));
};
