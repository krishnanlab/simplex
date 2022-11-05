import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useEvent } from "react-use";
import { css } from "@emotion/react";
import Icon from "@/components/Icon";
import Spinner from "@/components/Spinner";
import { dark, pale, shadow } from "@/global/palette";
import { sleep } from "@/util/debug";

interface Detail {
  type: "clear" | "loading" | "error" | "success";
  message: string | undefined;
}

const delays: Record<Detail["type"], number> = {
  clear: 0,
  loading: 120,
  error: 20,
  success: 4,
};

export const notification = async (
  type: Detail["type"],
  message?: Detail["message"]
) => {
  await sleep();
  window.dispatchEvent(
    new CustomEvent("notification", { detail: { type, message } })
  );
};

const style = css({
  position: "fixed",
  bottom: "15px",
  right: "15px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "10px",
  background: dark,
  borderRadius: "999px",
  boxShadow: shadow,
  color: pale,
  span: {
    lineHeight: "1",
    marginLeft: "5px",
  },
  svg: {
    height: "25px",
  },
});

const Notification = () => {
  const [type, setType] = useState<Detail["type"]>();
  const [message, setMessage] = useState<Detail["message"]>();
  const timer = useRef<number>();

  const reset = useCallback(() => {
    window.clearTimeout(timer.current);
    setType(undefined);
    setMessage(undefined);
  }, []);

  const onNotification = useCallback(
    (event: CustomEvent) => {
      const { type, message } = event.detail as Detail;
      setType(type);
      setMessage(message);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(reset, delays[type] * 1000);
    },
    [reset]
  );

  useEvent("notification", onNotification);

  if (!type && !message) return <></>;

  return createPortal(
    // eslint-disable-next-line
    <div css={style} role="alert" aria-live="polite" onClick={reset}>
      {message && <span>{message}</span>}
      {type === "loading" && <Spinner />}
      {type === "error" && <Icon icon="circle-exclamation" />}
      {type === "success" && <Icon icon="circle-check" />}
    </div>,
    document.body
  );
};

export default Notification;
