import { useEffect, useRef, useState } from "react";
import { useEvent } from "react-use";
import { css } from "@stitches/react";
import { zxcvbn, zxcvbnOptions } from "@zxcvbn-ts/core";

const meterStyle = css({
  width: "100%",
});

const barStyle = css({
  content: "''",
  marginTop: "10px",
  width: "100%",
  height: "5px",
});

/** meter to put directly after/under a password input to check its strength */
const PasswordMeter = () => {
  const ref = useRef<HTMLDivElement>(null);
  /** zxcvbn password strength score */
  const [score, setScore] = useState(-1);
  /** input to check password of */
  const [input, setInput] = useState<HTMLInputElement | null>(null);

  const computeScore = (event: Event) => {
    /** get typed password */
    const password = (event.target as HTMLInputElement).value;

    /** if nothing typed yet, don't show meter */
    if (!password) {
      setScore(-1);
      return;
    }

    /** get text in other input fields */
    const userInputs = Array.from(
      document.querySelectorAll("input:not([type='password'])")
    ).map((element) => (element as HTMLInputElement).value);

    /** update dicts */
    setOptions(userInputs);

    /** calculate score */
    setScore(zxcvbn(password).score);
  };

  /** set input after render */
  useEffect(() => {
    const input = ref.current?.previousElementSibling as HTMLInputElement;
    if (input) setInput(input);
  }, []);

  /** listen for password typing */
  useEvent("input", computeScore, input);
  useEvent("change", computeScore, input);
  useEvent("paste", computeScore, input);

  /** compute styles */
  const color = ["#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e"][score];
  const text = ["Very Weak", "Weak", "Okay", "Strong", "Very Strong"][score];
  const clip = (100 * (4 - score)) / 5;

  return (
    <div ref={ref} className={meterStyle()}>
      <div
        className={barStyle()}
        style={{
          background: color,
          clipPath: `inset(0 ${clip}% 0 0)`,
        }}
      />
      {text}
    </div>
  );
};

export default PasswordMeter;

/** func to load dicts only when needed, since they are sizeable */
const setOptions = async (userInputs: Array<string>) => {
  const zxcvbnCommonPackage = await import("@zxcvbn-ts/language-common");
  const zxcvbnEnPackage = await import("@zxcvbn-ts/language-en");

  const options = {
    dictionary: {
      ...zxcvbnCommonPackage.default.dictionary,
      ...zxcvbnEnPackage.default.dictionary,
      userInputs,
    },
    graphs: zxcvbnCommonPackage.default.adjacencyGraphs,
    translations: zxcvbnEnPackage.default.translations,
  };

  zxcvbnOptions.setOptions(options);
};
