import {
	type HighestLossCostProduct,
	highestLossCostProducts,
} from "@/api/highestLossCostProducts";
import useSWRV from "swrv";

export function useHighestLossCostProducts() {
	return useSWRV<HighestLossCostProduct[]>(
		"highestLossCostProducts",
		highestLossCostProducts,
	);
}
