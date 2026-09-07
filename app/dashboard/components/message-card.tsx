import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import React from 'react'

const MessageCard = () => {
  return (
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="size-9">
                <AvatarImage src="/images/sarah.jpg" alt="Sarah" />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>

              <div>
                <p className="text-sm font-semibold">From Sarah</p>
              </div>
            </div>

            <span className="text-xs text-muted-foreground">10 min ago</span>
          </div>

          <p className="mt-4 text-sm leading-6">
            Can&apos;t wait for our little adventure this weekend! ❤️
          </p>

          <Button variant="secondary" size="sm" className="mt-3">
            Read Message
          </Button>
        </CardContent>
      </Card>
  );
}

export default MessageCard
