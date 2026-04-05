import { getSparqlClient } from "./client";
import { mostSoldProductsQuery } from "./queries/mostSoldProductsQuery";

export type MostSoldProduct = {
	productName: string;
	sum: number;
};

export const getMostSoldProducts = async (limit?: number) => {
	const {
		results: { bindings },
	} = await getSparqlClient().select<"productName" | "sum">(
		mostSoldProductsQuery(limit),
	);

	return bindings.map((row) => ({
		productName: row.productName.value,
		sum: Number(row.sum.value),
	}));
};
