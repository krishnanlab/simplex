import { ComponentProps, useCallback, useEffect, useState } from "react";
import Field from "@/components/Field";
import { splitComma } from "@/util/string";

type Props = Omit<ComponentProps<typeof Field>, "value" | "onChange"> & {
  value: Array<string>;
  onChange: (value: Array<string>) => unknown;
};

/** helper funcs */
const changed = (value: Array<string>, raw: string) =>
  JSON.stringify(value) !== JSON.stringify(rawToValue(raw));
const valueToRaw = (value: Array<string>) => value.join(", ").toLowerCase();
const rawToValue = (raw: string) => splitComma(raw.toLowerCase());

/** variation of field component with comma-separated array */
const ArrayField = ({ value, onChange, ...props }: Props) => {
  const [raw, setRaw] = useState("");

  /** when parent array value changes */
  useEffect(() => {
    /** set child text value */
    setRaw((raw) => {
      if (changed(value, raw)) return valueToRaw(value);
      else return raw;
    });
  }, [value]);

  /** when child text value changes */
  const onChangeRaw = useCallback(
    (raw: string) => {
      setRaw(raw);
      /** set parent array value */
      if (changed(value, raw)) onChange(rawToValue(raw));
    },
    [value, onChange]
  );

  return (
    <Field
      {...props}
      onBlur={() => setRaw(valueToRaw(value))}
      value={raw}
      onChange={onChangeRaw}
    />
  );
};

export default ArrayField;
