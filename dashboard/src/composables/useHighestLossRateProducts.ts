import { useSWRV } from "@/api/client";
import {
	type HighestLossRateProduct,
	highestLossRateProducts,
} from "@/api/highestLossRateProducts";

export function useHighestLossRateProducts() {
	return useSWRV<HighestLossRateProduct[]>(
		"highestLossRateProducts",
		highestLossRateProducts,
	);
}
