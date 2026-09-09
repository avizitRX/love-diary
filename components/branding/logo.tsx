import { Heart } from 'lucide-react';

const Logo = () => {
  return (
    <div className="flex items-center gap-2 px-2 py-3">
      <div className="flex size-9 items-center justify-center rounded-full bg-primary/10">
        <Heart className="size-5 fill-primary text-primary" />
      </div>
      <div>
        <h1 className="font-semibold leading-none">Love Diary</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Our story, together ♡
        </p>
      </div>
    </div>
  );
}

export default Logo
