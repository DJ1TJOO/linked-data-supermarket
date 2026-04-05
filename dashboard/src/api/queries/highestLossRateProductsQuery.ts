// Q5: What products have the highest loss rates?
import { SELECT } from "@tpluscode/sparql-builder";
import { productsGraph } from "./graphs";
import { schema, terms, xsd } from "./namespaces";
import { limitQuery, normalizeClauseOrder } from "./utils";
import { lossRate, product, productName } from "./variables";

const prefixes = { schema, xsd, terms };

export const highestLossRateProductsQuery = (limit?: number) => {
	const query = SELECT`${productName} ${lossRate}`.FROM(productsGraph).WHERE`
			${product} a ${schema.Product} ;
				${schema.name} ${productName} ;
				${terms.lossRate} ${lossRate} .
		`
		.ORDER()
		.BY(lossRate, true);

	return normalizeClauseOrder(limitQuery(query, limit).build({ prefixes }));
};
