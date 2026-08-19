import { useRef, useState, type ReactNode } from "react";

interface HomeCarouselProps {
  pages: ReactNode[];
}

// 나이 휠 피커에서 겪은 문제와 동일한 이유로, 스크롤이 실제로 멈춘 위치만
// activePage의 유일한 소스로 삼는다. 점(dot) 클릭은 스크롤만 실행하고,
// 값 갱신은 settle 핸들러 하나로 통일해서 레이스 컨디션을 원천 차단.
export default function HomeCarousel({ pages }: HomeCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout>>();
  const [activePage, setActivePage] = useState(0);

  function handleScroll() {
    const el = trackRef.current;
    if (!el) return;
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      const pageWidth = el.clientWidth;
      if (pageWidth === 0) return;
      const index = Math.min(pages.length - 1, Math.max(0, Math.round(el.scrollLeft / pageWidth)));
      setActivePage(index);
    }, 100);
  }

  function goToPage(index: number) {
    trackRef.current?.scrollTo({ left: index * trackRef.current.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="home-carousel-wrap">
      <div className="home-carousel-track" ref={trackRef} onScroll={handleScroll}>
        {pages.map((page, i) => (
          <div className="home-carousel-page" key={i}>
            {page}
          </div>
        ))}
      </div>
      <div className="home-carousel-dots">
        {pages.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`home-carousel-dot${i === activePage ? " active" : ""}`}
            aria-label={`${i + 1}번째 카드로 이동`}
            onClick={() => goToPage(i)}
          />
        ))}
      </div>
    </div>
  );
}
