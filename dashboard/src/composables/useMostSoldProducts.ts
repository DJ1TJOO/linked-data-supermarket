import { baseOptions } from "@/api/client";
import {
	getMostSoldProducts,
	type MostSoldProduct,
} from "@/api/getMostSoldProducts";
import useSWRV from "swrv";
import { toValue, type MaybeRefOrGetter } from "vue";

export function useMostSoldProducts(
	startDate?: MaybeRefOrGetter<string>,
	endDate?: MaybeRefOrGetter<string>,
	limit?: MaybeRefOrGetter<number>,
) {
	return useSWRV<MostSoldProduct[]>(
		() =>
			[
				"mostSoldProducts",
				toValue(startDate),
				toValue(endDate),
				toValue(limit),
			].join("|"),
		() =>
			getMostSoldProducts(toValue(startDate), toValue(endDate), toValue(limit)),
		baseOptions,
	);
}
