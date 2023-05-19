import {
    Button,
    Flex,
    HStack,
    VStack,
    Text,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import type { BigNumber } from 'ethers';

import { useTodos } from '@/utils/hooks/useTodos';
import { emptyTodoArray } from '@/utils/constants';
import { CurrentTodoStateType } from '@/utils/types';
import { getCreateTodoAlert } from '@/utils/alerts';

import TodoModal from './TodoModal';
import TodoCard from './TodoCard';
import { useWorkspace } from './WorkspaceProvider';

const Main = () => {
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

    return (
        <VStack spacing={10} h="100%">
            <HStack alignItems="flex-start" p="20px">
                <Button
                    onClick={handleCreateTodo}
                    isLoading={isWaitingNewTodo.current}
                >
                    Create todo
                </Button>
                <TodoModal
                    index={currentTodo.index}
                    isOpen={isOpen}
                    onClose={onClose}
                    todo={currentTodo.todo}
                    setTodos={setTodos}
                    isWaitingNewTodo={isWaitingNewTodo}
                />
            </HStack>
            <Flex
                wrap="wrap"
                w="100%"
                h="100%"
                gap="20px"
                justifyContent="center"
                overflow="auto"
                pb="20px"
            >
                {isLoading
                    ? emptyTodoArray.map((_, index) => (
                          <TodoCard
                              key={index}
                              index={index}
                              todo={null}
                              setTodos={setTodos}
                          />
                      ))
                    : todos.map((todo, index) => (
                          <TodoCard
                              index={index}
                              key={todo?.id?.toNumber() ?? index}
                              todo={todo}
                              setTodos={setTodos}
                          />
                      ))}
                {!isLoading && !todos.length && (
                    <Text variant="gradient-main" textAlign="center">
                        Here you will see your todos
                    </Text>
                )}
            </Flex>
        </VStack>
    );
};

export default Main;
