import Image from 'next/image';

export function BackgroundDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-full overflow-hidden"
    >
      {/* Декоративная тарелка с салатом слева (начинается под заголовком и видна у левого края) */}
      <div className="absolute top-[280px] -left-16 sm:-left-12 lg:-left-8">
        <Image
          src="/images/plate-left.png"
          alt=""
          width={540}
          height={540}
          unoptimized
          priority
          className="h-auto w-[360px] opacity-90 drop-shadow-md select-none sm:w-[440px] lg:w-[520px]"
        />
      </div>

      {/* Декоративная тарелка справа */}
      <div className="absolute top-[480px] -right-14 hidden sm:block lg:-right-8">
        <Image
          src="/images/plate-right.png"
          alt=""
          width={280}
          height={400}
          unoptimized
          className="h-auto w-[180px] opacity-80 drop-shadow-md select-none lg:w-[240px]"
        />
      </div>
    </div>
  );
}
