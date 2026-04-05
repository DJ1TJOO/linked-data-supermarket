import { getSparqlClient } from "./client";
import { highestTurnoverVegetablesQuery } from "./queries/highestTurnoverVegetablesQuery";

export type HighestTurnoverVegetable = {
	vegetableName: string;
	turnover: number;
};

export const highestTurnoverVegetables = async (): Promise<
	HighestTurnoverVegetable[]
> =>
	getSparqlClient()
		.query.select(highestTurnoverVegetablesQuery)
		.then((rows) =>
			rows.map((row) => ({
				vegetableName: row.vegetableName.value,
				turnover: Number(row.turnover.value),
			})),
		);
