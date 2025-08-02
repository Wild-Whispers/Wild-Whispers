

export default function SkeletonLineMultiple({ styling, lineCount }: { styling: string, lineCount: number }) {
    const randWidth = () => {
        const minimum = 0.35;
        const maximum = 1;
        return Math.round((Math.random() * (maximum - minimum) + minimum) * 100);
    };

    return (
        <>
            {
                Array.from({ length: lineCount }).map((_, i) => (
                    
                    <p key={i} className={`animate-pulse h-2 bg-slate-50 rounded ${styling}`} style={{width: `${randWidth()}%`}}></p>
                ))
            }
        </>
    );
}