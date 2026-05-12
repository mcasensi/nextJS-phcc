"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../Header/Logo";
import { Icon } from "@iconify/react";
import { FooterLinkType } from "@/app/types/footerlinks";
import { FooterLinkData } from "@/data/siteData";

const Footer = () => {
  const [footerlink, setFooterlink] = useState<FooterLinkType[]>([]);

  useEffect(() => {
    setFooterlink(FooterLinkData);
  }, []);

  return (
    <footer>
      <div className="container py-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-20 gap-5">
          <div className="w-fit">
            <Logo />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-10 gap-10 xl:gap-8">
          <div className="lg:col-span-2 sm:col-span-2 flex flex-col gap-5">
            <div className="flex gap-4">
              <a href="https://www.facebook.com/RedeemedTV21" target="_blank" rel="noreferrer">
                <Icon
                  icon="tabler:brand-facebook-filled"
                  width={45}
                  height={45}
                  className="text-darkblue dark:text-white bg-darkmode/5 dark:bg-white/10 rounded-lg p-2 hover:text-primary dark:hover:text-primary duration-300"
                />
              </a>
              <a
                href="https://www.youtube.com/@ThePottersHouseMandaluyong"
                target="_blank"
                rel="noreferrer"
              >
                <Icon
                  icon="tabler:brand-youtube-filled"
                  width={45}
                  height={45}
                  className="text-darkblue dark:text-white bg-darkmode/5 dark:bg-white/10 rounded-lg p-2 hover:text-primary dark:hover:text-primary duration-300"
                />
              </a>
            </div>
          </div>
          <div className="lg:col-span-4 sm:col-span-1">
            <div className="lg:flex sm:grid grid-cols-2 gap-8 sm:grid-cols-3">
              {footerlink.map((product, i) => (
                <div key={i} className="group relative col-span-2">
                  <p className="text-xl font-semibold mb-9">{product.section}</p>
                  <ul>
                    {product.links.map((item, idx) => (
                      <li key={idx} className="mb-3">
                        {item.href.startsWith("http") ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-darkblue/60 dark:text-white/60 hover:text-primary dark:hover:text-primary text-base font-normal mb-6"
                          >
                            {item.label}
                          </a>
                        ) : (
                          <Link
                            to={item.href}
                            className="text-darkblue/60 dark:text-white/60 hover:text-primary dark:hover:text-primary text-base font-normal mb-6"
                          >
                            {item.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-4 col-span-1 justify-self-end">
            <div className="flex gap-2">
              <Icon icon={"tabler:map-pin"} width={22} height={22} className="text-lightgrey" />
              <p className="text-base font-normal text-offwhite">
                <a href="https://www.google.com/maps?ll=14.573839,121.04563&z=17&t=m&hl=en&gl=PH&mapclient=embed&cid=8572489267378409514">
                  #29 Mayon St. Boni Kaliwa Brgy. Malamig Mandaluyong City
                </a>
              </p>
            </div>
            <div className="flex gap-2 mt-10">
              <Icon icon={"tabler:mail"} width={22} height={22} className="text-lightgrey" />
              <a href="mailto:phcc.mandaluyong@gmail.com">
                <p className="text-base font-normal text-offwhite hover:text-primary dark:hover:text-primary">
                  phcc.mandaluyong@gmail.com
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="py-3">
        <p className="text-center">@2020-2026</p>
      </div>
    </footer>
  );
};

export default Footer;
