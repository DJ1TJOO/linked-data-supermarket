// Q5: What products have the highest loss rates?
import { SELECT } from "@tpluscode/sparql-builder";
import { schema, terms, xsd } from "./namespaces";
import { normalizeClauseOrder } from "./utils";
import { lossRate, product, productName } from "./variables";

const prefixes = { schema, xsd, terms };

export const highestLossRateProductsQuery = normalizeClauseOrder(
	SELECT`${productName} ${lossRate}`.WHERE`
			${product} a ${schema.Product} ;
				${schema.name} ${productName} ;
				${terms.lossRate} ${lossRate} .
		`
		.ORDER()
		.BY(lossRate, true)
		.build({ prefixes }),
);
