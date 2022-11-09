import { cloneElement, ReactElement, useRef, useState } from "react";
import { css } from "@emotion/react";
import {
  arrow,
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  safePolygon,
  shift,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useRole,
} from "@floating-ui/react-dom-interactions";
import { rounded, shadow, white } from "@/global/palette";

interface Props {
  /** element that triggers tooltip */
  reference: ReactElement;
  /** content in opened tooltip */
  content: string | ReactElement;
  /** whether to force open on render */
  open?: boolean;
  /** func called on close */
  onClose?: () => unknown;
}

const tooltipStyle = css({
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  width: "min(calc(100vw - 40px), 500px)",
  maxWidth: "max-content",
  padding: "15px 20px",
  borderRadius: rounded,
  background: white,
  boxShadow: shadow,
  outline: "none",
  zIndex: "999",
  "& > *": {
    margin: "0",
  },
});

const arrowSize = 20;

const arrowStyle = css({
  position: "absolute",
  width: arrowSize,
  height: arrowSize / 2,
  overflow: "hidden",
  "&:after": {
    content: "''",
    position: "absolute",
    display: "block",
    width: arrowSize,
    height: arrowSize,
    background: white,
    boxShadow: shadow,
    transform: "scale(0.5) rotate(45deg)",
  },
  "&[data-placement='top']:after": {
    bottom: "0",
  },
});

/**  tooltip popup */
const Tooltip = ({
  reference,
  content,
  open: passedOpen = false,
  onClose,
}: Props) => {
  const [open, setOpen] = useState(passedOpen);
  const arrowRef = useRef(null);

  const {
    reference: ref,
    floating,
    context,
    strategy: position,
    x: left,
    y: top,
    middlewareData,
    placement,
  } = useFloating({
    open,
    onOpenChange: (open) => {
      setOpen(open);
      if (!open) onClose?.();
    },
    middleware: [
      offset(arrowSize / 2),
      flip(),
      shift({ padding: 20 }),
      arrow({ element: arrowRef }),
    ],
    placement: "top",
    whileElementsMounted: autoUpdate,
  });

  const arrowX = middlewareData.arrow?.x || "";

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, {
      enabled: !passedOpen,
      handleClose: safePolygon(),
      delay: { open: 200, close: 100 },
    }),
    useRole(context),
    useDismiss(context),
  ]);

  return (
    <>
      {/* reference */}
      {cloneElement(reference, getReferenceProps({ ref, ...reference.props }))}

      {/* tooltip */}
      <FloatingPortal>
        {open && (
          <>
            <FloatingFocusManager
              context={context}
              modal={false}
              order={["reference", "content"]}
            >
              <div
                ref={floating}
                css={tooltipStyle}
                style={{
                  position,
                  top: top ?? "",
                  left: left ?? "",
                }}
                {...getFloatingProps()}
              >
                {content}

                {/* arrow/caret */}
                <div
                  ref={arrowRef}
                  data-placement={placement}
                  style={{
                    left: arrowX,
                    top: placement === "top" ? "100%" : "",
                    bottom: placement === "bottom" ? "100%" : "",
                  }}
                  css={arrowStyle}
                />
              </div>
            </FloatingFocusManager>
          </>
        )}
      </FloatingPortal>
    </>
  );
};

export default Tooltip;