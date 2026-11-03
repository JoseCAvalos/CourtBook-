import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app";

describe("API CourtBook", () => {
  it("debe responder correctamente en GET /", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      mensaje: "API CourtBook funcionando correctamente",
    });
  });
});