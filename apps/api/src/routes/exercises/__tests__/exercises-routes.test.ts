import { afterEach, describe, expect, it, vi } from "vitest";
import { buildExercisesServer } from "./test-utils";

vi.mock("../../../db/exercises", () => ({
  filterExercises: vi.fn(),
  getExerciseById: vi.fn(),
  addExercise: vi.fn(),
  editExercise: vi.fn(),
  deleteExercise: vi.fn(),
}));

vi.mock("../../../utils/validation/exercise-validation", () => ({
  getExerciseErrors: vi.fn(() => []),
}));

import {
  addExercise,
  deleteExercise,
  editExercise,
  filterExercises,
  getExerciseById,
} from "../../../db/exercises";
import { getExerciseErrors } from "../../../utils/validation/exercise-validation";

afterEach(() => {
  vi.clearAllMocks();
});

describe("exercises routes", () => {
  it("GET /exercises returns data", async () => {
    (filterExercises as any).mockResolvedValue([{ id: 1, name: "Ex" }]);

    const app = await buildExercisesServer();
    const res = await app.inject({ method: "GET", url: "/exercises" });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ data: [{ id: 1, name: "Ex" }] });
    await app.close();
  });

  it("GET /exercises/:id returns data", async () => {
    (getExerciseById as any).mockResolvedValue([{ id: 2, name: "Ex2" }]);

    const app = await buildExercisesServer();
    const res = await app.inject({ method: "GET", url: "/exercises/2" });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ data: { id: 2, name: "Ex2" } });
    await app.close();
  });

  it("GET /exercises/:id returns 404 when not found", async () => {
    (getExerciseById as any).mockResolvedValue([]);

    const app = await buildExercisesServer();
    const res = await app.inject({ method: "GET", url: "/exercises/99" });

    expect(res.statusCode).toBe(404);
    expect(res.json()).toMatchObject({
      error: { message: "Exercise not found", errorCode: "NOT_FOUND" },
    });
    await app.close();
  });

  it("POST /exercises validates body", async () => {
    (getExerciseErrors as any).mockReturnValueOnce(["error"]);

    const app = await buildExercisesServer();
    const res = await app.inject({
      method: "POST",
      url: "/exercises",
      payload: { name: "" },
    });

    expect(res.statusCode).toBe(400);
    expect(res.json()).toMatchObject({
      error: { message: "Validation failed", errorCode: "VALIDATION_ERROR" },
    });
    await app.close();
  });

  it("POST /exercises creates exercise", async () => {
    (addExercise as any).mockResolvedValue({ id: 10 });

    const app = await buildExercisesServer();
    const res = await app.inject({
      method: "POST",
      url: "/exercises",
      payload: { name: "New", categoryId: "cat-1" },
    });

    expect(res.statusCode).toBe(201);
    expect(res.json()).toEqual({ data: { id: 10 }, success: true });
    await app.close();
  });

  it("PUT /exercises/:id returns 404 when not found", async () => {
    (editExercise as any).mockResolvedValue({ rowCount: 0 });

    const app = await buildExercisesServer();
    const res = await app.inject({
      method: "PUT",
      url: "/exercises/5",
      payload: {
        name: "Update",
        categoryId: 1,
        durationMinutes: 10,
        bpm: 120,
      },
    });

    expect(res.statusCode).toBe(404);
    expect(res.json()).toMatchObject({
      error: { message: "Exercise not found", errorCode: "NOT_FOUND" },
    });
    await app.close();
  });

  it("PUT /exercises/:id updates exercise", async () => {
    (editExercise as any).mockResolvedValue({ rowCount: 1 });

    const app = await buildExercisesServer();
    const res = await app.inject({
      method: "PUT",
      url: "/exercises/5",
      payload: { 
        
        name: "Update",
        categoryId: 1,
        durationMinutes: 10,
        bpm: 120, },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ success: true });
    await app.close();
  });

  it("DELETE /exercises/:id returns 404 when not found", async () => {
    (deleteExercise as any).mockResolvedValue({ rowCount: 0 });

    const app = await buildExercisesServer();
    const res = await app.inject({ method: "DELETE", url: "/exercises/7" });

    expect(res.statusCode).toBe(404);
    expect(res.json()).toMatchObject({
      error: { message: "Exercise not found", errorCode: "NOT_FOUND" },
    });
    await app.close();
  });

  it("DELETE /exercises/:id returns 204 when deleted", async () => {
    (deleteExercise as any).mockResolvedValue({ rowCount: 1 });

    const app = await buildExercisesServer();
    const res = await app.inject({ method: "DELETE", url: "/exercises/7" });

    expect(res.statusCode).toBe(204);
    await app.close();
  });
});
