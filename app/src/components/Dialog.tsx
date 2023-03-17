import { cloneElement, ReactElement, useState } from "react";
import { FaTimes } from "react-icons/fa";
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useId,
  useInteractions,
  useRole,
} from "@floating-ui/react-dom-interactions";
import { css } from "@stitches/react";
import Button from "@/components/Button";
import { dark, rounded, shadow, white } from "@/global/palette";

type Props = {
  /** element that triggers dialog */
  trigger: ReactElement;
  /** content in opened dialog */
  content: ReactElement;
  /** text at top of dialog */
  heading: string;
};

const overlayStyle = css({
  display: "grid",
  placeItems: "center",
  backgroundColor: dark + "c0",
});

const dialogStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  width: "min(calc(100vw - 40px), 500px)",
  padding: "30px",
  borderRadius: rounded,
  background: white,
  boxShadow: shadow,
  "& > *": {
    margin: "0",
  },
});

const headingStyle = css({
  display: "flex",
  alignItems: "center",
  h3: {
    flexGrow: "1",
    margin: "0",
  },
});

/** popup modal */
export const Dialog = ({ trigger, content, heading }: Props) => {
  const [open, setOpen] = useState(false);

  const {
    reference: ref,
    floating,
    context,
  } = useFloating({
    open,
    onOpenChange: setOpen,
  });

  const id = useId();

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useRole(context),
    useDismiss(context),
  ]);

  return (
    <>
      {/* reference */}
      {cloneElement(trigger, getReferenceProps({ ref, ...trigger.props }))}

      {/* dialog */}
      <FloatingPortal>
        {open && (
          <FloatingOverlay lockScroll className={overlayStyle()}>
            <FloatingFocusManager context={context}>
              <div
                ref={floating}
                className={dialogStyle()}
                aria-labelledby={`${id}-heading`}
                aria-describedby={`${id}-heading`}
                {...getFloatingProps()}
              >
                {/* top */}
                <div className={headingStyle()}>
                  <h3 id={`${id}-heading`}>{heading}</h3>
                  <Button
                    icon={<FaTimes />}
                    fill={false}
                    onClick={() => setOpen(false)}
                  />
                </div>

                {content}
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        )}
      </FloatingPortal>
    </>
  );
};
