import {
	type HighestTurnoverVegetable,
	highestTurnoverVegetables,
} from "@/api/highestTurnoverVegetables";
import useSWRV from "swrv";

export function useHighestTurnoverVegetables() {
	return useSWRV<HighestTurnoverVegetable[]>(
		"highestTurnoverVegetables",
		highestTurnoverVegetables,
	);
}
