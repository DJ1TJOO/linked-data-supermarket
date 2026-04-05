import {
	type HighestTurnoverProduct,
	highestTurnoverProducts,
} from "@/api/highestTurnoverProducts";
import useSWRV from "swrv";

export function useHighestTurnoverProducts() {
	return useSWRV<HighestTurnoverProduct[]>(
		"highestTurnoverProducts",
		highestTurnoverProducts,
	);
}
