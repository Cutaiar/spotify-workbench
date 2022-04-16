import * as React from "react";
import { Avatar, Box, Button, Drop, Text } from "grommet";
import { Logout } from "grommet-icons";

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
          align={{ top: "bottom" }}
        >
          <Box
            align="center"
            justify="center"
            fill={false}
            pad="small"
            round="xsmall"
            background="dark-1"
            gap="medium"
          >
            <Box align="start" justify="start" direction="row" gap="small">
              <div style={{ height: 48 }}>
                <Avatar src={imageUrl}></Avatar>
                {ServiceTag()}
              </div>
              <Box
                align="start"
                justify="start"
                direction="column"
                gap="xxsmall"
              >
                <Text size="medium">{name}</Text>
                <Text size="small" color="dark-4">
                  {accountType}
                </Text>
              </Box>
            </Box>
            <Button
              size="medium"
              label="Log out"
              icon={<Logout size="medium" />}
              onClick={onClickLogout}
              fill
            />
          </Box>
        </Drop>
      )}
    </>
  );
};
