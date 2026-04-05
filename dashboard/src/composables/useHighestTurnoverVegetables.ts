import {
	type HighestTurnoverVegetable,
	getHighestTurnoverVegetables,
} from "@/api/getHighestTurnoverVegetables";
import useSWRV from "swrv";

export function useHighestTurnoverVegetables() {
	return useSWRV<HighestTurnoverVegetable[]>(
		"highestTurnoverVegetables",
		getHighestTurnoverVegetables,
	);
}
