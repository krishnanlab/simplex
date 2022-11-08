import { createPortal } from "react-dom";
import { css } from "@emotion/react";

export type FormValues = Record<string, string>;

interface Props {
  id: string;
  onSubmit: (data: FormValues) => unknown;
}

const formStyle = css({
  display: "contents",
});

const Form = ({ id, onSubmit }: Props) =>
  createPortal(
    <form
      css={formStyle}
      id={id}
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        onSubmit(Object.fromEntries(new FormData(form)) as FormValues);
      }}
    ></form>,
    document.body
  );

export default Form;
