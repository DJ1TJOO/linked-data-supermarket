import { baseOptions } from "@/api/client";
import {
	getBestPerformingCategories,
	type BestPerformingCategory,
} from "@/api/getBestPerformingCategories";
import useSWRV from "swrv";

import { toValue, type MaybeRefOrGetter } from "vue";

export function useBestPerformingCategories(
	startDate?: MaybeRefOrGetter<string>,
	endDate?: MaybeRefOrGetter<string>,
	limit?: MaybeRefOrGetter<number>,
) {
	return useSWRV<BestPerformingCategory[]>(
		() =>
			[
				"bestPerformingCategories",
				toValue(startDate),
				toValue(endDate),
				toValue(limit),
			].join("|"),
		() =>
			getBestPerformingCategories(
				toValue(startDate),
				toValue(endDate),
				toValue(limit),
			),
		baseOptions,
	);
}
