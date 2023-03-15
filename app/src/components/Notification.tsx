import { Fragment, ReactNode, useCallback, useRef, useState } from "react";
import { FaExclamationCircle, FaRegCheckCircle, FaTimes } from "react-icons/fa";
import { useEvent } from "react-use";
import { css } from "@stitches/react";
import Button from "@/components/Button";
import Flex from "@/components/Flex";
import Spinner from "@/components/Spinner";
import { accent, dark, deep, pale, rounded } from "@/global/palette";

/** types of notifications */
const types: Record<
  string,
  { icon: ReactNode; timeout: number; color: string }
> = {
  loading: { icon: <Spinner />, timeout: 60 * 5, color: dark },
  success: { icon: <FaRegCheckCircle />, timeout: 5, color: deep },
  error: { icon: <FaExclamationCircle />, timeout: 10, color: accent },
};

type Props = {
  /** type of notification */
  type: keyof typeof types;
  /** text to show */
  text: string | Array<unknown>;
};

const statusStyle = css({
  margin: "30px 0 !important",
  fontWeight: "400",
  svg: {
    width: "25px",
    height: "25px",
  },
});

const notificationStyle = css({
  position: "fixed",
  right: "10px",
  bottom: "10px",
  maxWidth: "100%",
  padding: "10px",
  borderRadius: rounded,
  background: dark,
  color: pale,
  fontWeight: "400",
  zIndex: 99,
  svg: {
    width: "25px",
    height: "25px",
  },
  button: {
    color: "inherit",
  },
});

/** turn possible array of text into separate lines */
const textLines = (text: Props["text"]) =>
  [text]
    .flat()
    .filter(Boolean)
    .map((line, index) => (
      <Fragment key={index}>
        {String(line)}
        <br />
      </Fragment>
    ));

/** status with icon and text */
const Status = ({ type, text }: Props) => (
  <Flex
    gap="small"
    wrap={false}
    className={statusStyle()}
    style={{ color: types[type].color }}
  >
    {types[type].icon}
    <span>{textLines(text)}</span>
  </Flex>
);

export default Status;

/** dispatch global notification */
export const notification = (type: Props["type"], text: Props["text"]) =>
  window.dispatchEvent(
    new CustomEvent("notification", { detail: { type, text } })
  );

/** clear current global notification */
export const clearNotification = () =>
  window.dispatchEvent(new CustomEvent("clear-notification"));

/** global notification */
export const Notification = () => {
  const [notification, setNotification] = useState<Props | null>(null);
  const timeout = useRef<number>();

  /** clear notification */
  const clear = useCallback(() => {
    window.clearTimeout(timeout.current);
    setNotification(null);
  }, []);
  useEvent("clear-notification", clear);

  /** set notification */
  const onNotification = useCallback(
    (event: CustomEvent) => {
      const notification = event.detail as Props;
      window.clearTimeout(timeout.current);
      setNotification(notification);
      if (event.detail)
        timeout.current = window.setTimeout(
          clear,
          types[notification.type].timeout * 1000
        );
    },
    [clear]
  );
  useEvent("notification", onNotification);

  if (notification === null) return <></>;

  return (
    <Flex
      display="inline"
      gap="small"
      wrap={false}
      className={notificationStyle()}
    >
      {types[notification.type].icon}
      <span>{textLines(notification.text)}</span>
      <Button icon={<FaTimes />} fill={false} onClick={clear} />
    </Flex>
  );
};
