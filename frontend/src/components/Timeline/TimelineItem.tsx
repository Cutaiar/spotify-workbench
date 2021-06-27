import {
  Depths,
  mergeStyles,
  NeutralColors,
  Spinner,
  Stack,
} from "@fluentui/react";
import * as React from "react";
import { ModelViewer } from "./ModelViewer";
import { isInViewport } from "./utils";

const itemStyle = mergeStyles({
  width: 200,
  height: 200,
  color: NeutralColors.gray160,
  background: NeutralColors.gray20,
  overflow: "hidden",
  borderRadius: "50%",
  borderColor: NeutralColors.gray120,
  borderWidth: 2,
  borderStyle: "solid",
  boxShadow: Depths.depth16,
});
export interface ITimelineItemProps {
  index: number;
}

/**
 * An item in the timeline
 * @param props See `ITimelineItemProps`
 */
export const TimelineItem: React.FC<ITimelineItemProps> = (props) => {
  const { index } = props;
  const ref = React.useRef<HTMLDivElement>(null);
  const shouldRender = ref.current && isInViewport(ref.current);

  return (
    <div ref={ref}>
      <Stack
        horizontalAlign="center"
        verticalAlign="space-between"
        className={itemStyle}
        gap={4}
      >
        {shouldRender ? <ModelViewer /> : <Spinner />}
        {index}
      </Stack>
    </div>
  );
};
