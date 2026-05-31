import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { practiceUpdateSchema } from "@/lib/schemas";
import { deletePractice, getPractice, updatePractice } from "@/lib/practice";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const practice = await getPractice(id);
  if (!practice) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ practice });
}

export async function PATCH(request: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = practiceUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  try {
    const practice = await updatePractice(id, parsed.data);
    // Keep the statically-rendered /diary summary in sync after an edit.
    revalidatePath("/diary");
    return Response.json({ practice });
  } catch {
    return Response.json({ error: "Practice not found or update failed" }, { status: 404 });
  }
}

export async function DELETE(_request: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  try {
    await deletePractice(id);
    // Without this the deleted practice lingers in the cached /diary summary.
    revalidatePath("/diary");
    return new Response(null, { status: 204 });
  } catch {
    return Response.json({ error: "Practice not found" }, { status: 404 });
  }
}
