"use client";

import { FileDown } from "lucide-react";
import { useState } from "react";
import type { Entry } from "@/lib/finance";
import type { Period } from "./period-selector";

type ReportDownloadButtonProps = {
	entries: Entry[];
	period: Period;
};

export function ReportDownloadButton({
	entries,
	period,
}: ReportDownloadButtonProps) {
	const [isGenerating, setIsGenerating] = useState(false);

	async function handleDownload() {
		setIsGenerating(true);

		try {
			const [{ pdf }, { FinancialReportDocument }] = await Promise.all([
				import("@react-pdf/renderer"),
				import("./financial-report"),
			]);
			const blob = await pdf(
				<FinancialReportDocument entries={entries} period={period} />,
			).toBlob();
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = `midas-relatorio-financeiro-${new Date()
				.toISOString()
				.slice(0, 10)}.pdf`;
			link.click();
			URL.revokeObjectURL(url);
		} finally {
			setIsGenerating(false);
		}
	}

	return (
		<button
			type="button"
			onClick={handleDownload}
			disabled={isGenerating}
			className="no-print flex w-full items-center justify-center gap-2 rounded-xl border bg-card py-3 font-semibold text-sm transition-colors hover:bg-muted/30 disabled:pointer-events-none disabled:opacity-60"
		>
			<FileDown className="size-4" />
			{isGenerating ? "Gerando relatório..." : "Baixar relatório em PDF"}
		</button>
	);
}
