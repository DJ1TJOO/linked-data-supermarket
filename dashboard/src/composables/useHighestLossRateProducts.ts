import { baseOptions } from "@/api/client";
import {
	type HighestLossRateProduct,
	getHighestLossRateProducts,
} from "@/api/getHighestLossRateProducts";
import useSWRV from "swrv";

export function useHighestLossRateProducts() {
	return useSWRV<HighestLossRateProduct[]>(
		"highestLossRateProducts",
		getHighestLossRateProducts,
		baseOptions,
	);
}
