import { Rows } from "@canva/app-ui-kit";
import {
  AppError,
  ImageGrid,
  LoadingResults,
  PromptInput,
  ReportBox,
} from "src/components";
import { useAppContext } from "src/context";
import { EXPECTED_LOADING_TIME_IN_SECONDS } from "src/config";

export const ResultsPage = () => {
  const { isLoadingImages } = useAppContext();

  if (isLoadingImages) {
    return (
      <LoadingResults durationInSeconds={EXPECTED_LOADING_TIME_IN_SECONDS} />
    );
  }

  return (
    <Rows spacing="1u">
      <AppError />
      <Rows spacing="2u">
        <ImageGrid />
        <PromptInput />
        <ReportBox />
      </Rows>
    </Rows>
  );
};
