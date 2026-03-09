import Image from "next/image";
import { useState } from "react";
import { isValidDomain } from "../utils/vaildateDomain";

export function Favicon({ url }: { url: string }) {
  const fallback = "/images/favicon-32x32.png";
  const faviconUrl = isValidDomain(url)
    ? `https://www.google.com/s2/favicons?domain=${url}&sz=64`
    : fallback;
  const [hasError, setHasError] = useState(false);

  return (
    <Image
      src={hasError ? fallback : faviconUrl}
      alt="favicon"
      className="rounded-xl border border-base-300 h-12 w-12 p-1"
      width={64}
      height={64}
      onError={() => setHasError(true)}
    />
  );
}