import { FormEventHandler } from "react";
import { createPortal } from "react-dom";
import { css } from "@emotion/react";

interface Props {
  id: string;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

const style = css({
  display: "contents",
});

const Form = ({ id, onSubmit }: Props) =>
  createPortal(
    <form
      css={style}
      id={id}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event);
      }}
    ></form>,
    document.body
  );

export default Form;
