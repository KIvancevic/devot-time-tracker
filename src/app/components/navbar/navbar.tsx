"use client";

import Link from "next/link";
import Image from "next/image";
import devotLogo from "@/app/assets/DevotLogo.svg";
import { Menubar } from "primereact/menubar";
import { TabMenu } from "primereact/tabmenu";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { Toast } from "primereact/toast";
import { Toast as ToastType } from "primereact/toast";
import { useRef } from "react";
import { useAuthContext } from "@/context/AuthContext";
import styles from "./navbar.module.css";
import { useState } from "react";
import { Button } from "primereact/button";

const navbar = () => {
  const toastRef = useRef<ToastType>(null);
  const { user, currentPath } = useAuthContext();
  const [isLogoutClicked, setIsLogoutClicked] = useState(false);
  const disableLogout = user === null ? true : false;
  const activeIndex =
    currentPath == "/history" ? 1 : currentPath == "/tracker" ? 0 : 3;

  const tabMenuItems = [
    {
      label: "Trackers",
      icon: "pi pi-clock",
      className: styles.tabTrackers,
      url: "/tracker",
    },
    {
      label: "History",
      icon: "pi pi-history",
      className: styles.tabTrackers,
      url: "/history",
    },
  ];

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        if (toastRef.current && user != null) {
          toastRef.current.show({
            severity: "info",
            summary: "Logged Out",
            detail: "You have successfully logged out of your account.",
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleMouseDownAndUp = () => {
    setIsLogoutClicked(!isLogoutClicked);
  };

  const start = (
    <>
      <Link href="/">
        <Image priority src={devotLogo} alt="Devot" />
      </Link>
    </>
  );

  const end = (
    <div className={styles.navbarOptions}>
      {user === null ? (
        <></>
      ) : (
        <>
          <TabMenu model={tabMenuItems} activeIndex={activeIndex} />
          <Button
            className={user === null ? styles.buttonDisabled : styles.logout}
            onClick={handleLogout}
            onMouseDown={handleMouseDownAndUp}
            onMouseUp={handleMouseDownAndUp}
            disabled={disableLogout}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={styles.logoutIcon}
            >
              <path
                d="M14.842 4.97042C14.717 4.92493 14.579 4.93097 14.4584 4.98722C14.3378 5.04346 14.2445 5.14531 14.199 5.27034C14.1535 5.39538 14.1596 5.53337 14.2158 5.65395C14.2721 5.77453 14.3739 5.86783 14.499 5.91333C16.09 6.49124 17.4264 7.61137 18.2735 9.07689C19.1205 10.5424 19.424 12.2596 19.1306 13.9267C18.8372 15.5938 17.9657 17.1041 16.6692 18.1924C15.3727 19.2806 13.7341 19.8772 12.0414 19.8772C10.3487 19.8772 8.71011 19.2806 7.41359 18.1924C6.11708 17.1041 5.24555 15.5938 4.95215 13.9267C4.65875 12.2596 4.96225 10.5424 5.80931 9.07689C6.65637 7.61137 7.99281 6.49124 9.58381 5.91333C9.70885 5.86783 9.81069 5.77453 9.86694 5.65395C9.92319 5.53337 9.92923 5.39538 9.88374 5.27034C9.83824 5.14531 9.74494 5.04346 9.62436 4.98722C9.50378 4.93097 9.36579 4.92493 9.24075 4.97042C7.42814 5.62899 5.90559 6.90528 4.94061 8.57503C3.97563 10.2448 3.62995 12.2012 3.9643 14.1005C4.29865 15.9999 5.29164 17.7206 6.76881 18.9605C8.24599 20.2003 10.1128 20.88 12.0414 20.88C13.9699 20.88 15.8368 20.2003 17.314 18.9605C18.7911 17.7206 19.7841 15.9999 20.1185 14.1005C20.4528 12.2012 20.1071 10.2448 19.1422 8.57503C18.1772 6.90528 16.6546 5.62899 14.842 4.97042Z"
                fill={isLogoutClicked ? "#F9F9Fd" : "#C4C5D7"}
                stroke={isLogoutClicked ? "#F9F9Fd" : "#C4C5D7"}
                strokeWidth="1"
              />
              <path
                d="M12.1417 2.88H11.941C11.7194 2.88 11.5398 3.05964 11.5398 3.28124V9.09918C11.5398 9.32077 11.7194 9.50041 11.941 9.50041H12.1417C12.3633 9.50041 12.5429 9.32077 12.5429 9.09918V3.28124C12.5429 3.05964 12.3633 2.88 12.1417 2.88Z"
                fill={isLogoutClicked ? "#F9F9Fd" : "#C4C5D7"}
                stroke={isLogoutClicked ? "#F9F9Fd" : "#C4C5D7"}
                strokeWidth="1"
              />
            </svg>
            Logout
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div>
      <Menubar end={end} start={start} className={styles.navbar} />
      <Toast ref={toastRef} />
    </div>
  );
};

export default navbar;
