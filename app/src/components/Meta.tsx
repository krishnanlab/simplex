import { useEffect } from "react";
import { truncate } from "lodash";

interface Props {
  /** tab and document title */
  title: string | Array<string>;
}

/** set page meta data, similar to react-helmet */
export const Meta = ({ title }: Props) => {
  /** set title */
  useEffect(() => {
    /** concat title string from parts */
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
