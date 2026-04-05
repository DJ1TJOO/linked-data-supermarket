import { baseOptions } from "@/api/client";
import {
	type MostSoldProduct,
	getMostSoldProducts,
} from "@/api/getMostSoldProducts";
import useSWRV from "swrv";

export function useMostSoldProducts() {
	return useSWRV<MostSoldProduct[]>(
		"mostSoldProducts",
		getMostSoldProducts,
		baseOptions,
	);
}
