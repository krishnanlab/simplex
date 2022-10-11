import { useEffect } from "react";
import { atom, useAtom } from "jotai";
import { css } from "@emotion/react";
import Flex from "@/components/Flex";
import Button from "@/components/Button";
import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import Editor from "@/components/Editor";
import Icon from "@/components/Icon";
import Field from "@/components/Field";
import { exampleText } from "./example.json";
import { dark, deep, light } from "@/palette";
import { audiences, analyze, Audience } from "@/api/tool";
import { sleep } from "@/util/debug";

export const textState = atom("", (_, set, value) => {
  set(highlightsState, []);
  set(textState, value);
});
export const audienceState = atom<Audience>("general");
export const showHighlightsState = atom(true);
export const ignoreListState = atom("");

export const highlightsState = atom<Array<{ text: string; score: number }>>([]);
export const complexityState = atom(Math.random() * 100);
export const gradeLevelState = atom("Collegiate");

export const loadingState = atom(false);

const Tool = () => {
  const [text, setText] = useAtom(textState);
  const [audience, setAudience] = useAtom(audienceState);
  const [showHighlights, setShowHighlights] = useAtom(showHighlightsState);
  const [ignoreList, setIgnoreList] = useAtom(ignoreListState);

  const [, setHighlights] = useAtom(highlightsState);
  const [complexity, setComplexity] = useAtom(complexityState);
  const [gradeLevel, setGradeLevel] = useAtom(gradeLevelState);

  const [, setLoading] = useAtom(loadingState);

  useEffect(() => {
    let latest = true;

    (async () => {
      // debounce
      await sleep(500);

      if (!latest) return;

      setLoading(true);

      const results = await analyze(text, audience, ignoreList);

      if (!latest) return;

      setHighlights(results.highlights);
      setComplexity(results.complexity);
      setGradeLevel(results.gradeLevel);

      setLoading(false);
    })();

    return () => {
      latest = false;
    };
  }, [
    text,
    audience,
    ignoreList,
    setHighlights,
    setComplexity,
    setGradeLevel,
    setLoading,
  ]);

  return (
    <>
      <Flex hAlign="space">
        <Button
          text="Try Example"
          icon="lightbulb"
          onClick={() => setText(exampleText)}
        />
        <Flex display="inline">
          <Select
            label="Audience"
            options={audiences}
            value={audience}
            onChange={(value) => setAudience(value)}
          />
          <Checkbox
            label="Highlights"
            checked={showHighlights}
            onChange={(event) => setShowHighlights(event.target.checked)}
          />
        </Flex>
      </Flex>
      <Editor />
      <Flex>
        <Flex display="inline" gap="small">
          <Stat
            label="Complex"
            tooltip="Click, select, or hover over a word to show synonyms, find simpler definitions on wikipedia, or exclude it from penalty in the whole document."
          />
          <svg viewBox="0 0 30 10" width="60px">
            <g fill={light}>
              <rect x="0" y="0" width="10" height="10" opacity="1" />
              <rect x="10" y="0" width="10" height="10" opacity="0.66" />
              <rect x="20" y="0" width="10" height="10" opacity="0.33" />
            </g>
          </svg>
          <Stat label="Simpler" />
        </Flex>
        <Stat label="Chars" value={text.length} />
        <Stat
          label="Words"
          value={text.split(/\s+/).filter((word) => word).length}
        />
        <Stat
          label="Overall Complexity"
          value={complexity.toFixed(1)}
          tooltip="Percentage of words that are difficult to understand for the selected audience. Improve this score by replacing complex and jargon words with more common and simpler ones. To learn how we calculate this score, see the About page."
        />
        <Stat
          label="Grade Level"
          value={gradeLevel}
          tooltip="Flesch-kincaid grade level score, calculated based on average word and sentence length. Improve this score by breaking long sentences into shorter ones, and replacing long, multi-syllabic words with shorter ones."
        />
      </Flex>
      <Field
        label="Ignore these words (exclude from complexity penalty)"
        value={ignoreList}
        placeholder="word, word, word"
        onChange={(event) => setIgnoreList(event.target.value)}
      />
    </>
  );
};

export default Tool;

interface StatProps {
  tooltip?: string;
  label?: string;
  value?: string | number;
}

const labelStyle = css({ color: dark });
const valueStyle = css({ color: deep });

const Stat = ({ tooltip, label, value }: StatProps) => (
  <Flex display="inline" gap="tiny">
    {tooltip && <Icon icon="question-circle" title={tooltip} />}
    {label && (
      <span css={labelStyle}>
        {label}
        {value !== undefined ? ":" : ""}
      </span>
    )}
    {value !== undefined && <span css={valueStyle}>{value}</span>}
  </Flex>
);
