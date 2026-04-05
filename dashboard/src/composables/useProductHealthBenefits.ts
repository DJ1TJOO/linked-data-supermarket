import { baseOptions } from "@/api/client";
import {
	getProductHealthBenefits,
	type ProductHealthBenefit,
} from "@/api/getProductHealthBenefits";
import useSWRV from "swrv";
import { toValue, type MaybeRefOrGetter } from "vue";

export function useProductHealthBenefits(limit?: MaybeRefOrGetter<number>) {
	return useSWRV<ProductHealthBenefit[]>(
		() => ["productHealthBenefits", toValue(limit)].join("|"),
		() => getProductHealthBenefits(toValue(limit)),
		baseOptions,
	);
}
