import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

TimeAgo.addDefaultLocale(en);

interface Props {
  /** iso date string */
  date: string;
}

/** show time in "ago" format  */
const Ago = ({ date }: Props) => (
  <ReactTimeAgo date={new Date(date)} locale="en-US" />
);

export default Ago;
