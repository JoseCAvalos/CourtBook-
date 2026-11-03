import { expect, test } from "@playwright/test";

test("la página principal de CourtBook carga correctamente", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByText("Reserva tu cancha de forma fácil y rápida")
  ).toBeVisible();

  await expect(
    page.getByRole("link", {
      name: "Ver canchas disponibles",
    })
  ).toBeVisible();
});