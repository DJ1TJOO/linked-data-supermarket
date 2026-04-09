import { getSparqlClient } from "./client";
import { productSalesQuery } from "./queries/productSalesQuery";

export type ProductSales = {
	productName: string;
	sales: number;
};

export const getProductSales = async (
	startDate?: string,
	endDate?: string,
	limit?: number,
	endpoint?: string
) => {
	const {
		results: { bindings },
	} = await getSparqlClient(endpoint).select<"productName" | "sales">(
		productSalesQuery(startDate, endDate, limit),
	);

	return bindings.map((row) => ({
		productName: row.productName.value,
		sales: Number(row.sales.value),
	}));
};
