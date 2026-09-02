"use client";

import { Card, CardContent } from "@midas/ui/components/card";
import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type User = {
	name: string;
	email: string;
	image?: string | null;
};

type ProfileSectionProps = {
	user: User;
};

function getInitials(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((part) => part[0])
		.join("")
		.toUpperCase();
}

export function ProfileSection({ user }: ProfileSectionProps) {
	const [imagePreview, setImagePreview] = useState<string | null>(
		user.image ?? null,
	);
	const [isPending, setIsPending] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	function handleAvatarClick() {
		fileInputRef.current?.click();
	}

	async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = async (event) => {
			const dataUrl = event.target?.result as string;
			setImagePreview(dataUrl);
			setIsPending(true);
			const { error } = await authClient.updateUser({ image: dataUrl });
			setIsPending(false);

			if (error) {
				toast.error(error.message ?? "Erro ao atualizar foto.");
				setImagePreview(user.image ?? null);
			} else {
				toast.success("Foto atualizada.");
			}
		};
		reader.readAsDataURL(file);
	}

	return (
		<Card>
			<CardContent className="flex flex-col items-center gap-3 py-6">
				<button
					type="button"
					onClick={handleAvatarClick}
					disabled={isPending}
					className="group relative h-20 w-20 overflow-hidden rounded-full bg-muted transition-opacity hover:opacity-80 disabled:opacity-60"
					aria-label="Alterar foto de perfil"
				>
					{imagePreview ? (
						// biome-ignore lint/performance/noImgElement: avatar accepts data URLs and arbitrary origins — Next Image does not support these without extra config
						<img
							src={imagePreview}
							alt={user.name}
							className="h-full w-full object-cover"
						/>
					) : (
						<span className="flex h-full w-full items-center justify-center font-semibold text-lg text-muted-foreground">
							{getInitials(user.name)}
						</span>
					)}
					<div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
						<Camera className="h-5 w-5 text-white" />
					</div>
				</button>

				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					className="hidden"
					onChange={handleFileChange}
				/>

				<div className="text-center">
					<p className="font-semibold text-sm">{user.name}</p>
					<p className="text-muted-foreground text-xs">{user.email}</p>
				</div>
			</CardContent>
		</Card>
	);
}
