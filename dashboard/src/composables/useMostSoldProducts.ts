import { baseOptions } from "@/api/client";
import {
    getMostSoldProducts,
    type MostSoldProduct,
} from "@/api/getMostSoldProducts";
import useSWRV from "swrv";
import { toValue, type MaybeRefOrGetter } from "vue";

export function useMostSoldProducts(limit?: MaybeRefOrGetter<number>, endpoint?: MaybeRefOrGetter<string>) {
	return useSWRV<MostSoldProduct[]>(
		() => ["mostSoldProducts", toValue(limit), toValue(endpoint)].join("|"),
		() => getMostSoldProducts(toValue(limit), toValue(endpoint)),
		baseOptions,
	);
}
