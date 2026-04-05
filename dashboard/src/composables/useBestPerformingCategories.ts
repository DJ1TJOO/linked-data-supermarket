import {
	type BestPerformingCategory,
	bestPerformingCategories,
} from "@/api/bestPerformingCategories";
import useSWRV from "swrv";

export function useBestPerformingCategories() {
	return useSWRV<BestPerformingCategory[]>(
		"bestPerformingCategories",
		bestPerformingCategories,
	);
}
