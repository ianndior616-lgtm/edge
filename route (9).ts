import { NextResponse } from "next/server";
import { resolveSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ALLOWED_VERIFY_KEYS = ["code"] as const;

/**
 * Проверка кода доступа администратора (без выдачи прав — только проверка).
 * Права выдаются при сохранении анкеты с верным кодом.
 */
export async function POST(request: Request) {
  const session = await resolveSession(request);
  if (!session) {
    return NextResponse.json(
      { error: "Нужно открыть приложение через Telegram-бота" },
      { status: 401 },
    );
  }

  let body: { code?: unknown } = {};
  try {
    body = (await request.json()) as { code?: unknown };
  } catch {
    // пустое тело
  }

  const code = typeof body.code === "string" ? body.code.trim() : "";
  const expected = process.env.ADMIN_ACCESS_CODE || "Борис140826";

  return NextResponse.json({ ok: code === expected });
}
