"use client";

import { useSession } from "next-auth/react";

const UserComponent = () => {
  const session = useSession();

  return <p>Welcome {session?.data?.user?.name}</p>;
};

export { UserComponent };
