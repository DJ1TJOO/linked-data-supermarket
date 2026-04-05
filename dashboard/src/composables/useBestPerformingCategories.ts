import { baseOptions } from "@/api/client";
import {
	type BestPerformingCategory,
	getBestPerformingCategories,
} from "@/api/getBestPerformingCategories";
import useSWRV from "swrv";

export function useBestPerformingCategories() {
	return useSWRV<BestPerformingCategory[]>(
		"bestPerformingCategories",
		getBestPerformingCategories,
		baseOptions,
	);
}
