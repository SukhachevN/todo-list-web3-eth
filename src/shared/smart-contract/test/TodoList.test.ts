import { expect } from 'chai';
import { ethers } from 'hardhat';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { TodoList, TodoList__factory } from '../typechain-types';
import { TodoNFT } from '../typechain-types/contracts/TodoNFT';
import { TodoNFT__factory } from '../typechain-types/factories/contracts/TodoNFT__factory';

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
    let nftFactory: TodoNFT;

    beforeEach(async () => {
        [alice, bob] = await ethers.getSigners();
        nftFactory = await new TodoNFT__factory(alice).deploy();
        contract = await new TodoList__factory(alice).deploy(
            nftFactory.address
        );
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

        const balance = await contract.balanceOf(alice.address);

        expect(balance.toNumber()).equals(50);
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

        const balance = await contract.balanceOf(alice.address);

        expect(balance.toNumber()).equals(150);
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

        const balance = await contract.balanceOf(alice.address);

        expect(balance.toNumber()).equals(0);
    });

    it('should mint achievement nft', async () => {
        await contract.createTodo(testTodo);

        let achievementState = await contract.getAchievementsState();

        expect(achievementState.createOneTodo.toNumber()).to.be.equals(0);

        await contract.mintAchievementNFT({
            actionType: 0,
            amount: 0,
        });

        achievementState = await contract.getAchievementsState();

        expect(achievementState.createOneTodo.toNumber()).not.to.be.equals(0);

        await nftFactory.tokenURI(1);
    });

    it('should init AI image state', async () => {
        await contract.createTodo(testTodo);

        let aiImageState = await contract.getAiImageState();

        expect(aiImageState.tryCount).to.be.equals(0);
        expect(aiImageState.isInitialized).to.be.equals(false);

        await contract.initializeAiImageState();

        aiImageState = await contract.getAiImageState();

        expect(aiImageState.tryCount).to.be.equals(1);
        expect(aiImageState.isInitialized).to.be.equals(true);
    });

    it('should buy AI image tries', async () => {
        let aiImageState = await contract.getAiImageState();

        expect(aiImageState.tryCount).to.be.equals(0);
        expect(aiImageState.isInitialized).to.be.equals(false);

        const buyAmount = 10;

        await contract.buyAiImageTry(buyAmount);

        aiImageState = await contract.getAiImageState();

        expect(aiImageState.tryCount).to.be.equals(buyAmount);
    });

    it('should use AI image try', async () => {
        let aiImageState = await contract.getAiImageState();

        expect(aiImageState.tryCount).to.be.equals(0);
        expect(aiImageState.isInitialized).to.be.equals(false);

        const buyAmount = 10;

        await contract.buyAiImageTry(buyAmount);
        await contract.useAiImageTry();

        aiImageState = await contract.getAiImageState();

        expect(aiImageState.tryCount).to.be.equals(buyAmount - 1);
    });

    it('should save AI image', async () => {
        let savedAiImage = await contract.getSavedAiImage();

        const testAiImage = {
            name: 'test name',
            description: 'test description',
            image: 'test image',
        };

        expect(savedAiImage.name).to.be.equals('');
        expect(savedAiImage.description).to.be.equals('');
        expect(savedAiImage.image).to.be.equals('');

        await contract.saveAiImage(testAiImage);

        savedAiImage = await contract.getSavedAiImage();

        expect(savedAiImage.name).to.be.equals(testAiImage.name);
        expect(savedAiImage.description).to.be.equals(testAiImage.description);
        expect(savedAiImage.image).to.be.equals(testAiImage.image);
    });

    it('should mint AI image NFT', async () => {
        let savedAiImage = await contract.getSavedAiImage();

        const testAiImage = {
            name: 'test name',
            description: 'test description',
            image: 'test image',
        };

        expect(savedAiImage.nftId).to.be.equals(0);

        await contract.mintAiImageNFT(testAiImage);

        savedAiImage = await contract.getSavedAiImage();

        expect(savedAiImage.nftId).not.to.be.equals(0);
    });
});
