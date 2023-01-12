import { useCallback, useState } from "react";
import { FaCheckCircle, FaRegCopy, FaShareAlt } from "react-icons/fa";
import Button from "@/components/Button";
import { Dialog } from "@/components/Dialog";
import Field from "@/components/Field";
import Flex from "@/components/Flex";

type Props = {
  /** heading in dialog */
  heading: string;
  /** field title in dialog  */
  field: string;
  /** question mark text on hover */
  help?: string;
};

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
const Content = ({ field, help }: Omit<Props, "heading">) => {
  const [link, setLink] = useState(window.location.href);
  const [copied, setCopied] = useState(false);

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
        icon={copied ? <FaCheckCircle /> : <FaRegCopy />}
        onClick={copy}
      />
    </Flex>
  );
};
