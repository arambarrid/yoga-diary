import type { NextRequest } from "next/server";
import { ZodError } from "zod";
import { practiceSchema } from "@/lib/schemas";
import {
  createPractice,
  listPractices,
  practiceFilterSchema,
} from "@/lib/practice";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const parsed = practiceFilterSchema.safeParse({
    type: params.get("type") ?? undefined,
    from: params.get("from") ?? undefined,
    to: params.get("to") ?? undefined,
  });
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const practices = await listPractices(parsed.data);
  return Response.json({ practices });
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = practiceSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  try {
    const practice = await createPractice(parsed.data);
    return Response.json({ practice }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return Response.json({ error: err.flatten() }, { status: 400 });
    }
    return Response.json({ error: "Failed to create practice" }, { status: 500 });
  }
}
