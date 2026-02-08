"use client";

import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FormError } from "../../Common/Typography";
import { SelectField } from "../../Common/Field/Select";
import {
  getCategoryOpts,
  getExercisesOpts,
} from "../../Exercise/ExerciseForm/exercise-form-helper";
import {
  useAddExerciseToSession,
  useCategoryExercisesQuery,
} from "./add-exercise-to-session-modal-helper";
import { useCategoriesQuery } from "@drum-scheduler/sdk";

const style = {
  position: "absolute",
  display: "flex",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  flexDirection: "column",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

type EditExerciseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sessionId: number;
};

export const SelectExerciseModal = ({
  isOpen,
  onClose,
  sessionId,
}: EditExerciseModalProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm({
    // defaultValues: initialValues,
    // resolver: zodResolver(exerciseSchema),
  });
  const categoryId = watch("categoryId");
  const exerciseId = watch("exerciseId");
  const queryClient = useQueryClient();

  const onSuccess = (sessionId: number) => {
    console.log('on success running')
    queryClient.invalidateQueries({ queryKey: ["session", sessionId] });

    reset();
    onClose();
  };

  // queries and mutations
  const API_BASE_URL = "http://localhost:8000";
  const categoriesQuery = useCategoriesQuery(API_BASE_URL);
  const categoryExercisesQuery = useCategoryExercisesQuery(categoryId);
  const addExerciseMutation = useAddExerciseToSession(
    sessionId,
    exerciseId,
    onSuccess
  );

  const onSubmit = () => {
    addExerciseMutation.mutate();
  };

  const isLoading =
    categoriesQuery.isLoading ||
    categoryExercisesQuery.isLoading ||
    addExerciseMutation.isPending;

  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={{ ...style }}>
          
          <Typography id="select-modal-title" variant="h1" component="h3">
            Select Exercise
          </Typography>
          <div>{categoryExercisesQuery.error?.message}</div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {categoriesQuery.error && (
              <FormError error>{categoriesQuery.error.message}</FormError>
            )}

            <SelectField
              control={control}
              errors={errors}
              label="Category"
              name="categoryId"
              options={getCategoryOpts(categoriesQuery?.data ?? [])}
            />
            <SelectField
              control={control}
              errors={errors}
              label="Exercise"
              name="exerciseId"
              options={getExercisesOpts(categoryExercisesQuery?.data ?? [])}
            />
            <Button
              size="large"
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Save Exercise"}
            </Button>
          </form>
          
        </Box>
      </Modal>
    </>
  );
};

