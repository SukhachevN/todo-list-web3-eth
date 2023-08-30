import { ChangeEvent, Dispatch, SetStateAction } from 'react';

import { useWorkspace } from '@/app/providers/WorkspaceProvider';
import { TodoCardType, TodoType } from '@/shared/types';
import { MS_IN_ONE_SEC } from '@/shared/constants';
import { useToast } from '@chakra-ui/react';
import { getUpdateTodoAlert, getUpdateTodoErrorAlert } from '@/shared/alerts';

export type TodoStatusSwitchType = {
    setIsUpdating: Dispatch<SetStateAction<boolean>>;
} & TodoCardType;

export const useTodoStatusSwitch = ({
    todo,
    index,
    setIsUpdating,
    setTodos,
}: TodoStatusSwitchType) => {
    const { contract } = useWorkspace();

    const toast = useToast();

    const onChange = async ({
        target: { checked },
    }: ChangeEvent<HTMLInputElement>) => {
        if (!todo || !contract) return;

        setIsUpdating(true);

        try {
            const tx = await contract.updateTodo({
                ...todo,
                isCompleted: checked,
            });

            await tx.wait();

            setTodos((todos) => {
                todos[index] = {
                    ...todos[index],
                    isCompleted: checked,
                    completeDate: checked
                        ? Math.trunc(Date.now() / MS_IN_ONE_SEC)
                        : 0,
                };
            });

            toast(getUpdateTodoAlert(todo.title));
        } catch (error) {
            if (error instanceof Error) {
                toast(getUpdateTodoErrorAlert(todo.title, error.message));
            }
        } finally {
            setIsUpdating(false);
        }
    };

    return onChange;
};
