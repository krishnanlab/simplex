import { ReactNode, useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useEvent } from "react-use";
import { css } from "@emotion/react";
import Button from "@/components/Button";
import Icon from "@/components/Icon";
import Section from "@/components/Section";
import Spinner from "@/components/Spinner";
import { accent, dark, deep } from "@/global/palette";
import { sleep } from "@/util/debug";

export interface Props {
  type: "loading" | "error" | "success";
  text: string;
  children?: ReactNode;
}

const style = css({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
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

const Notification = ({ type, text, children }: Props) => (
  <div css={style} data-type={type}>
    {type === "loading" && <Spinner />}
    {type === "error" && <Icon icon="circle-exclamation" />}
    {type === "success" && <Icon icon="circle-check" />}
    {text && <span>{text}</span>}
    {children}
  </div>
);

export default Notification;

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

export const TopNotification = () => {
  const [type, setType] = useState<Props["type"]>();
  const [text, setMessage] = useState<Props["text"]>();
  const route = useLocation();

  const reset = useCallback(() => {
    setType(undefined);
    setMessage(undefined);
  }, []);

  useEffect(() => {
    reset();
  }, [reset, route]);

  const onNotification = useCallback((event: CustomEvent) => {
    const { type, text } = event.detail as Props;
    setType(type);
    setMessage(text);
  }, []);

  useEvent("notification", onNotification);

  if (!type || !text) return <></>;

  return (
    <Section css={css({ marginBottom: "-30px" })}>
      <Notification type={type} text={text}>
        <Button icon="times" fill={false} onClick={reset} />
      </Notification>
    </Section>
  );
};
