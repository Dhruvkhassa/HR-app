interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({ 
  width = '100%', 
  height = '1em', 
  className = '', 
  variant = 'rectangular',
  animation = 'wave'
}: SkeletonProps) {
  const baseClasses = 'skeleton';
  const variantClasses = {
    text: 'skeleton-text',
    rectangular: '',
    circular: 'rounded-full'
  };
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    animationClasses[animation],
    className
  ].filter(Boolean).join(' ');

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return <div className={classes} style={style} />;
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export function SkeletonText({ lines = 3, className = '' }: SkeletonTextProps) {
  return (
    <div className={className}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          variant="text"
          width={index === lines - 1 ? '60%' : '100%'}
          className="skeleton-text"
        />
      ))}
    </div>
  );
}

interface SkeletonCardProps {
  className?: string;
  style?: React.CSSProperties;
}

export function SkeletonCard({ className = '', style }: SkeletonCardProps) {
  return (
    <div className={`card p-6 ${className}`} style={style}>
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1">
          <Skeleton width="70%" height="1.2em" className="mb-2" />
          <Skeleton width="50%" height="0.8em" />
        </div>
      </div>
      <SkeletonText lines={2} className="mb-4" />
      <div className="flex gap-2">
        <Skeleton width={60} height={24} />
        <Skeleton width={80} height={24} />
        <Skeleton width={70} height={24} />
      </div>
    </div>
  );
}
