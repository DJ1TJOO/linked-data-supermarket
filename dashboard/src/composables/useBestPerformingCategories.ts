import {
	type BestPerformingCategory,
	bestPerformingCategories,
} from "@/api/bestPerformingCategories";
import { useSWRV } from "@/api/client";

export function useBestPerformingCategories() {
	return useSWRV<BestPerformingCategory[]>(
		"bestPerformingCategories",
		bestPerformingCategories,
	);
}
