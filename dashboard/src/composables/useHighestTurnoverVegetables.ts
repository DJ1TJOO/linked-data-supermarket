import { useSWRV } from "@/api/client";
import {
	type HighestTurnoverVegetable,
	highestTurnoverVegetables,
} from "@/api/highestTurnoverVegetables";

export function useHighestTurnoverVegetables() {
	return useSWRV<HighestTurnoverVegetable[]>(
		"highestTurnoverVegetables",
		highestTurnoverVegetables,
	);
}
