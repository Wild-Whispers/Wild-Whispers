

export default function SkeletonLineSingle({ styling }: { styling: string }) {
    const randWidth = () => {
        const minimum = 0.35;
        const maximum = 1;
        return Math.round((Math.random() * (maximum - minimum) + minimum) * 100);
    };

    return <p className={`animate-pulse w-full ${styling}`} style={{width: `${randWidth()}%`}}></p>
}