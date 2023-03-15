import { useCallback, useState } from "react";
import { FaMastodon, FaShareAlt, FaTwitter } from "react-icons/fa";
import Button from "@/components/Button";
import { Dialog } from "@/components/Dialog";
import Field from "@/components/Field";
import Flex from "@/components/Flex";
import { capitalize, truncate } from "lodash";
import { notification } from "@/components/Notification";

type Props = {
  /** article or collection */
  type: string;
  /** title of article or collection */
  title: string;
  /** question mark text on hover */
  help?: string;
};

/** share button with dialog HOC */
const Share = (props: Props) => (
  <Dialog
    reference={<Button text="Share" icon={<FaShareAlt />} />}
    content={<Content {...props} />}
    heading={`Share ${capitalize(props.type)}`}
  />
);

export default Share;

/** dialog content */
const Content = ({ type, title, help }: Omit<Props, "heading">) => {
  const [link, setLink] = useState(window.location.href);

  const message = `
✍️ Check out this ${type} on Simplex, an app for simplifying scientific and medical writing:

"${truncate(title, { length: 40 })}"
${link}

#simplex #simple #writing #${type}
`.trim();

  /** copy link to clipboard */
  const copyLink = useCallback(async () => {
    await window.navigator.clipboard.writeText(link);
    notification("success", "Copied link to clipboard");
  }, [link]);

  /** copy message to clipboard */
  const copyMessage = useCallback(async () => {
    await window.navigator.clipboard.writeText(message);
    notification("success", "Copied message to clipboard");
  }, [message]);

  return (
    <Flex dir="col" hAlign="stretch">
      <Field
        label={`Link to this ${type}`}
        help={help}
        optional={true}
        value={link}
        onChange={setLink}
        onClick={copyLink}
      />
      <Field
        label={`Message about this ${type}`}
        optional={true}
        multi={true}
        value={message}
        onClick={copyMessage}
      />
      <Flex gap="small">
        <Button
          to={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            message
          )}`}
          target="_blank"
          rel="noreferrer"
          icon={<FaTwitter />}
          text="Twitter"
        />
        <Button
          to={`https://mastodonshare.com/?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noreferrer"
          icon={<FaMastodon />}
          text="Mastodon"
        />
      </Flex>
    </Flex>
  );
};
