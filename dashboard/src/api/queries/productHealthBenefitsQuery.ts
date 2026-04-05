// Q8: What are the health benefits of each product?
import { SELECT } from "@tpluscode/sparql-builder";
import { schema, terms, xsd } from "./namespaces";
import { normalizeClauseOrder } from "./utils";
import {
	health,
	healthBenefit,
	productName,
	productRecord,
	vegetable,
	vegetableVariant,
} from "./variables";

const prefixes = { schema, xsd, terms };

export const productHealthBenefitsQuery = normalizeClauseOrder(
	SELECT`${productName} (GROUP_CONCAT(STR(${healthBenefit}); separator=", ") AS ${health})`
		.WHERE`
			{
				SELECT ${productName} (SAMPLE(${vegetableVariant}) AS ${vegetable})
				WHERE {
					${productRecord} a ${schema.Product} ;
						${schema.name} ${productName} ;
						${terms.variantOf} ${vegetableVariant} .
				}
				GROUP BY ${productName}
			}
			${vegetable} ${terms.healthBenefits} ${healthBenefit} .
		`
		.GROUP()
		.BY(productName)
		.build({ prefixes }),
);
