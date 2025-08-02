

export default function SkeletonBox({ width, height }: { width: number, height: number }) {
    return <p className={`animate-pulse`} style={{width: width, height: height}}></p>
}