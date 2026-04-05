import { baseOptions } from "@/api/client";
import {
	type HighestTurnoverProduct,
	getHighestTurnoverProducts,
} from "@/api/getHighestTurnoverProducts";
import useSWRV from "swrv";

export function useHighestTurnoverProducts() {
	return useSWRV<HighestTurnoverProduct[]>(
		"highestTurnoverProducts",
		getHighestTurnoverProducts,
		baseOptions,
	);
}
