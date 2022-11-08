import { useCallback, useEffect, useState } from "react";
import { shareArticle, ShareOptions } from "@/api/article";
import Button from "@/components/Button";
import { Dialog } from "@/components/Dialog";
import Field from "@/components/Field";
import Flex from "@/components/Flex";
import { WriteArticle } from "@/global/types";

interface Props {
  heading: string;
  field: string;
  help?: string;
  generate?: {
    article: WriteArticle;
    options: ShareOptions;
  };
}

const Share = ({ heading, ...rest }: Props) => (
  <Dialog
    reference={<Button text="Share" icon="share-nodes" />}
    content={<Content {...rest} />}
    heading={heading}
  />
);

export default Share;

const Content = ({ field, help, generate }: Omit<Props, "heading">) => {
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      if (generate) {
        setLink("generating link...");
        try {
          const { link } = await shareArticle(
            generate.article,
            generate.options
          );
          setLink(link);
        } catch (error) {
          console.error(error);
          setLink("error generating link");
        }
      } else setLink(window.location.href);
    })();
  }, [generate]);

  const copy = useCallback(async () => {
    await window.navigator.clipboard.writeText(link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1000);
  }, [link]);

  return (
    <Flex dir="col" hAlign="stretch">
      <Field
        label={field}
        help={help}
        optional={true}
        value={link}
        onChange={setLink}
      />
      <Button
        text={copied ? "Copied" : "Copy"}
        icon={copied ? "circle-check" : "copy"}
        onClick={copy}
      />
    </Flex>
  );
};
