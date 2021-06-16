import { mergeStyles } from "@fluentui/merge-styles";
import { NeutralColors } from "@fluentui/react";

export const itemStack = mergeStyles({ paddingBottom: 100, paddingTop: 100 });

export const itemStyle = mergeStyles({
  width: 200,
  height: 200,
  color: NeutralColors.gray160,
  background: NeutralColors.gray20,
  overflow: "hidden",
  borderRadius: "50%",
});

export const imageStyle = mergeStyles({
  width: "80%",
  height: "80%",
});
