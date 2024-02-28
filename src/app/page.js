"use client";
import Editor from "./components/editor";
export default function Home() {
  return (
    <main
      className="
      flex
      flex-col
      items-center
      justify-center
      w-screen
      h-screen
      bg-gray-900
  "
    >
      <Editor />
    </main>
  );
}
