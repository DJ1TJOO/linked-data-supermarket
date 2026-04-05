import { type MostSoldProduct, mostSoldProducts } from "@/api/mostSoldProduct";
import useSWRV from "swrv";

export function useMostSoldProducts() {
	return useSWRV<MostSoldProduct[]>("mostSoldProducts", mostSoldProducts);
}
