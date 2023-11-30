
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Post",
  description: "Ini post",
};

export default function page({
  params: { postId },
}: {
  params: {
    postId: string;
  };
}) {
  return (
    <div>
      <h1>Ini post berdasarkan Id : {postId}</h1>
    </div>
  );
}
