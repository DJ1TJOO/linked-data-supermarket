import { useSWRV } from "@/api/client";
import {
	type HighestLossCostProduct,
	highestLossCostProducts,
} from "@/api/highestLossCostProducts";

export function useHighestLossCostProducts() {
	return useSWRV<HighestLossCostProduct[]>(
		"highestLossCostProducts",
		highestLossCostProducts,
	);
}
