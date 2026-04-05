// Q7: How much of each product got sold on a certain date?
import { SELECT } from "@tpluscode/sparql-builder";
import { schema, terms, xsd } from "./namespaces";
import { normalizeClauseOrder, sanitizeDate } from "./utils";
import {
	amount,
	date,
	offer,
	order,
	orderQuantity,
	productName,
	productRecord,
	sales,
} from "./variables";

const prefixes = { schema, xsd, terms };

export const productSalesByDateQuery = (dateString: string): string => {
	const safeDate = sanitizeDate(dateString);
	const safeDateLiteral = `"${safeDate}"`;

	const query =
		SELECT`${productName} (SUM(xsd:decimal(STR(${amount}))) AS ${sales})`.WHERE`
			${productRecord} a ${schema.Product} ;
				${schema.name} ${productName} .
			${order} a ${schema.Order} ;
				${schema.orderDate} ${date} ;
				${schema.acceptedOffer} ${offer} ;
				${terms.orderQuantity} ${orderQuantity} .
			${offer} ${schema.itemOffered} ${productRecord} .
			${orderQuantity} ${schema.value} ${amount} .
			FILTER(REGEX(STR(${date}), ${safeDateLiteral}))
		`
			.GROUP()
			.BY(productName)
			.ORDER()
			.BY(productName)
			.build({ prefixes });

	return normalizeClauseOrder(query);
};
