import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ReactTimeAgo from "react-time-ago";

TimeAgo.addDefaultLocale(en);

interface Props {
  date: string;
}

const Ago = ({ date }: Props) => (
  <ReactTimeAgo date={new Date(date)} locale="en-US" />
);

export default Ago;
