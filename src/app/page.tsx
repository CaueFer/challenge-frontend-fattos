import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TasksPage from "./tasks/page";

export const metadata: Metadata = {
  title: "Fattos - TODO",
  description: "Technical Challenge - FATTOS",
};

export default function Home() {
  return (
    <>
      <TasksPage />
    </>
  );
}
