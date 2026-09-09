'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

const error = () => {
  return (
    <>
      <p>Error!</p>

      <Link href={"/dashboard"}>
        <Button>Retry</Button>
      </Link>
    </>
  );
}

export default error
