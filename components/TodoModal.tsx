import {
    Button,
    Center,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Switch,
    Text,
    Textarea,
    Tooltip,
    useToast,
    VStack,
} from '@chakra-ui/react';
import {
    ChangeEvent,
    FC,
    FormEvent,
    MutableRefObject,
    useEffect,
    useState,
} from 'react';
import { Updater } from 'use-immer';

import { useWorkspace } from '@/components/WorkspaceProvider';
import { getDateFromTodo, maxDate, minDate } from '@/utils/dateUtils';
import { TodoStateType, TodoType } from '@/utils/types';
import {
    getCreateTodoErrorAlert,
    getUpdateTodoErrorAlert,
} from '@/utils/alerts';
import { MS_IN_ONE_SEC } from '@/utils/constants';

type TodoModalType = {
    todo: TodoType | null;
    isOpen: boolean;
    onClose: () => void;
    setTodos: Updater<TodoType[]>;
    index: number;
    isWaitingNewTodo: MutableRefObject<boolean>;
};

const TodoModal: FC<TodoModalType> = ({
    isOpen,
    onClose,
    todo,
    setTodos,
    index,
    isWaitingNewTodo,
}) => {
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

                    return todos;
                });
            } else {
                const tx = await contract.createTodo(newTodo);
                await tx.wait();

                isWaitingNewTodo.current = true;
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

    const onDelete = async () => {};

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
    }, [todo]);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent as="form" onSubmit={onSubmit} h="484px">
                {isUpdating ? (
                    <Center h="100%">
                        <Spinner />
                    </Center>
                ) : (
                    <>
                        <ModalHeader>
                            <Text variant="gradient-main">
                                {todo ? 'Edit todo' : 'Create todo'}
                            </Text>
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <VStack spacing="10px">
                                <FormControl isRequired>
                                    <FormLabel>Title:</FormLabel>
                                    <Input
                                        type="text"
                                        name="title"
                                        placeholder="Todo title"
                                        value={todoState.title}
                                        onChange={onChange}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Deadline:</FormLabel>
                                    <Input
                                        type="date"
                                        name="deadline"
                                        value={todoState.deadline}
                                        max={maxDate}
                                        min={minDate}
                                        onChange={onChange}
                                    />
                                </FormControl>
                                <FormControl
                                    display="flex"
                                    alignItems="center"
                                    isDisabled={!todo}
                                >
                                    <FormLabel mb={0}>Completed:</FormLabel>
                                    <Switch
                                        name="isCompleted"
                                        isChecked={todoState.isCompleted}
                                        onChange={onChange}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Description:</FormLabel>
                                    <Textarea
                                        name="description"
                                        resize="none"
                                        placeholder="description"
                                        value={todoState.description}
                                        onChange={onChange}
                                    />
                                </FormControl>
                            </VStack>
                        </ModalBody>
                        <ModalFooter gap="10px">
                            {todo && (
                                <Tooltip label="You will loose all rewards received for this todo">
                                    <Button onClick={onDelete}>Delete</Button>
                                </Tooltip>
                            )}
                            <Button type="submit" isDisabled={!isFormChanged}>
                                {todo ? 'Save' : 'Create'}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default TodoModal;
