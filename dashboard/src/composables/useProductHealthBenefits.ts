import { useSWRV } from "@/api/client";
import {
	type ProductHealthBenefit,
	productHealthBenefits,
} from "@/api/productHealthBenefits";

export function useProductHealthBenefits() {
	return useSWRV<ProductHealthBenefit[]>(
		"productHealthBenefits",
		productHealthBenefits,
	);
}
