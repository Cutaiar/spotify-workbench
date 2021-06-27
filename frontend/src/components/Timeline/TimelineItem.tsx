import {
  Depths,
  mergeStyles,
  NeutralColors,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
} from "@fluentui/react";
import * as React from "react";
import InView from "react-intersection-observer";
import { ModelViewer } from "./ModelViewer";

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

const textStyle = mergeStyles({ maxWidth: 400, paddingLeft: 42 });

export interface ITimelineItemProps {
  index: number;
  shouldRender?: boolean;
}

/**
 * An item in the timeline
 * @param props See `ITimelineItemProps`
 */
export const TimelineItem: React.FC<ITimelineItemProps> = (props) => {
  const { index, shouldRender } = props;

  return (
    <InView>
      {({ inView, ref, entry }) => (
        <div ref={ref}>
          <Stack horizontal horizontalAlign="start" verticalAlign="center">
            <Stack
              horizontalAlign="center"
              verticalAlign="center"
              className={itemStyle}
              tokens={{ childrenGap: 4 }}
            >
              {inView && shouldRender ? (
                <ModelViewer />
              ) : (
                <Spinner size={SpinnerSize.large} />
              )}
            </Stack>
            <Text className={textStyle}>
              <b>{index}</b>
              <br />
              Occaecat do pariatur quis nulla deserunt consectetur tempor minim
              ullamco. Fugiat adipisicing ut esse pariatur duis Lorem. Cupidatat
              elit cupidatat veniam veniam eu esse sit voluptate officia aliqua
              irure do elit cillum. Voluptate ullamco commodo in tempor laboris
              laboris ut occaecat reprehenderit pariatur.
            </Text>
          </Stack>
        </div>
      )}
    </InView>
  );
};
