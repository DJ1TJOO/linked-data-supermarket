import { baseOptions } from "@/api/client";
import {
	getHighestLossRateProducts,
	type HighestLossRateProduct,
} from "@/api/getHighestLossRateProducts";
import useSWRV from "swrv";

import { toValue, type MaybeRefOrGetter } from "vue";

export function useHighestLossRateProducts(limit?: MaybeRefOrGetter<number>) {
	return useSWRV<HighestLossRateProduct[]>(
		() => ["highestLossRateProducts", toValue(limit)].join("|"),
		() => getHighestLossRateProducts(toValue(limit)),
		baseOptions,
	);
}
