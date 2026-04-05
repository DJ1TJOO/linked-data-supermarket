import {
	type HighestLossRateProduct,
	highestLossRateProducts,
} from "@/api/highestLossRateProducts";
import useSWRV from "swrv";

export function useHighestLossRateProducts() {
	return useSWRV<HighestLossRateProduct[]>(
		"highestLossRateProducts",
		highestLossRateProducts,
	);
}
