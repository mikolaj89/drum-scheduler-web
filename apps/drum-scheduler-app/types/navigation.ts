import { Exercise } from "@drum-scheduler/contracts";

export type RootStackParamList = {
  Sessions: undefined;
  Session: { sessionId: number };
  Exercise: {
    exercises: Exercise[];
    sessionName: string;
    exerciseIndex: number;
  };
};
