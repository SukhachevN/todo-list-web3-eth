import { assert, expect, should } from 'chai';
import { ethers } from 'hardhat';

import { TodoList__factory, TodoList } from '../typechain-types';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('TodoList', () => {
    const testTodo = {
        title: 'test title',
        description: 'test description',
        deadline: Math.trunc(Date.now() / 1000),
    };

    const updatedTodo = {
        id: 0,
        title: 'updated title',
        description: 'updated description',
        deadline: Math.trunc(Date.now() / 1000) + 1000,
        isCompleted: true,
    };

    let alice: SignerWithAddress;
    let bob: SignerWithAddress;

    let contract: TodoList;

    beforeEach(async () => {
        [alice, bob] = await ethers.getSigners();
        contract = await new TodoList__factory(alice).deploy();
    });

    it('should create todo', async () => {
        await contract.createTodo(testTodo);

        const todos = await contract.getTodos();

        expect(todos[0].title).to.equal(testTodo.title);
        expect(todos[0].description).to.equal(testTodo.description);
        expect(todos[0].deadline).to.equal(testTodo.deadline);
        expect(todos[0].isCompleted).to.equal(false);
        expect(todos[0].completeDate).to.equal(0);
        expect(todos[0].createDate).to.not.equal(0);

        const stats = await contract.getStats();

        expect(stats.created).to.be.equal(1);
    });

    it('should not see another user todos', async () => {
        await contract.createTodo(testTodo);

        const aliceTodos = await contract.getTodos();

        expect(aliceTodos.length).to.be.equal(1);

        const bobsTodos = await contract.connect(bob).getTodos();

        expect(bobsTodos.length).to.be.equal(0);
    });

    it('should update todo', async () => {
        await contract.createTodo(testTodo);

        await contract.updateTodo(updatedTodo);

        const todos = await contract.getTodos();

        expect(todos[0].title).to.equal(updatedTodo.title);
        expect(todos[0].description).to.equal(updatedTodo.description);
        expect(todos[0].deadline).to.equal(updatedTodo.deadline);
        expect(todos[0].isCompleted).to.equal(true);
        expect(todos[0].completeDate).to.not.equal(0);

        const stats = await contract.getStats();

        expect(stats.completed).to.be.equal(1);
    });

    it('should delete todo', async () => {
        await contract.createTodo(testTodo);

        let todos = await contract.getTodos();

        expect(todos.length).to.be.equal(1);

        await contract.deleteTodo(0);

        todos = await contract.connect(alice).getTodos();

        expect(todos.length).to.be.equal(0);

        const stats = await contract.getStats();

        expect(stats.deleted).to.be.equal(1);
    });
});
