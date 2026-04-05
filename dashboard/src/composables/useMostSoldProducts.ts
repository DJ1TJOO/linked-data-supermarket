import { baseOptions } from "@/api/client";
import {
	getMostSoldProducts,
	type MostSoldProduct,
} from "@/api/getMostSoldProducts";
import useSWRV from "swrv";
import { toValue, type MaybeRefOrGetter } from "vue";

export function useMostSoldProducts(limit?: MaybeRefOrGetter<number>) {
	return useSWRV<MostSoldProduct[]>(
		() => ["mostSoldProducts", toValue(limit)].join("|"),
		() => getMostSoldProducts(toValue(limit)),
		baseOptions,
	);
}
