import { useCallback, useState } from "react";
import { shareArticle, ShareOptions } from "@/api/article";
import Button from "@/components/Button";
import { Dialog } from "@/components/Dialog";
import Field from "@/components/Field";
import { WriteArticle } from "@/global/types";

interface Props {
  heading: string;
  field: string;
  generate?: {
    article: WriteArticle;
    options: ShareOptions;
  };
}

const Share = ({ heading, field, generate }: Props) => {
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  const onOpen = useCallback(async () => {
    if (generate) {
      setLink("generating link...");
      const { link } = await shareArticle(generate.article, generate.options);
      setLink(link);
    } else setLink(window.location.href);
  }, [generate]);

  const copy = useCallback(async () => {
    await window.navigator.clipboard.writeText(link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1000);
  }, [link]);

  return (
    <Dialog
      reference={<Button text="Share" icon="share-nodes" />}
      content={
        <>
          <Field
            label={field}
            optional={true}
            value={link}
            onChange={setLink}
          />
          <Button
            text={copied ? "Copied" : "Copy"}
            icon={copied ? "circle-check" : "copy"}
            onClick={copy}
          />
        </>
      }
      heading={heading}
      onOpen={onOpen}
    />
  );
};

export default Share;
