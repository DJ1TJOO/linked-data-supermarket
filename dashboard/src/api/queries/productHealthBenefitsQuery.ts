// Q8: What are the health benefits of each product?
import { SELECT } from "@tpluscode/sparql-builder";
import { schema, terms, xsd } from "./namespaces";
import { limitQuery, normalizeClauseOrder } from "./utils";
import {
	health,
	healthBenefit,
	productName,
	productRecord,
	vegetable,
} from "./variables";

const prefixes = { schema, xsd, terms };

export const productHealthBenefitsQuery = (limit?: number) => {
	const query =
		SELECT`${productName} (GROUP_CONCAT(DISTINCT STR(${healthBenefit}); separator=", ") AS ${health})`
			.WHERE`
        ${productRecord} a ${schema.Product} ;
          ${schema.name} ${productName} ;
          ${terms.variantOf} ${vegetable} .

        ${vegetable} ${terms.healthBenefits} ${healthBenefit} .
      `
			.GROUP()
			.BY(productName);

	return normalizeClauseOrder(limitQuery(query, limit).build({ prefixes }));
};
