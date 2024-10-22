import * as React from "react";
import * as bar from "@cloudscape-design/chat-components/loading-bar";
import Box from "@cloudscape-design/components/box";

export interface ILoadingProps {
    variant?: bar.LoadingBarProps.Variant;
    text?: string;
};

export const LoadingBar = (props: ILoadingProps) => {
  return (
    <div aria-live="polite">
      <Box
        margin={{ bottom: "xs", left: "l" }}
        color="text-body-secondary"
      >
        {props.text === undefined ? '' : props.text}
      </Box>
      <bar.default variant={props.variant || "gen-ai-masked"} />
    </div>
  );
}