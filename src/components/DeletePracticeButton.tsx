"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";

type Props = {
  practiceId: string;
  confirmText?: string;
};

export function DeletePracticeButton({
  practiceId,
  confirmText = "¿Eliminar esta práctica? Esta acción no se puede deshacer.",
}: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!window.confirm(confirmText)) return;
    setError(null);
    setIsDeleting(true);

    const res = await fetch(`/api/practices/${practiceId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      setError("No se pudo eliminar la práctica");
      setIsDeleting(false);
      return;
    }

    startTransition(() => {
      router.push("/diary/practices");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        type="button"
        variant="danger"
        onClick={handleDelete}
        disabled={isDeleting || isPending}
      >
        {isDeleting || isPending ? "Eliminando..." : "Eliminar práctica"}
      </Button>
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
    </div>
  );
}
