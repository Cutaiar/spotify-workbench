import * as React from "react";
import { Text, Stack, VerticalDivider, Link } from "@fluentui/react";

import * as data from "./items.json";

import * as style from "./Timeline.style";
import { TimelineItem } from "./TimelineItem";
import { checkScrollSpeed } from "./utils";
import { EndEndcap, StartEndcap } from "./Endcaps";

const getImage = (item: string) => {
  return (
    <img
      className={style.imageStyle}
      alt={item}
      src={`https://www.randomlists.com/img/things/${item}.webp`}
    ></img>
  );
};

const loadSize = 10;

export const Timeline: React.FC = (props) => {
  const [numberOfItems, setNumberOfItems] = React.useState(data.items.length);

  // does not work right. itemShouldRender is not accurate
  // Keep scroll speed in a variable so that we can delay loading canvases until scroll calms down
  // const [scrollSpeed, setScrollSpeed] = React.useState(0);
  // React.useEffect(() => {
  //   window.onscroll = () => {
  //     setScrollSpeed(checkScrollSpeed());
  //   };
  // }, []);
  // const scrollSpeedLoadingThreshold = 20;
  // const itemsShouldRender = scrollSpeed < scrollSpeedLoadingThreshold;

  return (
    <div className={style.timelineRoot}>
      <Stack
        horizontalAlign="center"
        tokens={{ childrenGap: 0 }}
        className={style.itemStack}
      >
        <StartEndcap />
        <VerticalDivider styles={style.dividerStyles} />
        {data.items.slice(0, numberOfItems).map((item, i) => (
          <>
            <TimelineItem
              index={i}
              shouldRender={/*itemsShouldRender */ true}
            />
            <VerticalDivider styles={style.dividerStyles} />
          </>
        ))}
        <VerticalDivider styles={style.dividerStyles} />
        <EndEndcap />
      </Stack>
    </div>
  );
};
