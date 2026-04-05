// Q4: What product categories are best performing?
import { SELECT } from "@tpluscode/sparql-builder";
import { schema, terms, xsd } from "./namespaces";
import { filterDateRange, limitQuery, normalizeClauseOrder } from "./utils";
import {
	category,
	categoryName,
	offer,
	order,
	orderQuantity,
	price,
	product,
	quantity,
	totalQuantity,
	totalRevenue,
} from "./variables";

const prefixes = { schema, xsd, terms };

export const bestPerformingCategoriesQuery = (
	startDate?: string,
	endDate?: string,
	limit?: number,
) => {
	const query = SELECT`${categoryName}
    (SUM(xsd:decimal(STR(${price})) * xsd:decimal(STR(${quantity}))) AS ${totalRevenue})
    (SUM(xsd:decimal(STR(${quantity}))) AS ${totalQuantity})`.WHERE`
      ${order} a ${schema.Order} ;
        ${schema.acceptedOffer} ${offer} ;
        ${terms.orderQuantity} ${orderQuantity} .

      ${offer} ${schema.itemOffered} ${product} ;
        ${schema.priceSpecification} ?ps .

      ?ps ${schema.price} ${price} .

      ${orderQuantity} ${schema.value} ${quantity} .

      ${product} ${schema.category} ${category} .

      ${category} ${schema.name} ${categoryName} .

      ${filterDateRange(startDate, endDate)}
    `
		.GROUP()
		.BY(categoryName)
		.ORDER()
		.BY(totalRevenue, true);

	return normalizeClauseOrder(limitQuery(query, limit).build({ prefixes }));
};
