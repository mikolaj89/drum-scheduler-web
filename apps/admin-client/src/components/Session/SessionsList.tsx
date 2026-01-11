"use client";
import { deleteSession } from "@/utils/sessions-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import {
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import { TableLink } from "../Common/Link";
import { ConfirmationDialog } from "../Common/ConfirmationDialog";
import { useState } from "react";
import { fetchSessions } from "@drum-scheduler/sdk";
import { Session } from "@drum-scheduler/contracts";

export const SessionsList = ({ sessionsData }: { sessionsData: Session[] }) => {
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sessionIdToDelete, setSessionIdToDelete] = useState<number | null>(
    null
  );
  const result = useQuery({
    queryKey: ["sessions"],
    queryFn: fetchSessions,
    initialData: sessionsData,
    refetchOnMount: false,
  });

  const deleteMutation = useMutation({
    mutationKey: ["deleteSession"],
    mutationFn: async (sessionId: number) => {
      const result = await deleteSession(sessionId);
      if ("error" in result) {
        throw new Error(result.error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
      });
      setIsDeleteDialogOpen(false);
    },
  });

  const onDeleteBtnClick = (sessionId: number) => {
    setSessionIdToDelete(sessionId);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <ConfirmationDialog
        title="Delete session"
        message="Are you sure you want to delete this session? This action cannot be undone."
        onConfirm={() =>
           deleteMutation.mutate(sessionIdToDelete!)
        }
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Notes</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result.data?.map((row) => (
              <TableRow
                key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <TableLink
                    sx={{ fontWeight: "600" }}
                    href={`/sessions/${row.id}`}
                  >
                    {row.name}{" "}
                  </TableLink>
                </TableCell>
                <TableCell align="right">{row.notes}</TableCell>
                <TableCell align="right">
                  <Button
                    onClick={() => onDeleteBtnClick(row.id)}
                    variant="outlined"
                    color="error"
                  >
                    {" "}
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
