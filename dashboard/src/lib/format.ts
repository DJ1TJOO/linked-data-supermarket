export const formatNumber = (value?: number, digits = 2): string => {
	if (!value) {
		return "-";
	}

	return new Intl.NumberFormat("nl-NL", {
		minimumFractionDigits: 0,
		maximumFractionDigits: digits,
	}).format(value);
};

export const formatCurrency = (value?: number): string => {
	if (!value) {
		return "-";
	}

	return new Intl.NumberFormat("nl-NL", {
		style: "currency",
		currency: "CNY",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value);
};
