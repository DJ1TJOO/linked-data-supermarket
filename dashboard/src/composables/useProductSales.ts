import { baseOptions } from "@/api/client";
import { getProductSales, type ProductSales } from "@/api/getProductSales";
import useSWRV from "swrv";
import { toValue, type MaybeRefOrGetter } from "vue";

export function useProductSales(
	startDate?: MaybeRefOrGetter<string>,
	endDate?: MaybeRefOrGetter<string>,
	limit?: MaybeRefOrGetter<number>,
) {
	return useSWRV<ProductSales[]>(
		() =>
			[
				"productSales",
				toValue(startDate),
				toValue(endDate),
				toValue(limit),
			].join("|"),
		() => getProductSales(toValue(startDate), toValue(endDate), toValue(limit)),
		baseOptions,
	);
}
