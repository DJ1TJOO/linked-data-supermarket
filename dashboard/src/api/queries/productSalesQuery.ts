// Q7: How much of each product got sold on a certain date?
import { SELECT } from "@tpluscode/sparql-builder";
import {offersGraph, ordersGraph, productsGraph} from "./graphs";
import { schema, terms, xsd } from "./namespaces";
import { filterDateRange, limitQuery, normalizeClauseOrder } from "./utils";
import {
	amount,
	offer,
	order,
	orderQuantity,
	productName,
	productRecord,
	sales,
} from "./variables";

const prefixes = { schema, xsd, terms };

export const productSalesQuery = (
	startDate?: string,
	endDate?: string,
	limit?: number,
): string => {
	const query =
		SELECT`${productName} (SUM(xsd:decimal(STR(${amount}))) AS ${sales})`
			.FROM(ordersGraph)
			.FROM(productsGraph)
			.FROM(offersGraph).WHERE`
				${productRecord} a ${schema.Product} ;
					${schema.name} ${productName} .

				${order} a ${schema.Order} ;
					${schema.acceptedOffer} ${offer} ;
					${terms.orderQuantity} ${orderQuantity} .
					
				${offer} ${schema.itemOffered} ${productRecord} .

				${orderQuantity} ${schema.value} ${amount} .

				${filterDateRange(startDate, endDate)}`
			.GROUP()
			.BY(productName)
			.ORDER()
			.BY(sales, true);

	return normalizeClauseOrder(limitQuery(query, limit).build({ prefixes }));
};
