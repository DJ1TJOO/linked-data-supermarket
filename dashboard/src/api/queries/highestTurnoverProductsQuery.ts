// Q2: What products produce the highest turnover?
import { SELECT } from "@tpluscode/sparql-builder";
import {offersGraph, ordersGraph, productsGraph} from "./graphs";
import { schema, terms, xsd } from "./namespaces";
import { filterDateRange, limitQuery, normalizeClauseOrder } from "./utils";
import {
	offer,
	order,
	orderQuantity,
	price,
	product,
	productName,
	quantity,
	turnover,
} from "./variables";

const prefixes = { schema, xsd, terms };

export const highestTurnoverProductsQuery = (
	startDate?: string,
	endDate?: string,
	limit?: number,
) => {
	const query =
		SELECT`${productName} (SUM(xsd:decimal(STR(?value))) AS ${turnover})`
			.FROM(ordersGraph)
			.FROM(productsGraph)
			.FROM(offersGraph).WHERE`
        ${order} a ${schema.Order} ;
          ${schema.acceptedOffer} ${offer} ;
          ${terms.orderQuantity} ${orderQuantity} .

        ${offer} ${schema.itemOffered} ${product} ;
          ${schema.priceSpecification} ?ps .

        ?ps ${schema.price} ${price} .

        ${orderQuantity} a ${schema.QuantitativeValue} ;
          ${schema.value} ${quantity} .

        ${product} ${schema.name} ${productName} .

        BIND((xsd:decimal(STR(${quantity}))) * (xsd:decimal(STR(${price}))) AS ?value) .

        ${filterDateRange(startDate, endDate)}
      `
			.GROUP()
			.BY(productName)
			.ORDER()
			.BY(turnover, true);

	return normalizeClauseOrder(limitQuery(query, limit).build({ prefixes }));
};
