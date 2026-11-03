import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Inicio from "../pages/Inicio";

describe("Inicio", () => {
  it("muestra el título principal de CourtBook", () => {
    render(
      <MemoryRouter>
        <Inicio />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        "Reserva tu cancha de forma fácil y rápida"
      )
    ).toBeInTheDocument();
  });
});