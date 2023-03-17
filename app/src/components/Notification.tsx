import { cloneElement, Fragment, useCallback, useRef, useState } from "react";
import { FaExclamationCircle, FaRegCheckCircle, FaTimes } from "react-icons/fa";
import { Transition, TransitionStatus } from "react-transition-group";
import { useEvent } from "react-use";
import { css } from "@stitches/react";
import { CssComponent } from "@stitches/react/types/styled-component";
import Button from "@/components/Button";
import Flex from "@/components/Flex";
import Spinner from "@/components/Spinner";
import {
  accent,
  dark,
  deep,
  light,
  muted,
  pale,
  rounded,
} from "@/global/palette";
import { classNames } from "@/util/string";

/** types of notifications */
const types = {
  loading: {
    icon: <Spinner />,
    timeout: 60 * 5,
    color: dark,
    darkColor: pale,
  },
  success: {
    icon: <FaRegCheckCircle />,
    timeout: 5,
    color: deep,
    darkColor: muted,
  },
  error: {
    icon: <FaExclamationCircle />,
    timeout: 10,
    color: accent,
    darkColor: light,
  },
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
  transition: "250ms ease",
  transitionProperty: "opacity, clip-path",
  zIndex: 99,
  svg: {
    width: "25px",
    height: "25px",
  },
  button: {
    color: "inherit",
  },
});

/** transition group states */
const enter = css({ opacity: 1 });
const exit = css({ opacity: 0 });
const states: Partial<Record<TransitionStatus, CssComponent>> = {
  entering: enter,
  entered: enter,
  exiting: exit,
  exited: exit,
};

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
  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState<Props>({
    type: "success",
    text: "",
  });
  const timeout = useRef<number>();
  const ref = useRef();

  /** clear notification */
  const clear = useCallback(() => {
    window.clearTimeout(timeout.current);
    setShow(false);
  }, []);
  useEvent("clear-notification", clear);

  /** set notification */
  const onNotification = useCallback(
    (event: CustomEvent) => {
      const notification = event.detail as Props;
      window.clearTimeout(timeout.current);
      setShow(true);
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

  return (
    <Transition nodeRef={ref} in={show} timeout={250}>
      {(state) => (
        <Flex
          ref={ref}
          display="inline"
          gap="small"
          wrap={false}
          className={classNames([notificationStyle(), states[state]?.()])}
        >
          {cloneElement(types[notification.type].icon, {
            style: { color: types[notification.type].darkColor },
          })}
          <span>{textLines(notification.text)}</span>
          <Button icon={<FaTimes />} fill={false} onClick={clear} />
        </Flex>
      )}
    </Transition>
  );
};
