import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { FaExclamationCircle, FaRegCheckCircle, FaTimes } from "react-icons/fa";
import { useLocation } from "react-router";
import { useEvent } from "react-use";
import { css } from "@stitches/react";
import Button from "@/components/Button";
import Flex from "@/components/Flex";
import Section from "@/components/Section";
import Spinner from "@/components/Spinner";
import { accent, dark, deep } from "@/global/palette";
import { sleep } from "@/util/debug";

type Props = {
  /** determins icon and color */
  type: "loading" | "error" | "success";
  /** text to show */
  text: string | Array<unknown>;
  /** whether to scroll notification into view */
  scroll?: boolean;
  children?: ReactNode;
};

const notificationStyle = css({
  margin: "60px 0",
  fontWeight: "400",
  color: dark,
  svg: {
    height: "25px",
    flexShrink: 0,
  },
  span: {
    whiteSpace: "pre",
  },
  "&[data-type='error'] svg": {
    color: accent,
  },
  "&[data-type='success'] svg": {
    color: deep,
  },
});

/** notification for status with icon and text */
const Notification = ({ type, text, scroll = false, children }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scroll) return;
    const timer = window.setTimeout(
      () =>
        ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
      500
    );
    return () => window.clearTimeout(timer);
  });

  return (
    <Flex
      ref={ref}
      className={notificationStyle()}
      gap="small"
      wrap={false}
      data-type={type}
    >
      {type === "loading" && <Spinner />}
      {type === "error" && <FaExclamationCircle />}
      {type === "success" && <FaRegCheckCircle />}
      {text && <span>{[text].flat().filter(Boolean).join("\n")}</span>}
      {children}
    </Flex>
  );
};

export default Notification;

/** function to dispatch global notification */
export const notification = async (
  type: Props["type"],
  text: Props["text"]
) => {
  await sleep();
  window.dispatchEvent(
    new CustomEvent("notification", { detail: { type, text } })
  );
  await sleep(500);
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
};

/** global singleton notification at top of page */
export const TopNotification = () => {
  const [type, setType] = useState<Props["type"]>();
  const [text, setMessage] = useState<Props["text"]>();

  /** clear */
  const reset = useCallback(() => {
    setType(undefined);
    setMessage(undefined);
  }, []);

  const route = useLocation();

  /** clear when page changes */
  useEffect(() => {
    reset();
  }, [reset, route]);

  /** listen for global notification event */
  const onNotification = useCallback((event: CustomEvent) => {
    const { type, text } = event.detail as Props;
    setType(type);
    setMessage(text);
  }, []);
  useEvent("notification", onNotification);

  if (!type || !text) return <></>;

  return (
    <Section fill="offWhite">
      <Notification type={type} text={text}>
        <Button icon={<FaTimes />} fill={false} onClick={reset} />
      </Notification>
    </Section>
  );
};
