import { mergeStyles } from "@fluentui/merge-styles";
import { Depths, IVerticalDividerStyles, NeutralColors } from "@fluentui/react";

export const itemStack = mergeStyles({ paddingBottom: 100, paddingTop: 100 });

export const itemStyle = mergeStyles({
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

export const imageStyle = mergeStyles({
  width: "80%",
  height: "80%",
});

export const timelineRoot = mergeStyles({
  background: NeutralColors.gray10,
  height: "fitContent",
});

export const dividerStyles: IVerticalDividerStyles = {
  wrapper: {
    height: "200px",
  },
  divider: {
    background: NeutralColors.gray120,
    width: 2,
  },
};
