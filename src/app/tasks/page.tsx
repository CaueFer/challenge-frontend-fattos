import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TaskTable from "@/components/Tables/taskTable";

const TasksPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tarefas" />

      <div className="max-w-screen">
        <TaskTable />
      </div>
    </DefaultLayout>
  );
};

export default TasksPage;
