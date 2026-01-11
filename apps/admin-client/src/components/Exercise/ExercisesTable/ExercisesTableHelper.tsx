import { GridColDef } from "@mui/x-data-grid";
import { Button } from "@mui/material";
import type { Exercise } from "@drum-scheduler/contracts";

type ExercisesColumns = {
  onDelete: (id: number) => void;
  onEditBtnClick: (id: number) => void;
};

export const getSessionExercisesColumns = ({
  onDelete,
}: ExercisesColumns): GridColDef<Exercise[][number]>[] => [
  {
    // placeholder for absolutely positioned drag handle.
    // I wasn't able to find an easy way to put handle here, while still keeping useSortable on row level
    // (where it's intended to be used)

    field: "up/down",
    headerName: "",
    width: 40,
    editable: false,
  },
  {
    field: "name",
    headerName: "Name",
    width: 150,
    editable: false,
  },
  {
    field: "description",
    headerName: "Description",

    width: 400,
    editable: false,
  },
  {
    field: "durationMinutes",
    headerName: "Duration (minutes)",
    type: "number",
    width: 150,

    editable: false,
  },
  {
    field: "bpm",
    headerName: "BPM",
    type: "number",
    flex: 1,
    editable: false,
  },
  {
    field: "actions",
    headerName: "Actions",
    type: "number",
    flex: 1,
    editable: false,
    renderCell: (params) => (
      <Button
        variant="outlined"
        color="primary"
        type="button"
        size="small"
        onClick={() => {

          onDelete(params.row.id);
        }}
      >
        Delete
      </Button>
    ),
  },
];

export const getExercisesColumns = ({
  onDelete,
  onEditBtnClick,
}: ExercisesColumns): GridColDef<Exercise[][number]>[] => [
  {
    field: "name",
    headerName: "Name",
    width: 150,
    editable: false,
  },
  {
    field: "description",
    headerName: "Description",

    width: 400,
    editable: false,
  },
  {
    field: "durationMinutes",
    headerName: "Duration (minutes)",
    type: "number",
    width: 150,

    editable: false,
  },
  {
    field: "bpm",
    headerName: "BPM",
    type: "number",
    flex: 1,
    editable: false,
  },
  {
    field: "actions",
    headerName: "Actions",
    type: "number",
    flex: 1,
    editable: false,
    renderCell: (params) => (
      <>
        <Button
          variant="outlined"
          color="primary"
          type="button"
          size="small"
          sx={{marginRight: 1}}
          onClick={() => {
            onEditBtnClick(params.row.id
            );
          }}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="primary"
          type="button"
          size="small"
          onClick={() => {
            onDelete(params.row.id);
          }}
        >
          Delete
        </Button>
      </>
    ),
  },
];
