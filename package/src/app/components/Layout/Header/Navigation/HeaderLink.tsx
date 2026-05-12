"use client";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NavLinkType } from "@/app/types/navlink";

const HeaderLink: React.FC<{ item: NavLinkType }> = ({ item }) => {
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const handleMouseEnter = () => {
    if (item.submenu) {
      setSubmenuOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setSubmenuOpen(false);
  };

  const { pathname } = useLocation();
  const isActive = item.href
    ? pathname === item.href || pathname.startsWith(`${item.href}/`)
    : item.submenu?.some(
        (subItem) => pathname === subItem.href || pathname.startsWith(`${subItem.href}/`),
      );

  const linkClass = `text-base flex font-normal text-darkblue dark:text-white hover:text-primary dark:hover:text-primary ${
    isActive ? "!text-primary dark:!text-primary" : ""
  }`;

  return (
    <li className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {item.href ? (
        <Link to={item.href} className={linkClass}>
          {item.label}
          {item.submenu && (
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="m7 10l5 5l5-5"
              />
            </svg>
          )}
        </Link>
      ) : (
        <button type="button" className={linkClass}>
          {item.label}
          {item.submenu && (
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
              <path
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="m7 10l5 5l5-5"
              />
            </svg>
          )}
        </button>
      )}
      {submenuOpen && (
        <ul className="absolute py-2 left-0 mt-0.5 w-60 bg-white dark:bg-white/10 shadow-lg rounded-lg">
          {item.submenu?.map((subItem, index) => (
            <li key={index}>
              <Link
                to={subItem.href}
                className="block px-4 py-2 text-darkblue dark:text-white hover:bg-neutral-50 dark:hover:bg-darkmode/10 hover:text-primary dark:hover:text-primary"
              >
                {subItem.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default HeaderLink;
