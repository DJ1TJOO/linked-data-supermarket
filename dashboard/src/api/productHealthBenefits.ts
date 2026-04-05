import { getSparqlClient } from "./client";
import { productHealthBenefitsQuery } from "./queries/productHealthBenefitsQuery";

export type ProductHealthBenefit = {
	productName: string;
	health: string;
};

export const productHealthBenefits = async (): Promise<
	ProductHealthBenefit[]
> =>
	getSparqlClient()
		.query.select(productHealthBenefitsQuery)
		.then((rows) =>
			rows.map((row) => ({
				productName: row.productName.value,
				health: row.health.value,
			})),
		);
