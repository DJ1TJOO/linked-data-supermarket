import {
	productSalesByDate,
	type ProductSalesByDate,
} from "@/api/productSalesByDate";
import useSWRV from "swrv";
import { toValue, type MaybeRefOrGetter } from "vue";

export function useProductSalesByDate(dateString: MaybeRefOrGetter<string>) {
	return useSWRV<ProductSalesByDate[]>(
		() => ["productSalesByDate", toValue(dateString)],
		() => productSalesByDate(toValue(dateString)),
	);
}
