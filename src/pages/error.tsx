import { useNavigate } from "react-router-dom";
import { Button, Rows, Text } from "@canva/app-ui-kit";
import { useAppContext } from "src/context";
import { Paths } from "src/routes";
import * as styles from "styles/components.css";
import { FormattedMessage, useIntl } from "react-intl";

/**
 * Bare bones Error Page, please add relevant information and behavior that your app requires.
 */
export const ErrorPage = () => {
  const navigate = useNavigate();
  const { setPromptInput, setIsLoadingImages } = useAppContext();
  const intl = useIntl();

  const onClick = () => {
    setPromptInput("");
    setIsLoadingImages(false);
    navigate(Paths.HOME);
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <Text>
          <FormattedMessage
            defaultMessage="Something went wrong."
            description="A message to indicate that something went wrong, but no more information is available"
          />
        </Text>
        <Button variant="primary" onClick={onClick} stretch={true}>
          {intl.formatMessage({
            defaultMessage: "Start over",
            description:
              "A button label to clear the error and the prompt and start again",
          })}
        </Button>
      </Rows>
    </div>
  );
};
