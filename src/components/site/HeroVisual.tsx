export function HeroVisual() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br from-surface to-background p-6">
      <div className="absolute inset-0 opacity-30">
        <svg className="h-full w-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="20" y="20" width="60" height="30" rx="4" className="fill-primary/20 stroke-primary" />
          <rect x="90" y="20" width="90" height="30" rx="4" className="fill-primary/20 stroke-primary" />
          <rect x="20" y="70" width="45" height="35" rx="4" className="fill-ember/20 stroke-ember" />
          <rect x="80" y="70" width="45" height="35" rx="4" className="fill-ember/20 stroke-ember" />
          <rect x="140" y="70" width="40" height="35" rx="4" className="fill-primary/20 stroke-primary" />
          <line x1="50" y1="50" x2="50" y2="70" className="stroke-border" strokeDasharray="4 2" />
          <line x1="135" y1="50" x2="102" y2="70" className="stroke-border" strokeDasharray="4 2" />
        </svg>
      </div>
      <div className="relative z-10 flex h-full flex-col justify-end">
        <p className="text-sm font-medium text-foreground">Governed compliance workspace</p>
        <p className="text-xs text-muted-foreground">Frameworks · Controls · Evidence · Reporting</p>
      </div>
    </div>
  );
}
