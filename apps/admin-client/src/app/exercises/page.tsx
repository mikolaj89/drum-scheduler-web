import { ExercisesTable } from "@/components/Exercise/ExercisesTable/ExercisesTable";
import { Typography } from "@mui/material";
import { CreateExercise } from "@/components/Exercise/CreateExercise";
import { ExerciseFilters } from "@/components/Exercise/ExercisesTable/ExerciseFilters";
import { TableButtonsWrapper } from "@/components/Common/Container";
import { fetchCategories, fetchExercises } from "@drum-scheduler/sdk";
import { buildExercisesQueryParams } from "@/utils/query-params";
import { Suspense } from "react";
import Loading from "./loading";

async function CategoriesAndFilters({
  name,
  categoryId,
}: {
  name: string;
  categoryId: string;
}) {
  const categories = await fetchCategories("http://localhost:8000");
  return (
    <ExerciseFilters
      initialValues={{ name, categoryId }}
      categories={categories ?? []}
    />
  );
}

async function ExercisesData({
  name,
  categoryId,
}: {
  name: string;
  categoryId: string;
}) {
  const queryString = buildExercisesQueryParams({
    name: name || null,
    categoryId: categoryId || null,
  });
  const exercises = await fetchExercises("http://localhost:8000", queryString);
  return <ExercisesTable initialData={exercises ?? []} filters={{ name, categoryId }} />;
}

type PageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ExercisesPage({ searchParams }: PageProps) {
  let { name, categoryId } = (await searchParams) || {};
  name = Array.isArray(name) ? name[0] : name ?? "";
  categoryId = Array.isArray(categoryId) ? categoryId[0] : categoryId ?? "";

  return (
    <>
      <TableButtonsWrapper>
        <Typography margin={0} variant="h1">
          Exercises
        </Typography>
        <CreateExercise />
      </TableButtonsWrapper>

      <Suspense fallback={<Loading />}>
        <CategoriesAndFilters name={name} categoryId={categoryId} />
      </Suspense>

      <Suspense fallback={<Loading />}>
        <ExercisesData name={name} categoryId={categoryId} />
      </Suspense>
    </>
  );
}
