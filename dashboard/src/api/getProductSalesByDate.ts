import { getSparqlClient } from "./client";
import { productSalesByDateQuery } from "./queries/productSalesByDateQuery";

export type ProductSalesByDate = {
	productName: string;
	sales: number;
};

export const getProductSalesByDate = async (dateString: string) => {
	const {
		results: { bindings },
	} = await getSparqlClient().select<"productName" | "sales">(
		productSalesByDateQuery(dateString),
	);

	return bindings.map((row) => ({
		productName: row.productName.value,
		sales: Number(row.sales.value),
	}));
};
