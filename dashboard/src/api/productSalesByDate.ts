import { getSparqlClient } from "./client";
import { productSalesByDateQuery } from "./queries/productSalesByDateQuery";

export type ProductSalesByDate = {
	productName: string;
	sales: number;
};

export const productSalesByDate = async (
	dateString: string,
): Promise<ProductSalesByDate[]> =>
	getSparqlClient()
		.query.select(productSalesByDateQuery(dateString))
		.then((rows) =>
			rows.map((row) => ({
				productName: row.productName.value,
				sales: Number(row.sales.value),
			})),
		);
