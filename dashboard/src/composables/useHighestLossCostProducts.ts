import { baseOptions } from "@/api/client";
import {
	getHighestLossCostProducts,
	type HighestLossCostProduct,
} from "@/api/getHighestLossCostProducts";
import useSWRV from "swrv";

import { toValue, type MaybeRefOrGetter } from "vue";

export function useHighestLossCostProducts(
	startDate?: MaybeRefOrGetter<string>,
	endDate?: MaybeRefOrGetter<string>,
	limit?: MaybeRefOrGetter<number>,
) {
	return useSWRV<HighestLossCostProduct[]>(
		() =>
			[
				"highestLossCostProducts",
				toValue(startDate),
				toValue(endDate),
				toValue(limit),
			].join("|"),
		() =>
			getHighestLossCostProducts(
				toValue(startDate),
				toValue(endDate),
				toValue(limit),
			),
		baseOptions,
	);
}
