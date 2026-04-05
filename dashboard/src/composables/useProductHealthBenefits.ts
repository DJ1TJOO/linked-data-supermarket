import {
	type ProductHealthBenefit,
	getProductHealthBenefits,
} from "@/api/getProductHealthBenefits";
import useSWRV from "swrv";

export function useProductHealthBenefits() {
	return useSWRV<ProductHealthBenefit[]>(
		"productHealthBenefits",
		getProductHealthBenefits,
	);
}
