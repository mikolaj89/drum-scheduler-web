"use client";
import { SelectField } from "@/components/Common/Field/Select";
import TextField from "@mui/material/TextField";
import { useForm } from "react-hook-form";
import { getCategoryOpts } from "../ExerciseForm/exercise-form-helper";
import type { Category } from "@drum-scheduler/contracts";
import {
    Card,
    CardContent,
    styled,
    Button,
    Box,
} from "@mui/material";
import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

type ExerciseFiltersProps = {
  categories: Category[];
  initialValues : {
    name: string;
  categoryId: string;
  }
  
};

const CardContentStyled = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  ":last-child": {
    paddingBottom: theme.spacing(2),
  },
}));

export const ExerciseFilters = ({
initialValues,
  categories,
}: ExerciseFiltersProps) => {
  const {name, categoryId} = initialValues;

  const {
    register,
    control,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { name, categoryId} });

  const router = useRouter();

  const onTextChange = useCallback(() => {
    let timeout: NodeJS.Timeout | null = null;

    return (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        const params = new URLSearchParams(window.location.search);
        params.set("name", event.target.value);
        router.push(`?${params.toString()}`);
        console.log(event.target.value);
      }, 500);
    };
  }, []);

  const onCategoryChange = (value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("categoryId", value);
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    reset({categoryId: "", name: ""});
    const params = new URLSearchParams(window.location.search);
    params.delete("name");
    params.delete("categoryId");
    router.push(`?${params.toString()}`);
   
  };

  const debouncedTextChange = useMemo(() => onTextChange(), []); // TODO: probably better would be to use useRef inside custom hook

  return (
    <Card sx={{marginBottom: 1}} variant="outlined">
        
      <CardContentStyled>
        <form>
          <Box sx={{display: "flex", justifyContent: "space-between", gap: 1}}>
            <Box display={"flex"} gap={1}>
            <TextField
              sx={{ minWidth: 300 }}
              size="small"
              label="Exercise Name"
              {...register("name")}
              onChange={(e) => debouncedTextChange(e)}
            />
            <SelectField
              size="small"
              sx={{ minWidth: 300, width: "auto" }}
              control={control}
              errors={errors}
              label="Category"
              name="categoryId"
              options={getCategoryOpts(categories ?? [])}
              onSelect={onCategoryChange}
            />
            </Box>
            <Box minWidth={160}>
              <Button
                onClick={clearFilters}
                sx={{ height: "100%", lineHeight: "normal" }}
                fullWidth={true}
                variant="outlined"
                type="button"
              >
                Clear Filters
              </Button>
            </Box>
          </Box>
        </form>
      </CardContentStyled>
    </Card>
  );
};
