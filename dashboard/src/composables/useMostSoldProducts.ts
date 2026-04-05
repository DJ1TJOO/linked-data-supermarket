import { useSWRV } from "@/api/client";
import { type MostSoldProduct, mostSoldProducts } from "@/api/mostSoldProduct";

export function useMostSoldProducts() {
	return useSWRV<MostSoldProduct[]>("mostSoldProducts", mostSoldProducts);
}
