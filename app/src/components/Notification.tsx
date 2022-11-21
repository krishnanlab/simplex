import { ReactNode, useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useEvent } from "react-use";
import { css } from "@stitches/react";
import Button from "@/components/Button";
import Flex from "@/components/Flex";
import Icon from "@/components/Icon";
import Section from "@/components/Section";
import Spinner from "@/components/Spinner";
import { accent, dark, deep } from "@/global/palette";
import { sleep } from "@/util/debug";

export interface Props {
  /** determins icon and color */
  type: "loading" | "error" | "success";
  /** text to show */
  text: string;
  children?: ReactNode;
}

const notificationStyle = css({
  margin: "60px 0",
  fontWeight: "400",
  color: dark,
  svg: {
    height: "25px",
  },
  "&[data-type='error'] svg": {
    color: accent,
  },
  "&[data-type='success'] svg": {
    color: deep,
  },
});

/** notification for status with icon and text */
const Notification = ({ type, text, children }: Props) => (
  <Flex
    className={notificationStyle()}
    gap="small"
    wrap={false}
    data-type={type}
  >
    {type === "loading" && <Spinner />}
    {type === "error" && <Icon icon="circle-exclamation" />}
    {type === "success" && <Icon icon="circle-check" />}
    {text && <span>{text}</span>}
    {children}
  </Flex>
);

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
  window.scrollTo(0, 0);
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
    <Section style={{ marginBottom: "-30px" }}>
      <Notification type={type} text={text}>
        <Button icon="times" fill={false} onClick={reset} />
      </Notification>
    </Section>
  );
};
