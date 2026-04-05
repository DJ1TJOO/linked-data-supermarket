import { ParsingClient } from "sparql-http-client";
import useSWRV from "swrv";

export function getSparqlClient() {
	const endpoint = import.meta.env.VITE_SPARQL_ENDPOINT || "";
	if (!endpoint) {
		throw new Error(
			"Missing SPARQL endpoint. Set VITE_SPARQL_ENDPOINT in your Vite environment.",
		);
	}

	return new ParsingClient({
		endpointUrl: endpoint,
		fetch:
			typeof window !== "undefined" ? window.fetch.bind(window) : undefined,
	});
}

export const baseOptions = {
	revalidateOnFocus: false,
	dedupingInterval: 5000,
};

export { useSWRV };
