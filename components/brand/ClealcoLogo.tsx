import Image from "next/image";
import { cx } from "@/lib/utils";

export function ClealcoLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logos/clealco-logo.png"
      alt="Clealco"
      width={180}
      height={80}
      className={cx("h-auto object-contain", className)}
      priority={priority}
    />
  );
}
