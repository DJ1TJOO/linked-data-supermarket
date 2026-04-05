// Q2: What products produce the highest turnover?
import { SELECT } from "@tpluscode/sparql-builder";
import { schema, terms, xsd } from "./namespaces";
import { normalizeClauseOrder } from "./utils";
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

export const highestTurnoverProductsQuery = normalizeClauseOrder(
	SELECT`${productName} (SUM(xsd:decimal(STR(?value))) AS ${turnover})`.WHERE`
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
		`
		.GROUP()
		.BY(productName)
		.ORDER()
		.BY(turnover, true)
		.build({ prefixes }),
);
