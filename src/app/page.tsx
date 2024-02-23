import ContentTabs from "@/components/ContentTabs";
import Header from "@/components/Header";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-between bg-[#fff] p-24">
        <ContentTabs />
      </main>
    </>
  );
}
