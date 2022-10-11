import { atom, useAtom } from "jotai";
import Flex from "@/components/Flex";
import Button from "@/components/Button";
import Select from "@/components/Select";
import Checkbox from "@/components/Checkbox";
import Editor from "@/components/Editor";
import { exampleText } from "./example.json";

const audiences = [
  "general",
  "biology",
  "chemistry",
  "physics",
  "computer science",
  "mathematics",
];

export const textState = atom("");
export const audienceState = atom("general");
export const showHighlightsState = atom(true);

const Tool = () => {
  const [, setText] = useAtom(textState);
  const [audience, setAudience] = useAtom(audienceState);
  const [showHighlights, setShowHighlights] = useAtom(showHighlightsState);

  return (
    <>
      <Flex hAlign="space">
        <Button
          text="Try Example"
          icon="lightbulb"
          onClick={() => setText(exampleText)}
        />
        <Flex display="inline" margin={false}>
          <Select
            label="Audience"
            options={audiences}
            value={audience}
            onChange={(event) => setAudience(event.target.value)}
          />
          <Checkbox
            label="Highlights"
            checked={showHighlights}
            onChange={(event) => setShowHighlights(event.target.checked)}
          />
        </Flex>
      </Flex>
      <Editor />
    </>
  );
};

export default Tool;
