"use client";

import { Button } from "@midas/ui/components/button";
import { Skeleton } from "@midas/ui/components/skeleton";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AccountSection } from "./account-section";
import { AppearanceSection } from "./appearance-section";
import { PlanSection } from "./plan-section";
import { ProfileSection } from "./profile-section";
import { SecuritySection } from "./security-section";

export default function SettingsPage() {
	const router = useRouter();
	const { data: session, isPending } = authClient.useSession();

	function handleSignOut() {
		authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push("/login");
				},
			},
		});
	}

	return (
		<div className="mx-auto max-w-lg space-y-6 p-6 pb-12">
			<div className="space-y-1">
				<h1 className="font-semibold text-lg">Configurações</h1>
				<p className="text-muted-foreground text-sm">
					Gerencie sua conta e preferências.
				</p>
			</div>

			{isPending || !session ? (
				<SettingsSkeleton />
			) : (
				<>
					<ProfileSection user={session.user} />
					<AccountSection user={session.user} />
					<PlanSection />
					<AppearanceSection />
					<SecuritySection />

					<Button
						variant="outline"
						className="w-full border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
						onClick={handleSignOut}
					>
						<LogOut className="mr-2 h-4 w-4" />
						Sair
					</Button>
				</>
			)}
		</div>
	);
}

function SettingsSkeleton() {
	return (
		<div className="space-y-6">
			<Skeleton className="h-36 w-full rounded-xl" />
			<div className="space-y-3">
				<Skeleton className="h-3 w-12" />
				<Skeleton className="h-24 w-full rounded-xl" />
			</div>
			<div className="space-y-3">
				<Skeleton className="h-3 w-20" />
				<Skeleton className="h-24 w-full rounded-xl" />
			</div>
			<div className="space-y-3">
				<Skeleton className="h-3 w-20" />
				<Skeleton className="h-16 w-full rounded-xl" />
			</div>
			<div className="space-y-3">
				<Skeleton className="h-3 w-16" />
				<Skeleton className="h-24 w-full rounded-xl" />
			</div>
		</div>
	);
}
