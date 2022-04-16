import * as React from "react";
import { Avatar, Box, Button, Drop, Text } from "grommet";

export interface IAccountBadgeProps {
  imageUrl?: string;
  name: string;
  accountType: AccountType;
  onClickLogout: () => void;
}
// These are the currently supported accounts
type AccountType = "spotify" | "strava";

const iconUrls: Record<AccountType, string> = {
  spotify: "/Spotify_Icon_RGB_Green.png",
  strava: "/strava-icon.png",
};

/**
 * A badge representing a user logged into an account
 */
export const AccountBadge: React.FC<IAccountBadgeProps> = (props) => {
  const { imageUrl, name, accountType, onClickLogout } = props;

  const [showDrop, setShowDrop] = React.useState(false);
  const targetRef = React.useRef<HTMLDivElement>(null);

  const ServiceTag = () => (
    <img
      alt={iconUrls[accountType]}
      src={iconUrls[accountType]}
      width={14}
      height={14}
      style={{ position: "relative", bottom: 15, left: 35 }}
    ></img>
  );

  return (
    <>
      <div
        style={{ height: 48 }}
        onClick={() => setShowDrop(!showDrop)}
        ref={targetRef}
      >
        <Avatar src={imageUrl}></Avatar>
        {ServiceTag()}
      </div>
      {showDrop && (
        <Drop
          target={targetRef.current ?? undefined}
          onClickOutside={() => setShowDrop(false)}
        >
          <Box pad="small">
            <Box align="center" justify="center" fill={false}>
              <div style={{ height: 48 }}>
                <Avatar src={imageUrl}></Avatar>
                {ServiceTag()}
              </div>
              <Text size="small">{name}</Text>
              <Button size="small" onClick={onClickLogout}>
                Log out
              </Button>
            </Box>
          </Box>
        </Drop>
      )}
    </>
  );
};
