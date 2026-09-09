import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ImageIcon, Calendar, Pencil, NotebookPen, WandSparkles } from 'lucide-react';
import React from 'react'

const QuickActionsCard = () => {
    
    
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Quick Actions</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <QuickAction icon={<ImageIcon />} label="Add Memory" />

          <QuickAction icon={<Calendar />} label="Add Event" />

          <QuickAction icon={<Pencil />} label="Write Note" />

          <QuickAction icon={<NotebookPen />} label="Create Quiz" />

          <QuickAction icon={<WandSparkles />} label="Plan Surprise" />

          <QuickAction icon={<ImageIcon />} label="Share Image" />
        </div>
      </CardContent>
    </Card>
  );
}

function QuickAction({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Button variant="ghost" className="group flex h-auto flex-col gap-2 py-2">
      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
        <span className="[&>svg]:size-5">{icon}</span>
      </div>

      <span className="text-[11px] font-medium">{label}</span>
    </Button>
  );
}

export default QuickActionsCard
