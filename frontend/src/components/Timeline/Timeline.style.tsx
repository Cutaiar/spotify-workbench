import { mergeStyles } from "@fluentui/merge-styles";
import { IVerticalDividerStyles, NeutralColors } from "@fluentui/react";

export const itemStack = mergeStyles({ paddingBottom: 100, paddingTop: 100 });

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
