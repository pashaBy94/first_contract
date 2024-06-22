import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Company } from '../wrappers/Company';
import '@ton/test-utils';
import { Fond } from '../wrappers/Fond';

describe('Company', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let company: SandboxContract<Company>;
    let fond: SandboxContract<Fond>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        company = blockchain.openContract(await Company.fromInit());
        fond = blockchain.openContract(await Fond.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployCompany = await company.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );
        expect(deployCompany.transactions).toHaveTransaction({
            from: deployer.address,
            to: company.address,
            deploy: true,
            success: true,
        });

        const deployFond = await fond.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );
        expect(deployFond.transactions).toHaveTransaction({
            from: deployer.address,
            to: fond.address,
            deploy: true,
            success: true,
        });
    });

    it('should withdraw', async () => {
        let amount = 3n;
        const increaseResult = await fond.send(
            deployer.getSender(),
            {
                value: toNano('0.5'),
            },
            {
                $$type: 'WithDraw',
                amount,
                target: company.address,
            },
        );
        console.log(increaseResult);

        const balanceFond = await fond.getBalance();
        const balanceCompany = await company.getBalance();
        console.log('balanceFond', balanceFond);
        console.log('balanceCompany', balanceCompany);
        // expect(balanceFond).toEqual(7n);
        // expect(balanceCompany).toEqual(3n);
    });
});
