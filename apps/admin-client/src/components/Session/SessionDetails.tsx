"use client";
import {
  removeExerciseFromSession,
} from "@/utils/sessions-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Paper } from "@mui/material";
import type { SessionWithExercises } from "@/utils/sessions-api";
import ExercisesTable from "../Exercise/ExercisesTable/SessionExercisesTable";
import { useCallback, useEffect, useState } from "react";
import { getSessionExercisesColumns } from "../Exercise/ExercisesTable/ExercisesTableHelper";
import AddIcon from "@mui/icons-material/Add";
import Divider from "@mui/material/Divider";
import { SelectExerciseModal } from "./AddExerciseToSessionModal/AddExerciseToSessionModal";
import type { Exercise } from "@drum-scheduler/contracts";
import { ButtonsWrapper, TableButtonsWrapper } from "../Common/Container";
import { useSessionQuery, useReorderSessionExercises } from "@drum-scheduler/sdk";

export const SessionDetails = ({
  sessionData,
}: {
  sessionData: SessionWithExercises;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderChanged, setIsOrderChanged] = useState(false);
  const queryClient = useQueryClient();

  const { data, isFetching } = useSessionQuery(
    "http://localhost:8000",
    sessionData.id,
    { initialData: sessionData, refetchOnMount: false }
  );

  const reorderMutation = useReorderSessionExercises(
    "http://localhost:8000",
    sessionData.id
  );

  const { mutate, isPending } = useMutation({
    mutationKey: ["deleteSession", sessionData.id],
    mutationFn: async ({
      sessionId,
      exerciseId,
    }: {
      sessionId: number;
      exerciseId: number;
    }) => {
      const result = await removeExerciseFromSession(sessionId, exerciseId);
      if ("error" in result) {
        throw new Error(result.error.message);
      }
    },
  });

  const [rows, setRows] = useState<Exercise[]>(data?.exercises ?? []);
  const handleChangeRows = useCallback(
    (rows: Exercise[]) => {
      setRows(rows);
      setIsOrderChanged(true);
    },
    [setRows]
  );

  useEffect(() => {
    if (data?.exercises) {
      setRows(data.exercises);
    }
  }, [data?.exercises]);

  const onSaveOrder = () => {
    reorderMutation.mutate(rows, {
      onSuccess: () => {
        setIsOrderChanged(false);
      },
    });
  };

  const onDelete = (exerciseId: number) => {
    mutate({
      sessionId: sessionData.id,
      exerciseId: exerciseId,
    });
    setRows((prev) => prev.filter((exercise) => exercise.id !== exerciseId));
  };

  const columns = getSessionExercisesColumns({
    onDelete,
    onEditBtnClick: onDelete,
  });

  const isTableLoading = reorderMutation.isPending || isFetching || isPending;

  return (
    <>
      {/* TODO: consider adding a total duration once i figure out how to sum it up with mp3 length. Otherwise it doesn't make sense  */}
      {/* <Typography variant="h2">  
        Total duration: {totalDuration} minutes
      </Typography> */}
      <SelectExerciseModal
        sessionId={sessionData.id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <Divider />
      <TableButtonsWrapper>
        <Button
          variant="contained"
          color="primary"
          type="button"
          size="medium"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
        >
          Add exercise
        </Button>
        <ButtonsWrapper>
          <Button
            disabled={!isOrderChanged}
            variant="outlined"
            color="primary"
            type="button"
            size="medium"
            onClick={onSaveOrder}
          >
            Save order
          </Button>
          {/* TODO:  reset button as followup - better for UX */}
          {/* <Button
            variant="outlined"
            color="error"
            type="button"
            size="medium"
            onClick={() => setIsModalOpen(true)}
          >
            Reset
          </Button> */}
        </ButtonsWrapper>
      </TableButtonsWrapper>
      <Paper>
        <ExercisesTable
          isLoading={isTableLoading}
          draggable={true}
          onChange={handleChangeRows}
          rows={rows}
          columns={columns}
        />
      </Paper>
    </>
  );
};
