import { cloneElement, ReactElement, useState } from "react";
import { css } from "@emotion/react";
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
import Button from "@/components/Button";
import { dark, rounded, shadow, white } from "@/global/palette";

const overlayStyle = css({
  display: "grid",
  placeItems: "center",
  background: dark + "80",
});

const dialogStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  width: "min(calc(100vw - 40px), 350px)",
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

interface Props {
  reference: ReactElement;
  content: ReactElement;
  heading: string;
}

export const Dialog = ({ reference, content, heading }: Props) => {
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
      {cloneElement(reference, getReferenceProps({ ref, ...reference.props }))}
      <FloatingPortal>
        {open && (
          <FloatingOverlay lockScroll css={overlayStyle}>
            <FloatingFocusManager context={context}>
              <div
                ref={floating}
                css={dialogStyle}
                aria-labelledby={`${id}-heading`}
                aria-describedby={`${id}-heading`}
                {...getFloatingProps()}
              >
                <div css={headingStyle}>
                  <h3 id={`${id}-heading`}>{heading}</h3>
                  <Button
                    icon="times"
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
