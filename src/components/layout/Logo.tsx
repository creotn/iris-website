import Image from "next/image";

export default function Logo({
  className,
  priority = false,
}: {
  className: string;
  priority?: boolean;
}) {
  return (
    <>
      <Image
        src="/brand/iris-logo-black.png"
        alt="IRIS"
        width={727}
        height={399}
        loading={priority ? "eager" : "lazy"}
        sizes="64px"
        className={`${className} theme-light-only`}
      />
      <Image
        src="/brand/iris-logo-white.png"
        alt="IRIS"
        width={727}
        height={399}
        loading={priority ? "eager" : "lazy"}
        sizes="64px"
        className={`${className} theme-dark-only`}
      />
    </>
  );
}
