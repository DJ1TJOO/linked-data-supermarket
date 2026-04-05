import { useSWRV } from "@/api/client";
import {
	type HighestTurnoverProduct,
	highestTurnoverProducts,
} from "@/api/highestTurnoverProducts";

export function useHighestTurnoverProducts() {
	return useSWRV<HighestTurnoverProduct[]>(
		"highestTurnoverProducts",
		highestTurnoverProducts,
	);
}
