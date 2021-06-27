import * as React from "react";
import {
  PrimaryButton,
  Stack,
  Separator,
  VerticalDivider,
} from "@fluentui/react";
import { ModelViewer } from "./ModelViewer";

import * as data from "./items.json";

import * as style from "./Timeline.style";
import { TimelineItem } from "./TimelineItem";

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
  const [numberOfItems, setNumberOfItems] = React.useState(loadSize);
  return (
    <div className={style.timelineRoot}>
      <Stack horizontalAlign="center" gap={0} className={style.itemStack}>
        {data.items.slice(0, numberOfItems).map((item, i) => (
          <>
            <TimelineItem index={i} />
            <VerticalDivider styles={style.dividerStyles} />
          </>
        ))}
        <PrimaryButton
          text="Load more"
          onClick={() => setNumberOfItems((prev) => prev + loadSize)}
        />
      </Stack>
    </div>
  );
};
