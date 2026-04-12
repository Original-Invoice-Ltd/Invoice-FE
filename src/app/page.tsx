"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect if we're on the root path
    if (pathname === '/') {
      router.replace('/signIn');
    }
  }, [router, pathname]);

  return null;
};

export default Home;
