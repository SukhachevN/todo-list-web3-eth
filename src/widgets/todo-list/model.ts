import { useDisclosure, useToast } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useImmer } from 'use-immer';
import { BigNumber } from 'ethers/lib/ethers';

import { useWorkspace } from '@/app/providers/WorkspaceProvider';
import { getCreateTodoAlert, getFetchTodosError } from '@/shared/alerts';
import { CurrentTodoStateType, TodoType } from '@/shared/types';

export const useTodos = () => {
    const { account, contract } = useWorkspace();

    const [todos, setTodos] = useImmer<TodoType[]>([]);

    const toast = useToast();

    const fetchTodos = async () => {
        if (account && contract) {
            const todos = await contract.getTodos();

            return todos;
        }

        return [];
    };

    const { isLoading, error } = useQuery({
        queryKey: ['todos', account],
        queryFn: fetchTodos,
        onSuccess: (fetchedTodos) => {
            const todos = fetchedTodos.map((todo) => {
                if (typeof todo.title === 'string') {
                    return todo;
                } else {
                    return {
                        ...todo,
                        id: todo[0],
                        title: todo[1],
                        description: todo[2],
                        deadline: todo[3],
                        createDate: todo[4],
                        completeDate: todo[5],
                        isCompleted: todo[6],
                    };
                }
            });

            todos.sort((a, b) => b.createDate - a.createDate);

            setTodos(todos);
        },
        refetchOnWindowFocus: false,
        enabled: !!(account && contract),
    });

    useEffect(() => {
        if (error instanceof Error) toast(getFetchTodosError(error.message));
    }, [error]);

    return { todos, setTodos, isLoading };
};

export const useTodoList = () => {
    const { account, contract } = useWorkspace();

    const isWaitingNewTodo = useRef(false);

    const { todos, setTodos, isLoading } = useTodos();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [currentTodo, setCurrentTodo] = useState<CurrentTodoStateType>({
        index: 0,
        todo: null,
    });

    const toast = useToast();

    const handleCreateTodo = () => {
        onOpen();
        setCurrentTodo({ index: 0, todo: null });
    };

    useEffect(() => {
        const handleAddTodo = async (
            creator: string,
            id: BigNumber,
            title: string,
            description: string,
            deadline: number,
            createDate: number
        ) => {
            if (creator.toLowerCase() === account && isWaitingNewTodo.current) {
                setTodos((todos) => {
                    todos.unshift({
                        id,
                        title,
                        description,
                        deadline,
                        createDate,
                        isCompleted: false,
                        completeDate: 0,
                    });
                });

                isWaitingNewTodo.current = false;

                toast(getCreateTodoAlert(title));
            }
        };

        contract?.on('NewTodo', handleAddTodo);

        return () => {
            contract?.off('NewTodo', handleAddTodo);
        };
    }, [contract]);

    return {
        handleCreateTodo,
        isWaitingNewTodo,
        currentTodo,
        isOpen,
        onClose,
        todos,
        setTodos,
        isLoading,
    };
};
