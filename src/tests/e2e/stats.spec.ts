import { test, expect } from "@playwright/test";

// E2E coverage for /stats (issue #9, phase 1).
//
// Strategy:
//  1. Read the current yoga count from the Resumen panel as a baseline.
//  2. Create a yoga practice through the UI (marker in notes for cleanup).
//  3. Revisit /stats and assert the yoga count increased by exactly one.
//  4. Exercise the range filter chips and check TZ is preserved through
//     navigations.
//  5. Delete the practice we created so the dev DB stays tidy.

test("stats page reflects new practices and preserves tz across range filters", async ({
  page,
}) => {
  const marker = `E2E_STATS_${Date.now()}`;

  // --- Baseline: yoga count before we add anything ---
  await page.goto("/stats");
  // TzGuard re-renders the page with `?tz=` once the browser zone is known.
  await expect(page).toHaveURL(/[?&]tz=/);
  const yogaCount = page.getByTestId("stats-count-yoga");
  await expect(yogaCount).toBeVisible();
  const baseline = Number(((await yogaCount.textContent()) ?? "0").trim());
  expect(Number.isFinite(baseline)).toBe(true);

  // Both Recharts charts (Frequency + Duration) render their SVG surface
  // even on empty data — the weekly series fills the range with zero bars.
  await expect(page.locator(".recharts-wrapper")).toHaveCount(2);

  // --- Create one yoga practice through the UI ---
  await page.goto("/practices/new");
  await page.getByLabel("Tipo de práctica").selectOption("yoga");
  await page.getByLabel("Duración (minutos)").fill("45");
  await page.getByLabel("¿Cómo fue guiada?").selectOption("self");
  await page.getByLabel("Estilo de yoga").selectOption("vinyasa");
  await page.getByLabel("Notas").fill(marker);
  await page.getByRole("button", { name: "Crear práctica" }).click();
  await expect(page).toHaveURL("/");

  // --- Stats now show baseline + 1 yoga ---
  await page.goto("/stats");
  await expect(page).toHaveURL(/[?&]tz=/);
  await expect(page.getByTestId("stats-count-yoga")).toHaveText(
    String(baseline + 1),
  );
  // Charts still render with dense data.
  await expect(page.locator(".recharts-wrapper")).toHaveCount(2);

  // --- Range filter: tz is preserved on each chip click ---
  // 90 días: adds `range=90`, keeps `tz=`.
  await page.getByRole("link", { name: "90 días" }).click();
  await expect(page).toHaveURL(/[?&]range=90(&|$)/);
  await expect(page).toHaveURL(/[?&]tz=/);

  // Todo: switches to `range=all`, still keeps `tz=`.
  await page.getByRole("link", { name: "Todo" }).click();
  await expect(page).toHaveURL(/[?&]range=all(&|$)/);
  await expect(page).toHaveURL(/[?&]tz=/);

  // 30 días (default): drops `range=` entirely, still keeps `tz=`.
  await page.getByRole("link", { name: "30 días" }).click();
  await expect(page).not.toHaveURL(/[?&]range=/);
  await expect(page).toHaveURL(/[?&]tz=/);

  // --- Clean up the practice we created ---
  await page.goto("/");
  const createdCard = page.locator("a", { hasText: marker });
  await expect(createdCard).toBeVisible();
  await createdCard.click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Eliminar práctica" }).click();
  await expect(page).toHaveURL("/");
});
