import { useEffect } from "react";
import { truncate } from "lodash";

interface Props {
  title: string | Array<string>;
}

export const Meta = ({ title }: Props) => {
  useEffect(() => {
    const string = [title]
      .flat()
      .concat("Simplex")
      .map((part) => truncate(part, { length: 25, separator: " " }))
      .filter((part) => part)
      .join(" | ");

    document.title = string;

    document
      .querySelector("meta[name='title']")
      ?.setAttribute("content", string);
    document
      .querySelector("meta[property='og:title']")
      ?.setAttribute("content", string);
  }, [title]);

  return <></>;
};

export default Meta;
