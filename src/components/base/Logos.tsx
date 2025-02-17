import React from "react";
import Image from "next/image";
import amazon from "../../../public/Amazon_logo 1.png";
import slack from "../../../public/Slack_Technologies_Logo 1.png";
import zoom from "../../../public/Zoom_Communications_Logo 1.png";
import netfilx from "../../../public/Netflix_2015_logo 1.png";
import google from "../../../public/Google_2015_logo 1.png";

const loopLogos = [
  {
    img: amazon,
    alt: "amazon",
  },
  {
    img: slack,
    alt: "slack",
  },
  {
    img: google,
    alt: "google",
  },
  {
    img: zoom,
    alt: "zoom",
  },
  {
    img: netfilx,
    alt: "netfilx",
  },
];

export default function Logos() {
  return (
    <div className="hidden md:flex container mx-auto justify-around items-center p-4">
      {loopLogos.map((item, index) => (
        <Image
          src={item.img}
          width={100}
          height={100}
          alt={item.alt}
          key={index}
        />
      ))}
    </div>
  );
}
