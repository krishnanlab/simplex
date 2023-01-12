import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import Tooltip from "@/components/Tooltip";
import { DateString } from "@/global/types";
import { dateString, parseDate } from "@/util/string";

/** setup time-ago library */
TimeAgo.addDefaultLocale(en);

type Props = {
  /** iso date string */
  date: DateString;
};

/** show time in "ago" format  */
const Ago = ({ date }: Props) => (
  <Tooltip
    reference={
      <span>
        <ReactTimeAgo date={parseDate(date)} locale="en-US" />
      </span>
    }
    content={dateString(date)}
  />
);

export default Ago;
