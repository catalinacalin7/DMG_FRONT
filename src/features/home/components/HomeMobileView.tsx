"use client";

import React, { useEffect, useState } from "react";

import { HOME_NAVIGATION } from "@/constants/home-navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const HomeMobileView = () => {
  const t = useTranslations("Navigation");

  const [size, setSize] = useState(0);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    const height = window.innerHeight;

    const minH = 600;
    const maxH = 900;
    const minVW = 10;
    const maxVW = 14;

    const clampedH = Math.max(minH, Math.min(maxH, height));
    const scale = ((clampedH - minH) / (maxH - minH)) * (maxVW - minVW) + minVW;

    setSize(scale);

    const updateHeight = () => {
      setHeight(window.innerHeight);
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <section className="grid grid-cols-2 gap-4 px-4 xl:hidden">
      {HOME_NAVIGATION.map((item) => (
        <Link
          href={item.href}
          key={item.label}
          className="flex min-h-full w-full flex-col rounded-xl bg-gray-50"
        >
          <div
            className="flex h-full items-center justify-center"
            style={{
              padding: `${size - 6}vw`,
              height: `${(height - 275) / 3}px`,
            }}
          >
            <item.icon
              className="text-blue-600"
              style={{ width: `${size + 4}vw`, height: `${size + 4}vw` }}
            />
          </div>

          <div className="bg-brand-dark rounded-b py-1 text-center">
            <p className="text-xs font-medium text-white">{t(item.label)}</p>
          </div>
        </Link>
      ))}
    </section>
  );
};

export default HomeMobileView;
