// Q1: What products get sold the most (in KG)?
import { SELECT } from "@tpluscode/sparql-builder";
import rdf from "@zazuko/env/web.js";
import {offersGraph, ordersGraph, productsGraph} from "./graphs";
import { schema, terms, xsd } from "./namespaces";
import { limitQuery, normalizeClauseOrder } from "./utils";
import {
	offer,
	order,
	orderQuantity,
	product,
	productName,
	value,
} from "./variables";

const prefixes = { schema, xsd, terms };

export const mostSoldProductsQuery = (limit?: number) => {
	const query = SELECT`${productName} (SUM(xsd:decimal(STR(${value}))) AS ?sum)`
		.FROM(ordersGraph)
		.FROM(productsGraph)
		.FROM(offersGraph).WHERE`
      ${order} a ${schema.Order} ;
        ${schema.acceptedOffer} ${offer} ;
        ${terms.orderQuantity} ${orderQuantity} .

      ${offer} ${schema.itemOffered} ${product} .

      ${orderQuantity} a ${schema.QuantitativeValue} ;
        ${schema.value} ${value} .

      ${product} ${schema.name} ${productName} .
    `
		.GROUP()
		.BY(productName)
		.ORDER()
		.BY(rdf.variable("sum"), true);

	return normalizeClauseOrder(limitQuery(query, limit).build({ prefixes }));
};
