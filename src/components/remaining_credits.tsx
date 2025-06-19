import { Link, Rows, Text, TextPlaceholder } from "@canva/app-ui-kit";
import { requestOpenExternalUrl } from "@canva/platform";
import { useAppContext } from "src/context";
import { FormattedMessage, useIntl } from "react-intl";

// @TODO: Replace this URL with your custom upselling link.
const PURCHASE_URL = "https://example.com";

export const RemainingCredits = (): JSX.Element | undefined => {
  const { remainingCredits, loadingApp } = useAppContext();

  const RemainingCreditsText = () => {
    if (loadingApp) {
      return <TextPlaceholder size="small" />;
    }

    return (
      <Text alignment="center" size="small">
        {remainingCredits > 0 ? (
          <FormattedMessage
            defaultMessage="Use <strong>1 of {remainingCredits, number}</strong> {remainingCredits, plural,
            one {credit}
            other {credits}
            }."
            description="A message to indicate the number of credits, of their total remaining credits, that will be used when generating an image"
            values={{
              remainingCredits,
              strong: (chunks) => <strong>{chunks}</strong>,
            }}
          />
        ) : (
          <FormattedMessage
            defaultMessage="No credits remaining."
            description="A message to indicate that there are no credits available to be used"
          />
        )}
      </Text>
    );
  };

  const openExternalUrl = async (url: string) => {
    await requestOpenExternalUrl({
      url,
    });
  };

  const intl = useIntl();

  return (
    <Rows spacing="0">
      <RemainingCreditsText />
      <Text alignment="center" size="small">
        <FormattedMessage
          defaultMessage="Purchase more credits at <link>example.com</link>."
          description="A message to prompt the user to purchase more credits. Do not translate <link>example.com</link>."
          values={{
            link: (chunks) => (
              <Link
                href={PURCHASE_URL}
                requestOpenExternalUrl={() => openExternalUrl(PURCHASE_URL)}
                title={intl.formatMessage({
                  defaultMessage: "Example Co. website",
                  description:
                    "A title for a link to the website of Example Co.",
                })}
              >
                {chunks}
              </Link>
            ),
          }}
        />
      </Text>
    </Rows>
  );
};
