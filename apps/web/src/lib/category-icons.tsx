import {
	Banknote,
	BookOpen,
	Briefcase,
	Building2,
	Bus,
	Car,
	Coffee,
	CreditCard,
	Dumbbell,
	Film,
	Fuel,
	Gamepad2,
	Gift,
	GraduationCap,
	HeartPulse,
	Home,
	KeyRound,
	Laptop,
	type LucideIcon,
	Music,
	Pill,
	Pizza,
	ShoppingBasket,
	ShoppingCart,
	Tag,
	Train,
	TrendingDown,
	TrendingUp,
	Tv,
	UtensilsCrossed,
	Wallet,
	Zap,
} from "lucide-react";

export const CATEGORY_ICONS: {
	key: string;
	icon: LucideIcon;
	label: string;
}[] = [
	{ key: "UtensilsCrossed", icon: UtensilsCrossed, label: "Refeições" },
	{ key: "Coffee", icon: Coffee, label: "Café" },
	{ key: "Pizza", icon: Pizza, label: "Delivery" },
	{ key: "ShoppingBasket", icon: ShoppingBasket, label: "Mercado" },
	{ key: "ShoppingCart", icon: ShoppingCart, label: "Compras" },
	{ key: "Gift", icon: Gift, label: "Presentes" },
	{ key: "Tag", icon: Tag, label: "Outros gastos" },
	{ key: "Home", icon: Home, label: "Moradia" },
	{ key: "Building2", icon: Building2, label: "Imóvel" },
	{ key: "KeyRound", icon: KeyRound, label: "Aluguel" },
	{ key: "Car", icon: Car, label: "Carro" },
	{ key: "Bus", icon: Bus, label: "Transporte" },
	{ key: "Train", icon: Train, label: "Metrô" },
	{ key: "Fuel", icon: Fuel, label: "Combustível" },
	{ key: "HeartPulse", icon: HeartPulse, label: "Saúde" },
	{ key: "Pill", icon: Pill, label: "Medicamentos" },
	{ key: "Dumbbell", icon: Dumbbell, label: "Academia" },
	{ key: "Gamepad2", icon: Gamepad2, label: "Jogos" },
	{ key: "Tv", icon: Tv, label: "Streaming" },
	{ key: "Music", icon: Music, label: "Música" },
	{ key: "Film", icon: Film, label: "Cinema" },
	{ key: "Wallet", icon: Wallet, label: "Carteira" },
	{ key: "CreditCard", icon: CreditCard, label: "Cartão" },
	{ key: "Banknote", icon: Banknote, label: "Dinheiro" },
	{ key: "TrendingUp", icon: TrendingUp, label: "Investimento" },
	{ key: "TrendingDown", icon: TrendingDown, label: "Perda" },
	{ key: "Briefcase", icon: Briefcase, label: "Trabalho" },
	{ key: "Laptop", icon: Laptop, label: "Tech" },
	{ key: "BookOpen", icon: BookOpen, label: "Educação" },
	{ key: "GraduationCap", icon: GraduationCap, label: "Curso" },
	{ key: "Zap", icon: Zap, label: "Serviços" },
];

export const ICON_MAP = Object.fromEntries(
	CATEGORY_ICONS.map((c) => [c.key, c.icon]),
) as Record<string, LucideIcon>;

export function CategoryIcon({
	iconKey,
	className,
}: {
	iconKey: string | null | undefined;
	className?: string;
}) {
	if (!iconKey) return null;
	const Icon = ICON_MAP[iconKey];
	if (!Icon) return null;
	return <Icon className={className ?? "h-4 w-4"} />;
}
