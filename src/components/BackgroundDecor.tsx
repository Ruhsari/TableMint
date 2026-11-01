import Image from 'next/image';

export function BackgroundDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden lg:block"
    >
      <Image
  src="/images/plate-left.png"
  alt=""
  width={360}
  height={360}
  unoptimized
  className="absolute -left-24 top-[520px]"
/>
      <Image
  src="/images/plate-right.png"
  alt=""
  width={160}
  height={215}
  quality={95}
  className="absolute -right-16 top-[820px]"
/>
    </div>
  );
}