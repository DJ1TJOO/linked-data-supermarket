import {
	getProductSalesByDate,
	type ProductSalesByDate,
} from "@/api/getProductSalesByDate";
import useSWRV from "swrv";
import { toValue, type MaybeRefOrGetter } from "vue";

export function useProductSalesByDate(dateString: MaybeRefOrGetter<string>) {
	return useSWRV<ProductSalesByDate[]>(
		() => ["productSalesByDate", toValue(dateString)],
		() => getProductSalesByDate(toValue(dateString)),
	);
}
