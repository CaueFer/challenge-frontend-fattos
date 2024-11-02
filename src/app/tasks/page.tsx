import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TaskTable from "@/components/Tables/taskTable";

export const metadata: Metadata = {
  title: "Next.js Tables | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const TasksPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tarefas" />

      <div className="flex flex-col gap-10">
        <TaskTable />
      </div>
    </DefaultLayout>
  );
};

export default TasksPage;
