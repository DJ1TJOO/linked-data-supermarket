import { baseOptions } from "@/api/client";
import {
    getHighestLossRateProducts,
    type HighestLossRateProduct,
} from "@/api/getHighestLossRateProducts";
import useSWRV from "swrv";

import { toValue, type MaybeRefOrGetter } from "vue";

export function useHighestLossRateProducts(limit?: MaybeRefOrGetter<number>, endpoint?: MaybeRefOrGetter<string>) {
	return useSWRV<HighestLossRateProduct[]>(
		() => ["highestLossRateProducts", toValue(limit), toValue(endpoint)].join("|"),
		() => getHighestLossRateProducts(toValue(limit), toValue(endpoint)),
		baseOptions,
	);
}
