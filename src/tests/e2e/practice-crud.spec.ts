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
  await expect(page).toHaveURL("/");

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
  await expect(page).toHaveURL("/");

  const editedCard = page.locator("a", { hasText: marker });
  await expect(editedCard).toContainText("75 min");

  // --- Delete ---
  await editedCard.click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Eliminar práctica" }).click();
  await expect(page).toHaveURL("/");

  await expect(page.locator("a", { hasText: marker })).toHaveCount(0);
});

test("create a meditation practice with focus object and position", async ({ page }) => {
  const marker = `E2E_MEDITATION_${Date.now()}`;

  await page.goto("/practices/new");

  await page.getByLabel("Tipo de práctica").selectOption("meditation");
  await page.getByLabel("Duración (minutos)").fill("15");
  await page.getByLabel("¿Cómo fue guiada?").selectOption("recorded");
  await page.getByLabel("Objeto de foco").selectOption("breath");
  await page.getByLabel("Posición / lugar").selectOption("zafu");
  await page.getByLabel("Notas").fill(marker);

  await page.getByRole("button", { name: "Crear práctica" }).click();
  await expect(page).toHaveURL("/");

  const card = page.locator("a", { hasText: marker });
  await expect(card).toBeVisible();
  await expect(card).toContainText("15 min");
  await expect(card).toContainText("Respiración");
  await expect(card).toContainText("Zafu");

  // Clean up after the test to keep the dev database tidy.
  page.once("dialog", (dialog) => dialog.accept());
  await card.click();
  await page.getByRole("button", { name: "Eliminar práctica" }).click();
  await expect(page).toHaveURL("/");
});
