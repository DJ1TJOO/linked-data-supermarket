import { baseOptions } from "@/api/client";
import {
    getHighestTurnoverProducts,
    type HighestTurnoverProduct,
} from "@/api/getHighestTurnoverProducts";
import useSWRV from "swrv";

import { toValue, type MaybeRefOrGetter } from "vue";

export function useHighestTurnoverProducts(
	startDate?: MaybeRefOrGetter<string>,
	endDate?: MaybeRefOrGetter<string>,
	limit?: MaybeRefOrGetter<number>,
	endpoint?: MaybeRefOrGetter<string>,
) {
	return useSWRV<HighestTurnoverProduct[]>(
		() =>
			[
				"highestTurnoverProducts",
				toValue(startDate),
				toValue(endDate),
				toValue(limit),
				toValue(endpoint),
			].join("|"),
		() =>
			getHighestTurnoverProducts(
				toValue(startDate),
				toValue(endDate),
				toValue(limit),
				toValue(endpoint),
			),
		baseOptions,
	);
}
