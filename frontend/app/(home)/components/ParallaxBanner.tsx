export default function ParallaxBanner({ imgSrc, imgAlt, children }: { imgSrc: string, imgAlt: string, children: React.ReactNode }) {
    return (
        <div className="relative w-full h-[600px] overflow-hidden -z-[-50] bg-no-repeat bg-cover" style={{ backgroundImage: `url(${imgSrc})` }}>
            {children}
        </div>
    );
} 