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
) {
	return useSWRV<HighestTurnoverProduct[]>(
		() =>
			[
				"highestTurnoverProducts",
				toValue(startDate),
				toValue(endDate),
				toValue(limit),
			].join("|"),
		() =>
			getHighestTurnoverProducts(
				toValue(startDate),
				toValue(endDate),
				toValue(limit),
			),
		baseOptions,
	);
}
