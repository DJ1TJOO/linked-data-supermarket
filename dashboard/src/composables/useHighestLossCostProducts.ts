import { baseOptions } from "@/api/client";
import {
	type HighestLossCostProduct,
	getHighestLossCostProducts,
} from "@/api/getHighestLossCostProducts";
import useSWRV from "swrv";

export function useHighestLossCostProducts() {
	return useSWRV<HighestLossCostProduct[]>(
		"highestLossCostProducts",
		getHighestLossCostProducts,
		baseOptions,
	);
}
