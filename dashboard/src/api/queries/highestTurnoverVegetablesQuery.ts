// Q3: What (known) vegetables are responsible for the highest turnover?
import { SELECT } from "@tpluscode/sparql-builder";
import { ordersGraph, productsGraph, vegetablesGraph } from "./graphs";
import { schema, terms, xsd } from "./namespaces";
import { filterDateRange, limitQuery, normalizeClauseOrder } from "./utils";
import {
	offer,
	order,
	orderQuantity,
	price,
	product,
	quantity,
	turnover,
	vegetable,
	vegetableName,
} from "./variables";

const prefixes = { schema, xsd, terms };

export const highestTurnoverVegetablesQuery = (
	startDate?: string,
	endDate?: string,
	limit?: number,
) => {
	const query =
		SELECT`${vegetableName} (SUM(xsd:decimal(STR(?value))) AS ${turnover})`
			.FROM(ordersGraph)
			.FROM(productsGraph)
			.FROM(vegetablesGraph).WHERE`
        ${vegetable} a ${terms.Vegetable} ;
          ${terms.name} ${vegetableName} .

        ${order} a ${schema.Order} ;
          ${schema.acceptedOffer} ${offer} ;
          ${terms.orderQuantity} ${orderQuantity} .

        ${offer} ${schema.itemOffered} ${product} ;
          ${schema.priceSpecification} ?ps .

        ${product} ${terms.variantOf} ${vegetable} .

        ?ps ${schema.price} ${price} .

        ${orderQuantity} a ${schema.QuantitativeValue} ;
          ${schema.value} ${quantity} .

        BIND((xsd:decimal(STR(${quantity}))) * (xsd:decimal(STR(${price}))) AS ?value) .

        ${filterDateRange(startDate, endDate)}
      `
			.GROUP()
			.BY(vegetableName)
			.ORDER()
			.BY(turnover, true);

	return normalizeClauseOrder(limitQuery(query, limit).build({ prefixes }));
};
