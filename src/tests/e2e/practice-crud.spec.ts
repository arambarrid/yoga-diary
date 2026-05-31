import { test, expect } from "@playwright/test";

// E2E coverage for the full practice lifecycle (create → list → edit → delete).
// Each run uses a unique marker in the notes field so the test only acts on
// rows it created and doesn't interfere with other data in the dev database.

test("create, edit and delete a yoga practice through the UI", async ({ page }) => {
  const marker = `E2E_${Date.now()}`;
  const initialNotes = `${marker} initial notes`;

  // --- Create ---
  await page.goto("/");
  await page.getByRole("link", { name: "Registro" }).click();
  await expect(page).toHaveURL(/\/practices\/new/);

  await page.getByLabel("Tipo de práctica").selectOption("yoga");
  await page.getByLabel("Duración (minutos)").fill("60");
  await page.getByLabel("¿Cómo fue guiada?").selectOption("self");
  await page.getByLabel("Estilo de yoga").selectOption("vinyasa");
  await page.getByLabel("Notas").fill(initialNotes);

  await page.getByRole("button", { name: "Crear práctica" }).click();
  await expect(page).toHaveURL("/diary/practices");

  // The card surfaces the notes, so we can locate our own row by marker.
  const createdCard = page.locator("a", { hasText: marker });
  await expect(createdCard).toBeVisible();
  await expect(createdCard).toContainText("60 min");

  // --- Edit ---
  await createdCard.click();
  await expect(page).toHaveURL(/\/practices\/[a-z0-9]+/i);

  const duration = page.getByLabel("Duración (minutos)");
  await duration.fill("75");
  await page.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(page).toHaveURL("/diary/practices");

  const editedCard = page.locator("a", { hasText: marker });
  await expect(editedCard).toContainText("75 min");

  // --- Delete ---
  await editedCard.click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Eliminar práctica" }).click();
  await expect(page).toHaveURL("/diary/practices");

  await expect(page.locator("a", { hasText: marker })).toHaveCount(0);
});

test("create a meditation practice with multiple focus objects and position", async ({ page }) => {
  const marker = `E2E_MEDITATION_${Date.now()}`;

  await page.goto("/practices/new");

  await page.getByLabel("Tipo de práctica").selectOption("meditation");
  await page.getByLabel("Duración (minutos)").fill("15");
  await page.getByLabel("¿Cómo fue guiada?").selectOption("recorded");
  await page.getByRole("checkbox", { name: "Respiración" }).check({ force: true });
  await page.getByRole("checkbox", { name: "Mantra" }).check({ force: true });
  await page.getByLabel("Posición / lugar").selectOption("zafu");
  await page.getByLabel("Notas").fill(marker);

  await page.getByRole("button", { name: "Crear práctica" }).click();
  await expect(page).toHaveURL("/diary/practices");

  const card = page.locator("a", { hasText: marker });
  await expect(card).toBeVisible();
  await expect(card).toContainText("15 min");
  await expect(card).toContainText("Respiración");
  await expect(card).toContainText("Mantra");
  await expect(card).toContainText("Zafu");

  // Clean up after the test to keep the dev database tidy.
  page.once("dialog", (dialog) => dialog.accept());
  await card.click();
  await page.getByRole("button", { name: "Eliminar práctica" }).click();
  await expect(page).toHaveURL("/diary/practices");
});

test("create a yoga practice with a custom 'Otro' style and see it on the card", async ({
  page,
}) => {
  const marker = `E2E_CUSTOM_${Date.now()}`;
  const style = `Iyengar ${Date.now()}`;

  await page.goto("/practices/new");
  await page.getByLabel("Tipo de práctica").selectOption("yoga");
  await page.getByLabel("Duración (minutos)").fill("50");
  await page.getByLabel("¿Cómo fue guiada?").selectOption("self");
  await page.getByLabel("Estilo de yoga").selectOption("other");
  await page.getByLabel("¿Qué estilo?").fill(style);
  await page.getByLabel("Notas").fill(marker);

  await page.getByRole("button", { name: "Crear práctica" }).click();
  await expect(page).toHaveURL("/diary/practices");

  const card = page.locator("a", { hasText: marker });
  await expect(card).toBeVisible();
  await expect(card).toContainText(style);

  // Clean up.
  page.once("dialog", (dialog) => dialog.accept());
  await card.click();
  await page.getByRole("button", { name: "Eliminar práctica" }).click();
  await expect(page).toHaveURL("/diary/practices");
});

test("reuse a previously-saved custom yoga style from the dropdown", async ({ page }) => {
  const stamp = Date.now();
  const style = `Reuse ${stamp}`;
  const markerA = `E2E_REUSE_A_${stamp}`;
  const markerB = `E2E_REUSE_B_${stamp}`;

  // First practice: create a brand-new custom style via "Otro…".
  await page.goto("/practices/new");
  await page.getByLabel("Tipo de práctica").selectOption("yoga");
  await page.getByLabel("Duración (minutos)").fill("40");
  await page.getByLabel("¿Cómo fue guiada?").selectOption("self");
  await page.getByLabel("Estilo de yoga").selectOption("other");
  await page.getByLabel("¿Qué estilo?").fill(style);
  await page.getByLabel("Notas").fill(markerA);
  await page.getByRole("button", { name: "Crear práctica" }).click();
  await expect(page).toHaveURL("/diary/practices");

  // Second practice: the style is now selectable directly from the dropdown.
  await page.goto("/practices/new");
  await page.getByLabel("Tipo de práctica").selectOption("yoga");
  await page.getByLabel("Duración (minutos)").fill("40");
  await page.getByLabel("¿Cómo fue guiada?").selectOption("self");
  await page.getByLabel("Estilo de yoga").selectOption({ label: style });
  await page.getByLabel("Notas").fill(markerB);
  await page.getByRole("button", { name: "Crear práctica" }).click();
  await expect(page).toHaveURL("/diary/practices");

  const cardB = page.locator("a", { hasText: markerB });
  await expect(cardB).toBeVisible();
  await expect(cardB).toContainText(style);

  // Clean up both practices.
  for (const marker of [markerB, markerA]) {
    const card = page.locator("a", { hasText: marker });
    page.once("dialog", (dialog) => dialog.accept());
    await card.click();
    await page.getByRole("button", { name: "Eliminar práctica" }).click();
    await expect(page).toHaveURL("/diary/practices");
  }
});
