"use client";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { TextField, Button, CircularProgress } from "@mui/material";
import { SelectField } from "../../Common/Field/Select";
import {
  exerciseSchema,
  ExerciseFormData,
  getCategoryOpts,
  getExerciseSubmitFormat,
} from "./exercise-form-helper";
import { useCategoriesQuery, useCreateExercise } from "@drum-scheduler/sdk";

export const ExerciseForm = () => {
  const API_BASE_URL = "http://localhost:8000";
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(exerciseSchema),
  });
  const queryClient = useQueryClient();

  const mutation = useCreateExercise<ExerciseFormData>(API_BASE_URL);

  const categoriesData = useCategoriesQuery(API_BASE_URL).data;

  const onSubmit = (data: ExerciseFormData) => {
    mutation.mutate(getExerciseSubmitFormat(data), {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <TextField
        label="Exercise Name"
        {...register("name")}
        error={!!errors.name}
        helperText={errors.name?.message}
      />
      <SelectField
        control={control}
        errors={errors}
        label="Category"
        name="categoryId"
        options={getCategoryOpts(categoriesData ?? [])}
      />
      <TextField
        type="text"
        multiline
        label="Description (optional)"
        {...register("description")}
        error={!!errors.description}
        helperText={errors.description?.message}
      />
      <TextField
        label="BPM"
        type="number"
        {...register("bpm")}
        error={!!errors.bpm}
        helperText={errors.bpm?.message}
      />
      <TextField
        label="Duration in minutes"
        type="number"
        {...register("durationMinutes")}
        error={!!errors.durationMinutes}
        helperText={errors.durationMinutes?.message}
      />
      <TextField
        label="MP3 URL (optional)"
        {...register("mp3Url")}
        error={!!errors.mp3Url}
        helperText={errors.mp3Url?.message}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? <CircularProgress size={24} /> : "Add Exercise"}
      </Button>
    </form>
  );
};
