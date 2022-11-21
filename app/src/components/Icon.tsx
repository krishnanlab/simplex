import { HTMLAttributes } from "react";
import {
  findIconDefinition,
  IconName,
  IconPrefix,
} from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
  /** font awesome icon name */
  icon: IconName;
} & HTMLAttributes<SVGElement>;

/** get matching icon in library from icon name */
const findIcon = (icon: IconName) => {
  const prefixes: Array<IconPrefix> = ["far", "fas", "fab"];
  for (const prefix of prefixes) {
    const match = findIconDefinition({ prefix: prefix, iconName: icon });
    if (match) return match;
  }

  return null;
};

/** font awesome icon */
const Icon = ({ icon, ...props }: Props) => {
  const match = findIcon(icon);
  if (match) return <FontAwesomeIcon icon={match} {...props} />;
  else return <></>;
};

export default Icon;
