import { Suspense } from "react";
import Transactions from "./transactions";

export default function TransactionsPage() {
	return (
		<Suspense>
			<Transactions />
		</Suspense>
	);
}
