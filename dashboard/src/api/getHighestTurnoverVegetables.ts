import { getSparqlClient } from "./client";
import { highestTurnoverVegetablesQuery } from "./queries/highestTurnoverVegetablesQuery";

export type HighestTurnoverVegetable = {
	vegetableName: string;
	turnover: number;
};

export const getHighestTurnoverVegetables = async (
	startDate?: string,
	endDate?: string,
	limit?: number,
) => {
	const {
		results: { bindings },
	} = await getSparqlClient().select<"vegetableName" | "turnover">(
		highestTurnoverVegetablesQuery(startDate, endDate, limit),
	);

	return bindings.map((row) => ({
		vegetableName: row.vegetableName.value,
		turnover: Number(row.turnover.value),
	}));
};
