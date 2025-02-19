import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="flex justify-between px-10 py-4 items-center border-t">
      <div className="flex items-center gap-4">
        <Image
          src="/logo.svg"
          alt="logo"
          className="w-10 h-10 inline"
          width={100}
          height={100}
          loading="lazy" //default
        />
        <span>Snip Snap</span>
      </div>
      {new Date().getFullYear()} © Samir Khanal
    </footer>
  );
};

export default Footer;
