import { useCallback, useEffect, useState } from "react";
import Field, { Props } from "@/components/Field";
import { splitComma } from "@/util/string";

type ModifiedProps = Omit<Props, "value" | "onChange"> & {
  value: Array<string>;
  onChange: (value: Array<string>) => unknown;
};

const changed = (value: Array<string>, raw: string) =>
  JSON.stringify(value) !== JSON.stringify(rawToValue(raw));
const valueToRaw = (value: Array<string>) => value.join(", ");
const rawToValue = (raw: string) => splitComma(raw);

const ArrayField = ({ value, onChange, ...props }: ModifiedProps) => {
  const [raw, setRaw] = useState("");

  useEffect(() => {
    setRaw((raw) => {
      if (changed(value, raw)) return valueToRaw(value);
      else return raw;
    });
  }, [value]);

  const onChangeRaw = useCallback(
    (raw: string) => {
      setRaw(raw);
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
