import { useState, useEffect, useMemo } from "react";
import Flex from "@/components/Flex";
import Button from "@/components/Button";
import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import Editor from "@/components/Editor";
import Stat from "@/components/Stat";
import Field from "@/components/Field";
import { exampleText } from "@/assets/example.json";
import { light } from "@/palette";
import { audiences, analyze, Audience } from "@/api/tool";
import { sleep } from "@/util/debug";

const Tool = () => {
  // input state
  const [text, setText] = useState("");
  const words = useMemo(
    () => text.split(/(\S+)/).filter((text) => text),
    [text]
  );
  const [audience, setAudience] = useState<Audience>("general");
  const [showHighlights, setShowHighlights] = useState(true);
  const [ignoreText, setIgnoreText] = useState("");
  const ignoreWords = useMemo(
    () =>
      ignoreText
        .split(",")
        .map((word) => word.trim())
        .filter((word) => word),
    [ignoreText]
  );

  // results state
  const [scores, setScores] = useState<Record<string, number>>({});
  const [complexity, setComplexity] = useState(0);
  const [gradeLevel, setGradeLevel] = useState(0);

  // other state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let latest = true;

    (async () => {
      // debounce
      await sleep(500);

      if (!latest) return;

      setLoading(true);

      const results = await analyze(words, audience, ignoreWords);

      if (!latest) return;

      setScores(results.scores);
      setComplexity(results.complexity);
      setGradeLevel(results.gradeLevel);

      setLoading(false);
    })();

    return () => {
      latest = false;
    };
  }, [
    words,
    audience,
    ignoreWords,
    setScores,
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
      <Editor {...{ text, setText, words, showHighlights, scores, loading }} />
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
          value={complexity.toFixed(0)}
          tooltip="Percentage of words that are difficult to understand for the selected audience. Improve this score by replacing complex and jargon words with more common and simpler ones. To learn how we calculate this score, see the About page."
        />
        <Stat
          label="Grade Level"
          value={gradeLevel.toFixed(0)}
          tooltip="Flesch-kincaid grade level score, calculated based on average word and sentence length. Improve this score by breaking long sentences into shorter ones, and replacing long, multi-syllabic words with shorter ones."
        />
      </Flex>
      <Field
        label="Ignore these words (exclude from complexity penalty)"
        value={ignoreText}
        placeholder="word, word, word"
        onChange={(event) => setIgnoreText(event.target.value)}
      />
    </>
  );
};

export default Tool;
