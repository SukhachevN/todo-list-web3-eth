import { useToast } from '@chakra-ui/react';
import {
    ChangeEvent,
    FormEvent,
    MutableRefObject,
    useEffect,
    useState,
} from 'react';
import { Updater } from 'use-immer';

import { useWorkspace } from '@/app/providers/WorkspaceProvider';
import {
    getCreateTodoErrorAlert,
    getDeleteTodoAlert,
    getDeleteTodoErrorAlert,
    getUpdateTodoAlert,
    getUpdateTodoErrorAlert,
} from '@/shared/alerts';
import { MS_IN_ONE_SEC } from '@/shared/constants';
import { getDateFromTodo } from '@/shared/date';
import { TodoStateType, TodoType } from '@/shared/types';

export type TodoModalType = {
    isOpen: boolean;
    todo: TodoType | null;
    index: number;
    isWaitingNewTodo?: MutableRefObject<boolean>;
    onClose: () => void;
    setTodos: Updater<TodoType[]>;
};

export const useTodoModal = ({
    todo,
    index,
    isOpen,
    isWaitingNewTodo,
    onClose,
    setTodos,
}: TodoModalType) => {
    const { contract } = useWorkspace();

    const [isUpdating, setIsUpdating] = useState(false);

    const [todoState, setTodoState] = useState<TodoStateType>({
        title: todo?.title ?? '',
        description: todo?.description ?? '',
        isCompleted: !!todo?.isCompleted,
        deadline: getDateFromTodo(todo),
    });

    const toast = useToast();

    const isFormChanged =
        todoState.title !== todo?.title ||
        todoState.description !== todo?.description ||
        todoState.isCompleted !== todo?.isCompleted ||
        todoState.deadline !== getDateFromTodo(todo);

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!contract) return;

        setIsUpdating(true);

        const { title, description, deadline, isCompleted } = todoState;

        const deadlineDate = deadline
            ? new Date(deadline).getTime() / MS_IN_ONE_SEC
            : 0;

        const newTodo = {
            title,
            description,
            deadline: deadlineDate,
        };

        try {
            if (todo) {
                const tx = await contract.updateTodo({
                    ...todo,
                    ...newTodo,
                    isCompleted,
                });
                await tx.wait();

                setTodos((todos) => {
                    todos[index] = {
                        ...todos[index],
                        title,
                        description,
                        deadline: newTodo.deadline,
                        completeDate: isCompleted
                            ? Math.trunc(Date.now() / MS_IN_ONE_SEC)
                            : 0,
                    };
                });

                toast(getUpdateTodoAlert(title));
            } else {
                const tx = await contract.createTodo(newTodo);
                await tx.wait();

                isWaitingNewTodo && (isWaitingNewTodo.current = true);
            }

            onClose?.();
        } catch (error) {
            if (error instanceof Error) {
                const { message } = error;

                const alertFunction = todo
                    ? getUpdateTodoErrorAlert
                    : getCreateTodoErrorAlert;

                const alert = alertFunction(title, message);

                toast(alert);
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const onDelete = async () => {
        if (!contract || !todo) return;

        setIsUpdating(true);

        try {
            const tx = await contract.deleteTodo(todo.id);
            await tx.wait();

            toast(getDeleteTodoAlert(todo.title));

            setTodos((todos) => {
                todos.splice(index, 1);
            });
        } catch (error) {
            if (error instanceof Error) {
                const { message } = error;

                const alert = getDeleteTodoErrorAlert(todo.title, message);

                toast(alert);
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const onChange = ({
        target,
    }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, checked, type } = target as EventTarget &
            (HTMLInputElement | HTMLTextAreaElement) & { checked?: boolean };

        const newValue = type === 'checkbox' ? checked : value;

        setTodoState((prev) => ({ ...prev, [name]: newValue }));
    };

    useEffect(() => {
        setTodoState({
            title: todo?.title ?? '',
            description: todo?.description ?? '',
            isCompleted: !!todo?.isCompleted,
            deadline: getDateFromTodo(todo),
        });
    }, [todo, isOpen]);

    return {
        todoState,
        isUpdating,
        isFormChanged,
        onChange,
        onDelete,
        onSubmit,
    };
};
