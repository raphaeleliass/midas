import {
	Document,
	Font,
	Page,
	StyleSheet,
	Text,
	View,
} from "@react-pdf/renderer";
import type { Entry } from "@/lib/finance";
import type { Period } from "./period-selector";

Font.register({
	family: "Midas Report",
	fonts: [
		{ src: "/fonts/midas-report-regular.otf", fontWeight: "normal" },
		{ src: "/fonts/midas-report-bold.otf", fontWeight: "bold" },
	],
});

type CategoryTotal = {
	name: string;
	total: number;
};

type MonthTotal = {
	label: string;
	income: number;
	expense: number;
};

const styles = StyleSheet.create({
	page: {
		backgroundColor: "#F7F8F6",
		color: "#14201A",
		fontFamily: "Midas Report",
		padding: 42,
	},
	header: {
		backgroundColor: "#14201A",
		borderRadius: 16,
		marginBottom: 26,
		padding: 24,
	},
	brand: {
		color: "#C7F36B",
		fontSize: 11,
		fontFamily: "Midas Report",
		fontWeight: "bold",
		letterSpacing: 2.4,
	},
	title: {
		color: "#FFFFFF",
		fontSize: 25,
		fontFamily: "Midas Report",
		fontWeight: "bold",
		marginTop: 12,
	},
	meta: { color: "#B8C3BA", fontSize: 10, marginTop: 7 },
	sectionLabel: {
		color: "#617067",
		fontSize: 9,
		fontFamily: "Midas Report",
		fontWeight: "bold",
		letterSpacing: 1.1,
		marginBottom: 8,
		textTransform: "uppercase",
	},
	sectionTitle: {
		fontSize: 17,
		fontFamily: "Midas Report",
		fontWeight: "bold",
		marginBottom: 14,
	},
	kpiGrid: { flexDirection: "row", gap: 9, marginBottom: 23 },
	kpi: {
		backgroundColor: "#FFFFFF",
		borderColor: "#E2E7E2",
		borderRadius: 12,
		borderWidth: 1,
		flexGrow: 1,
		padding: 13,
	},
	kpiLabel: { color: "#6B786F", fontSize: 9, marginBottom: 6 },
	kpiValue: { fontFamily: "Midas Report", fontSize: 14, fontWeight: "bold" },
	summary: {
		backgroundColor: "#E7F0E5",
		borderRadius: 12,
		color: "#314637",
		fontSize: 10,
		lineHeight: 1.55,
		marginBottom: 25,
		padding: 15,
	},
	categoryRow: {
		alignItems: "center",
		borderBottomColor: "#E2E7E2",
		borderBottomWidth: 1,
		flexDirection: "row",
		paddingVertical: 10,
	},
	categoryName: { flexGrow: 1, fontSize: 10 },
	categoryValue: {
		fontFamily: "Midas Report",
		fontWeight: "bold",
		fontSize: 10,
		textAlign: "right",
		width: 80,
	},
	categoryShare: {
		color: "#6B786F",
		fontSize: 9,
		textAlign: "right",
		width: 46,
	},
	empty: { color: "#6B786F", fontSize: 10, paddingVertical: 14 },
	pageNumber: {
		bottom: 28,
		color: "#829087",
		fontSize: 8,
		left: 42,
		position: "absolute",
		right: 42,
		textAlign: "center",
	},
	monthHeader: {
		backgroundColor: "#E7ECE6",
		borderRadius: 8,
		flexDirection: "row",
		marginTop: 6,
		paddingHorizontal: 10,
		paddingVertical: 8,
	},
	monthRow: {
		borderBottomColor: "#E2E7E2",
		borderBottomWidth: 1,
		flexDirection: "row",
		paddingHorizontal: 10,
		paddingVertical: 10,
	},
	monthLabel: { flexGrow: 1, fontSize: 10 },
	monthValue: { fontSize: 10, textAlign: "right", width: 100 },
	monthBalance: {
		fontFamily: "Midas Report",
		fontWeight: "bold",
		fontSize: 10,
		textAlign: "right",
		width: 100,
	},
	footerNote: {
		color: "#6B786F",
		fontSize: 9,
		lineHeight: 1.45,
		marginTop: 22,
	},
});

function formatCurrency(cents: number) {
	return new Intl.NumberFormat("pt-BR", {
		style: "currency",
		currency: "BRL",
	}).format(cents / 100);
}

function getPeriodLabel(period: Period) {
	const now = new Date();
	if (period === "week") return "Últimos 7 dias";
	if (period === "year") return `Ano de ${now.getFullYear()}`;
	return now.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

function getPeriodEntries(entries: Entry[], period: Period) {
	const now = new Date();
	if (period === "week") {
		const cutoff = new Date(now);
		cutoff.setDate(now.getDate() - 7);
		return entries.filter((entry) => new Date(entry.date) >= cutoff);
	}
	if (period === "year") {
		return entries.filter((entry) =>
			entry.date.startsWith(now.getFullYear().toString()),
		);
	}
	return entries.filter((entry) =>
		entry.date.startsWith(now.toISOString().slice(0, 7)),
	);
}

function getCategories(entries: Entry[]): CategoryTotal[] {
	const totals = new Map<string, number>();
	for (const entry of entries) {
		if (entry.type !== "expense") continue;
		const name = entry.entryCategories[0]?.category.name ?? "Sem categoria";
		totals.set(name, (totals.get(name) ?? 0) + entry.amountCents);
	}
	return [...totals.entries()]
		.map(([name, total]) => ({ name, total }))
		.sort((a, b) => b.total - a.total);
}

function getLastSixMonths(entries: Entry[]): MonthTotal[] {
	return Array.from({ length: 6 }, (_, index) => {
		const date = new Date();
		date.setMonth(date.getMonth() - (5 - index));
		const prefix = date.toISOString().slice(0, 7);
		const monthEntries = entries.filter((entry) =>
			entry.date.startsWith(prefix),
		);
		return {
			label: date.toLocaleDateString("pt-BR", {
				month: "long",
				year: "numeric",
			}),
			income: monthEntries
				.filter((entry) => entry.type === "income")
				.reduce((total, entry) => total + entry.amountCents, 0),
			expense: monthEntries
				.filter((entry) => entry.type === "expense")
				.reduce((total, entry) => total + entry.amountCents, 0),
		};
	});
}

export function FinancialReportDocument({
	entries,
	period,
}: {
	entries: Entry[];
	period: Period;
}) {
	const periodEntries = getPeriodEntries(entries, period);
	const income = periodEntries
		.filter((entry) => entry.type === "income")
		.reduce((total, entry) => total + entry.amountCents, 0);
	const expense = periodEntries
		.filter((entry) => entry.type === "expense")
		.reduce((total, entry) => total + entry.amountCents, 0);
	const balance = income - expense;
	const categories = getCategories(periodEntries);
	const months = getLastSixMonths(entries);
	const issuedAt = new Date().toLocaleDateString("pt-BR", {
		day: "2-digit",
		month: "long",
		year: "numeric",
	});
	const summary =
		periodEntries.length === 0
			? "Não há lançamentos no período selecionado. Registre receitas e despesas para que o próximo relatório revele padrões da sua vida financeira."
			: `Foram registrados ${periodEntries.length} lançamento${periodEntries.length === 1 ? "" : "s"} neste período. ${income > 0 ? `As receitas somaram ${formatCurrency(income)}.` : "Não houve receitas registradas."} ${expense > 0 ? `As despesas totalizaram ${formatCurrency(expense)}.` : "Não houve despesas registradas."} O saldo do período ficou em ${formatCurrency(balance)}.`;

	return (
		<Document title="Relatório financeiro Midas" author="Midas">
			<Page size="A4" style={styles.page}>
				<View style={styles.header}>
					<Text style={styles.brand}>MIDAS</Text>
					<Text style={styles.title}>Relatório financeiro</Text>
					<Text style={styles.meta}>
						{getPeriodLabel(period)} · Emitido em {issuedAt}
					</Text>
				</View>

				<Text style={styles.sectionLabel}>Visão geral</Text>
				<Text style={styles.sectionTitle}>Como foi o seu período</Text>
				<View style={styles.kpiGrid}>
					<View style={styles.kpi}>
						<Text style={styles.kpiLabel}>RECEITAS</Text>
						<Text style={styles.kpiValue}>{formatCurrency(income)}</Text>
					</View>
					<View style={styles.kpi}>
						<Text style={styles.kpiLabel}>DESPESAS</Text>
						<Text style={styles.kpiValue}>{formatCurrency(expense)}</Text>
					</View>
					<View style={styles.kpi}>
						<Text style={styles.kpiLabel}>SALDO</Text>
						<Text style={styles.kpiValue}>{formatCurrency(balance)}</Text>
					</View>
				</View>

				<Text style={styles.summary}>{summary}</Text>

				<Text style={styles.sectionLabel}>Despesas por categoria</Text>
				<Text style={styles.sectionTitle}>Para onde seu dinheiro foi</Text>
				{categories.length === 0 ? (
					<Text style={styles.empty}>
						Nenhuma despesa registrada neste período.
					</Text>
				) : (
					categories.slice(0, 8).map((category) => (
						<View key={category.name} style={styles.categoryRow}>
							<Text style={styles.categoryName}>{category.name}</Text>
							<Text style={styles.categoryValue}>
								{formatCurrency(category.total)}
							</Text>
							<Text style={styles.categoryShare}>
								{((category.total / expense) * 100).toFixed(1)}%
							</Text>
						</View>
					))
				)}
				<Text
					style={styles.pageNumber}
					render={({ pageNumber, totalPages }) =>
						`Midas · ${pageNumber} de ${totalPages}`
					}
					fixed
				/>
			</Page>

			<Page size="A4" style={styles.page}>
				<Text style={styles.sectionLabel}>Histórico</Text>
				<Text style={styles.sectionTitle}>Evolução dos últimos 6 meses</Text>
				<View style={styles.monthHeader}>
					<Text style={styles.monthLabel}>MÊS</Text>
					<Text style={styles.monthValue}>RECEITAS</Text>
					<Text style={styles.monthValue}>DESPESAS</Text>
					<Text style={styles.monthBalance}>SALDO</Text>
				</View>
				{months.map((month) => (
					<View key={month.label} style={styles.monthRow}>
						<Text style={styles.monthLabel}>{month.label}</Text>
						<Text style={styles.monthValue}>
							{formatCurrency(month.income)}
						</Text>
						<Text style={styles.monthValue}>
							{formatCurrency(month.expense)}
						</Text>
						<Text style={styles.monthBalance}>
							{formatCurrency(month.income - month.expense)}
						</Text>
					</View>
				))}
				<Text style={styles.footerNote}>
					Este documento apresenta seus lançamentos registrados no Midas. Use-o
					para acompanhar seus hábitos e comparar a evolução financeira ao longo
					do tempo.
				</Text>
				<Text
					style={styles.pageNumber}
					render={({ pageNumber, totalPages }) =>
						`Midas · ${pageNumber} de ${totalPages}`
					}
					fixed
				/>
			</Page>
		</Document>
	);
}
