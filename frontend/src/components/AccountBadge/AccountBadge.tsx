import * as React from "react";

export interface IAccountBadgeProps {
  imageUrl: string;
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
  return (
    <div
      className="namecard p-d-flex p-ai-center p-ml-auto"
      style={{
        background: "#191919",
        borderRadius: 8,
        position: "relative",
      }}
    >
      <img
        alt=""
        src={imageUrl}
        width={50}
        height={50}
        style={{ borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}
      ></img>
      <p
        style={{
          fontSize: 12,
          color: "#dcdfe1",
          overflow: "hidden",
          whiteSpace: "nowrap",
          paddingLeft: 14,
          paddingRight: 30,
        }}
      >
        {name}
      </p>
      <img
        alt=""
        src={iconUrls[accountType]}
        width={14}
        height={14}
        style={{ position: "absolute", top: "5px", right: "5px" }}
      ></img>
      <button className="logout" onClick={onClickLogout}>
        Log out
      </button>
    </div>
  );
};
