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
        priority={priority}
        className={`${className} theme-light-only`}
      />
      <Image
        src="/brand/iris-logo-white.png"
        alt="IRIS"
        width={727}
        height={399}
        priority={priority}
        className={`${className} theme-dark-only`}
      />
    </>
  );
}
