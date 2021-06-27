import { Link, Text } from "@fluentui/react";
import * as React from "react";

const endcapStyle = { maxWidth: 400 };

export interface IEndcapProps {}

export const StartEndcap: React.FC<IEndcapProps> = (props) => {
  return (
    <div style={endcapStyle}>
      <h2>Welcome to our trade chain</h2>
      <Text>
        An interactive, beautiful, digital showcase and record of our journey
        playing{" "}
        <Link
          href="https://www.faithgateway.com/faith-game-bigger-better/#.YNg9zTZKj0s"
          target="_blank"
          rel="noopener noreferrer"
        >
          bigger and better
        </Link>{" "}
        whilst travelling up the coast of california and the pnw -- the maiden
        voyage of our new van and lifestyle.
        <br />
        <br />
        We started with the first item in the chain below and as we met the
        people of the west coast, if the time was right, we asked them to be a
        part of our story, this story, by trading up for something bigger and
        better than the previous item.
        <br />
        <br />
        We hope you enjoy our humble attempt this novel form of storytelling.
        <br />
        <br />
      </Text>
    </div>
  );
};

export const EndEndcap: React.FC<IEndcapProps> = (props) => {
  return (
    <div style={endcapStyle}>
      <Text>
        This is the end of the line. We must be currently in possession of the
        last object and waiting for the right opportunity to trade up.
      </Text>
    </div>
  );
};
