import { getSparqlClient } from "./client";
import { mostSoldProductsQuery } from "./queries/mostSoldProductsQuery";

export type MostSoldProduct = {
	productName: string;
	sum: number;
};

export const getMostSoldProducts = async () => {
	const {
		results: { bindings },
	} = await getSparqlClient().select<"productName" | "sum">(
		mostSoldProductsQuery,
	);

	return bindings.map((row) => ({
		productName: row.productName.value,
		sum: Number(row.sum.value),
	}));
};
