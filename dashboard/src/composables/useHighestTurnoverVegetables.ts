import { baseOptions } from "@/api/client";
import {
	getHighestTurnoverVegetables,
	type HighestTurnoverVegetable,
} from "@/api/getHighestTurnoverVegetables";
import useSWRV from "swrv";

import { toValue, type MaybeRefOrGetter } from "vue";

export function useHighestTurnoverVegetables(
	startDate?: MaybeRefOrGetter<string>,
	endDate?: MaybeRefOrGetter<string>,
	limit?: MaybeRefOrGetter<number>,
) {
	return useSWRV<HighestTurnoverVegetable[]>(
		() =>
			[
				"highestTurnoverVegetables",
				toValue(startDate),
				toValue(endDate),
				toValue(limit),
			].join("|"),
		() =>
			getHighestTurnoverVegetables(
				toValue(startDate),
				toValue(endDate),
				toValue(limit),
			),
		baseOptions,
	);
}
