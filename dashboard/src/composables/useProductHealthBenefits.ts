import {
	type ProductHealthBenefit,
	productHealthBenefits,
} from "@/api/productHealthBenefits";
import useSWRV from "swrv";

export function useProductHealthBenefits() {
	return useSWRV<ProductHealthBenefit[]>(
		"productHealthBenefits",
		productHealthBenefits,
	);
}
