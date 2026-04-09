// Q6: What products cost the most money in losses?
import { SELECT } from "@tpluscode/sparql-builder";
import {costPricesGraph, offersGraph, ordersGraph, productsGraph} from "./graphs";
import { schema, terms, xsd } from "./namespaces";
import { filterDateRange, limitQuery, normalizeClauseOrder } from "./utils";
import {
	averageCostPrice,
	costPrice,
	costPriceRecord,
	days,
	from,
	fromDate,
	losses,
	lossRate,
	offer,
	order,
	product,
	productName,
	quantityNode,
	quantitySold,
	totalSold,
	until,
	untilDate,
} from "./variables";

const prefixes = { schema, xsd, terms };

export const highestLossCostProductsQuery = (
	startDate?: string,
	endDate?: string,
	limit?: number,
) => {
	const averageCostPriceQuery = SELECT`${product} 
		(SUM(xsd:decimal(STR(${costPrice})) * ${days}) / SUM(${days}) AS ${averageCostPrice})`
		.WHERE`
      ${costPriceRecord} a ${terms.CostPrice} ;
        ${schema.itemOffered} ${product} ;
        ${schema.validFrom} ${fromDate} ;
        ${schema.validUntil} ${untilDate} ;
        ${schema.priceSpecification} ?ps .

      ?ps ${schema.price} ${costPrice} .

      BIND(xsd:date(STR(${fromDate})) AS ${from})

      BIND(xsd:date(STR(${untilDate})) AS ${until})

      BIND(
        (YEAR(${until}) - YEAR(${from})) * 365 +
        (MONTH(${until}) - MONTH(${from})) * 30 +
        (DAY(${until}) - DAY(${from}))
      AS ${days})
    `
		.GROUP()
		.BY(product);

	const totalSoldQuery =
		SELECT`${product} (SUM(xsd:decimal(STR(${quantitySold}))) AS ${totalSold})`
			.WHERE`
        ${order} a ${schema.Order} ;
          ${terms.orderQuantity} ${quantityNode} ;
          ${schema.acceptedOffer} ${offer} .

        ${offer} ${schema.itemOffered} ${product} .

        ${quantityNode} ${schema.value} ${quantitySold} .

        ${filterDateRange(startDate, endDate)}
      `
			.GROUP()
			.BY(product);

	const query = SELECT`${productName}
    (( ${averageCostPrice} * ${lossRate} * (${totalSold} / (100 - ${lossRate})) ) AS ${losses})`
		.FROM(productsGraph)
		.FROM(ordersGraph)
		.FROM(costPricesGraph)
		.FROM(offersGraph).WHERE`
      ${product} a ${schema.Product} ;
        ${schema.name} ${productName} ;
        ${terms.lossRate} ${lossRate} .

      ${averageCostPriceQuery}

      ${totalSoldQuery}
    `
		.ORDER()
		.BY(losses, true);

	return normalizeClauseOrder(limitQuery(query, limit).build({ prefixes }));
};
