export type SPARQLBindingValue = {
	type: "uri" | "literal" | "bnode";
	value: string;
	"xml:lang"?: string;
	datatype?: string;
};

export type SPARQLResult<KEYS extends string> = {
	head: { vars: KEYS[] };
	results: {
		bindings: Record<KEYS, SPARQLBindingValue>[];
	};
};

export function getSparqlClient(endpoint?: string) {
	if (!endpoint) {
		throw new Error(
			"Missing SPARQL endpoint. Set VITE_SPARQL_ENDPOINT in your Vite environment or provide one.",
		);
	}

	return {
		select: async <KEYS extends string>(query: string) => {
			const response = await fetch(endpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/sparql-query",
					Accept: "application/sparql-results+json",
				},
				body: query,
			});

			if (!response.ok) {
				const text = await response.text();
				throw new Error(
					`SPARQL query failed: ${response.status} ${response.statusText}\n${text}`,
				);
			}

			return response.json() as Promise<SPARQLResult<KEYS>>;
		},
	};
}

export const baseOptions = {
	revalidateOnFocus: false,
	dedupingInterval: 5000,
};
