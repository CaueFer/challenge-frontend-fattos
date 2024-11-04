"use client";

import { DollarSign, Tag } from "lucide-react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import DatePicker from "../Inputs/datePicker";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ITask } from "@/types/task";
import Alerts from "../alerts/alerts";
import SwitchInput from "../Inputs/switchInput";

const createTaskSchema = (
  nameRequired: boolean,
  deadlineRequired: boolean,
  priceRequired: boolean,
) =>
  z.object({
    name: z
      .string()
      .nullable()
      .optional()
      .refine(
        (val) =>
          !nameRequired ||
          (val !== null && val !== undefined && val.length >= 4),
        {
          message: "O nome está muito simples",
        },
      )
      .refine(
        (val) =>
          !nameRequired ||
          (val !== null && val !== undefined && val.length <= 20),
        {
          message: "O nome da tarefa não pode ter mais de 20 caracteres",
        },
      )
      .refine((val) => !nameRequired || !!val, {
        message: "O nome é obrigatório",
      }),
    price: z
      .number()
      .min(0, "Preço deve ser um número positivo")
      .optional()
      .refine((val) => !priceRequired || val !== undefined, {
        message: "O custo é obrigatório",
      }),
    deadline: z
      .string()
      .nullable()
      .optional()
      .refine(
        (value) => !deadlineRequired || (value && !isNaN(Date.parse(value))),
        {
          message: "Selecione uma data válida",
        },
      ),
  });

type FormData = z.infer<ReturnType<typeof createTaskSchema>>;

type EditTaskFormProps = {
  onClose: () => void;
  setTaskList: Dispatch<SetStateAction<ITask[]>>;
  id: number;
};

function EditTaskForm({ onClose, setTaskList, id }: EditTaskFormProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [nameRequired, setNameRequired] = useState(false);
  const [deadlineRequired, setDeadlineRequired] = useState(false);
  const [priceRequired, setPriceRequired] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(
      createTaskSchema(nameRequired, deadlineRequired, priceRequired),
    ),
    defaultValues: {
      name: "",
      price: 0,
      deadline: selectedDate,
    },
  });

  useEffect(() => {
    clearErrors();
  }, [nameRequired, deadlineRequired, priceRequired, clearErrors]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    data = {
      ...data,
      price: !priceRequired ? undefined : data.price,
    };

    console.log(data);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/task/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao editar a tarefa");
      }

      const responseData: ITask = await response.json();

      Alerts.showSuccess("Sucesso", "Tarefa foi editada com sucesso!");

      setTaskList((prev) => {
        const index = prev.findIndex((task) => task.id === responseData.id);
        if (index !== -1) {
          const updatedTasks = [...prev];
          updatedTasks[index] = responseData;
          return updatedTasks;
        }
        return prev;
      });
    } catch (err) {
      console.error(err);
      Alerts.showError("Opss", "Ocorreu um erro ao editar a tarefa.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setValue("deadline", selectedDate);
  }, [selectedDate, setValue]);

  return (
    <div className="rounded-sm bg-white dark:bg-boxdark">
      <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
        <h3 className="text-xl font-medium text-black dark:text-white">
          Editar Tarefa
        </h3>
      </div>
      <div className="pt-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-5.5">
            <div className="mb-3 flex flex-row justify-between">
              <label
                className="text-md block text-start font-medium text-black dark:text-white"
                htmlFor="name"
              >
                Novo Nome da Tarefa
              </label>
              <SwitchInput
                checked={nameRequired}
                onChange={() => setNameRequired((prev) => !prev)}
                id="nameRequired"
              />
            </div>

            <div className="relative">
              <span className="absolute left-4.5 top-4">
                <Tag height={20} />
              </span>
              <input
                disabled={!nameRequired}
                {...register("name")}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 pl-11.5 font-normal outline-none transition focus:border-primary active:border-primary disabled:bg-gray-300/25 dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                type="text"
                placeholder="Desenvolver Tela Login"
              />
              {errors.name && (
                <p className="text-start text-red-500">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="mb-5.5">
            <div className="mb-3 flex flex-row justify-between">
              <label
                className="text-md block text-start font-medium text-black dark:text-white"
                htmlFor="date"
              >
                Novo Data Limite
              </label>
              <SwitchInput
                checked={deadlineRequired}
                onChange={() => setDeadlineRequired((prev) => !prev)}
                id="deadlineRequired"
              />
            </div>

            <div className="relative">
              <span className="absolute left-4.5 top-4">
                <svg
                  className="fill-current"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g opacity="0.8">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.33301 4.16667C2.87658 4.16667 2.49967 4.54357 2.49967 5V15C2.49967 15.4564 2.87658 15.8333 3.33301 15.8333H16.6663C17.1228 15.8333 17.4997 15.4564 17.4997 15V5C17.4997 4.54357 17.1228 4.16667 16.6663 4.16667H3.33301ZM0.833008 5C0.833008 3.6231 1.9561 2.5 3.33301 2.5H16.6663C18.0432 2.5 19.1663 3.6231 19.1663 5V15C19.1663 16.3769 18.0432 17.5 16.6663 17.5H3.33301C1.9561 17.5 0.833008 16.3769 0.833008 15V5Z"
                      fill=""
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0.983719 4.52215C1.24765 4.1451 1.76726 4.05341 2.1443 4.31734L9.99975 9.81615L17.8552 4.31734C18.2322 4.05341 18.7518 4.1451 19.0158 4.52215C19.2797 4.89919 19.188 5.4188 18.811 5.68272L10.4776 11.5161C10.1907 11.7169 9.80879 11.7169 9.52186 11.5161L1.18853 5.68272C0.811486 5.4188 0.719791 4.89919 0.983719 4.52215Z"
                      fill=""
                    />
                  </g>
                </svg>
              </span>
              <DatePicker
                deadlineRequired={deadlineRequired}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />
              {errors.deadline && (
                <p className="text-start text-red-500">
                  {errors.deadline.message}
                </p>
              )}
            </div>
          </div>

          <div className="mb-5.5">
            <div className="mb-3 flex flex-row justify-between">
              <label
                className="text-md block text-start font-medium text-black dark:text-white"
                htmlFor="price"
              >
                Novo Custo
              </label>
              <SwitchInput
                checked={priceRequired}
                onChange={() => setPriceRequired((prev) => !prev)}
                id="priceRequired"
              />
            </div>
            <div className="relative">
              <span className="absolute left-4.5 top-4">
                <DollarSign height={20} />
              </span>
              <input
                disabled={!priceRequired}
                {...register("price", { valueAsNumber: true })}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 pl-11.5 font-normal outline-none transition focus:border-primary active:border-primary disabled:bg-gray-300/25 dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                type="number"
                placeholder="20,00"
                step="0.01"
              />
              {errors.price && (
                <p className="text-start text-red-500">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-stroke px-4 py-3 dark:border-strokedark">
            <button
              type="button"
              disabled={isLoading}
              onClick={onClose}
              className="flex h-10 w-28 items-center justify-center rounded border border-[#E1E1E1] bg-white text-sm font-medium text-black transition hover:border-primary hover:text-primary dark:border-form-strokedark dark:bg-boxdark dark:text-white dark:hover:border-primary dark:hover:bg-primary dark:hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex h-10 w-28 items-center justify-center rounded border border-primary bg-primary text-sm font-medium text-white transition hover:bg-opacity-90 ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {isLoading ? (
                <svg
                  className="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              {isLoading ? "" : "Atualizar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTaskForm;
