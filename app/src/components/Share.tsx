import { MouseEventHandler, ReactElement, useCallback } from "react";
import { FaMastodon, FaTwitter } from "react-icons/fa";
import { capitalize, truncate } from "lodash";
import Button from "@/components/Button";
import { Dialog } from "@/components/Dialog";
import Field from "@/components/Field";
import Flex from "@/components/Flex";
import { notification } from "@/components/Notification";

type Props = {
  /** element that triggers dialog */
  trigger: ReactElement;
  /** article or collection */
  type: string;
  /** title of article or collection */
  title: string;
  /** link to article or collection */
  link?: string;
  /** question mark text on hover */
  help?: string;
};

/** share dialog HOC */
const Share = (props: Props) => (
  <Dialog
    trigger={props.trigger}
    content={<Content {...props} />}
    heading={`Share ${capitalize(props.type)}`}
  />
);

export default Share;

/** dialog content */
const Content = ({ type, title, link, help }: Omit<Props, "heading">) => {
  /** fallback to current tab url */
  link ??= window.location.href;

  const message = `
✍️ Check out this ${type} on Simplex, an app for simplifying scientific and medical writing:

"${truncate(title, { length: 40 })}"
${link}

#simplex #simple #writing #${type}
`.trim();

  /** copy input contents to clipboard */
  const copy = useCallback<
    MouseEventHandler<HTMLInputElement | HTMLTextAreaElement>
  >((event) => {
    const target = event.target as HTMLInputElement;
    window.navigator.clipboard
      .writeText(target.value)
      .then(() => notification("success", "Copied to clipboard"));
  }, []);

  return (
    <Flex dir="col" hAlign="stretch">
      <Field
        label={`Link to this ${type}`}
        help={help}
        optional={true}
        value={link}
        onClick={copy}
      />
      <Field
        label={`Message about this ${type}`}
        optional={true}
        multi={true}
        value={message}
        onClick={copy}
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
