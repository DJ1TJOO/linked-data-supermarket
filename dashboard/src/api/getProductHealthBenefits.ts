import { getSparqlClient } from "./client";
import { productHealthBenefitsQuery } from "./queries/productHealthBenefitsQuery";

export type ProductHealthBenefit = {
	productName: string;
	health: string;
};

export const getProductHealthBenefits = async (limit?: number) => {
	const {
		results: { bindings },
	} = await getSparqlClient().select<"productName" | "health">(
		productHealthBenefitsQuery(limit),
	);

	return bindings.map((row) => ({
		productName: row.productName.value,
		health: row.health.value,
	}));
};
