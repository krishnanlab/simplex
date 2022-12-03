import { useCallback, useEffect, useState } from "react";
import { FaShareAlt } from "react-icons/fa";
import { shareArticle, ShareOptions } from "@/api/article";
import Button from "@/components/Button";
import { Dialog } from "@/components/Dialog";
import Field from "@/components/Field";
import Flex from "@/components/Flex";
import { WriteArticle } from "@/global/types";

interface Props {
  /** heading in dialog */
  heading: string;
  /** field title in dialog  */
  field: string;
  /** question mark text on hover */
  help?: string;
  /** info needed for generating link */
  generate?: {
    article: WriteArticle;
    options: ShareOptions;
  };
}

/** share button with dialog HOC */
const Share = ({ heading, ...rest }: Props) => (
  <Dialog
    reference={<Button text="Share" icon={<FaShareAlt />} />}
    content={<Content {...rest} />}
    heading={heading}
  />
);

export default Share;

/** dialog content */
const Content = ({ field, help, generate }: Omit<Props, "heading">) => {
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  /** get link */
  useEffect(() => {
    (async () => {
      /** generate link from provided article */
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
      } else {
        /** otherwise, just take url in address bar */
        setLink(window.location.href);
      }
    })();
  }, [generate]);

  /** copy link to clipboard */
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
