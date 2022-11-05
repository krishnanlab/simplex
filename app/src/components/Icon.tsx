import { HTMLAttributes } from "react";
import {
  findIconDefinition,
  IconName,
  IconPrefix,
} from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  icon: IconName;
}

const findIcon = (icon: IconName) => {
  const prefixes: Array<IconPrefix> = ["far", "fas", "fab"];
  for (const prefix of prefixes) {
    const match = findIconDefinition({ prefix: prefix, iconName: icon });
    if (match) return match;
  }

  return null;
};

const Icon = ({ icon, ...props }: Props & HTMLAttributes<SVGElement>) => {
  const match = findIcon(icon);
  if (match) return <FontAwesomeIcon icon={match} {...props} />;
  else return <></>;
};

export default Icon;
