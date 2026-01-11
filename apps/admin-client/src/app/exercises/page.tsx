import { ExercisesTable } from "@/components/Exercise/ExercisesTable/ExercisesTable";
import { fetchCategories, fetchExercises } from "@/utils/exercises-api";
import { ResponseData } from "@/utils/request";
import { Typography } from "@mui/material";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { CreateExercise } from "@/components/Exercise/CreateExercise";
import type { Category, Exercise } from "@drum-scheduler/contracts";
import { ExerciseFilters } from "@/components/Exercise/ExercisesTable/ExerciseFilters";
import {
  TableButtonsWrapper,
} from "@/components/Common/Container";

type PageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ExercisesPage({ searchParams }: PageProps) {
  // Step 1: Create a new query client
  const queryClient = new QueryClient();
  let categories: Category[] = [];

  let { name, categoryId } = (await searchParams) || {};
  name = Array.isArray(name) ? name[0] : name ?? "";
  categoryId = Array.isArray(categoryId) ? categoryId[0] : categoryId ?? "";
  // if(searchParams) {
  //   name = (await searchParams)["name"]?.toString() || "";
  //   categoryId =  ( await searchParams)["categoryId"]?.toString() || "";
  // }
  // const name = searchParams ? searchParams["name"] : "";
  // const categoryId = searchParams ? searchParams["categoryId"] : "";
    

  await queryClient.prefetchQuery({
    queryKey: ["exercises", name, categoryId],
    queryFn: () =>  fetchExercises({ name, categoryId }),
  });
  try {
    categories = (await fetchCategories()) ?? []; // probably no need to prefetch or store in react-query cache
  } catch (error) {
    console.error("Error fetching categories:", error);
  }

  const { data } =
    queryClient.getQueryData<ResponseData<Exercise[]>>(["exercises"]) ?? {};
  if (data === null) {
    return <div>{"Error: couldn't fetch exercises data"}</div>;
  }
  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <TableButtonsWrapper>
          <Typography margin={0} variant="h1">
            Exercises
          </Typography>

          <CreateExercise />
        </TableButtonsWrapper>
 
        <ExerciseFilters initialValues={{name, categoryId}} categories={categories} />
        
  
        <ExercisesTable />
      </HydrationBoundary>
    </>
  );
}
