import { useSWRV } from "@/api/client";
import {
	productSalesByDate,
	type ProductSalesByDate,
} from "@/api/productSalesByDate";
import { toValue, type MaybeRefOrGetter } from "vue";

export function useProductSalesByDate(dateString: MaybeRefOrGetter<string>) {
	return useSWRV<ProductSalesByDate[]>(
		() => ["productSalesByDate", toValue(dateString)],
		() => productSalesByDate(toValue(dateString)),
	);
}
