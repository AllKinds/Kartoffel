import * as chai from 'chai';
import { Kartoffel } from './kartoffel.controller';
import { KartoffelModel } from './kartoffel.model';
import { IKartoffel } from './kartoffel.interface';
import { expectError } from '../../helpers/spec.helper';


const should = chai.should();
const expect = chai.expect;
chai.use(require('chai-http'));


before(async () => {
    KartoffelModel.remove({}, (err) => {});
});

const ID_EXAMPLE = '59a56d577bedba18504298df';
const idXmpls = ['59a6aa1f5caa4e4d2ac39797'];


describe('Strong Groups', () => {
    describe('#getKartoffeln', () => {
        it('Should be empty if there are no groups', async () => {
            const groups = await Kartoffel.getAllKartoffeln();
            groups.should.be.a('array');
            groups.should.have.lengthOf(0);
        });
        it('Should get all the groups', async () => {
            await Kartoffel.createKartoffel(<IKartoffel>{name: 'myGroup'});

            let groups = await Kartoffel.getAllKartoffeln();
            groups.should.be.a('array');
            groups.should.have.lengthOf(1);
            should.exist(groups[0]);
            groups[0].should.have.property('name', 'myGroup');


            await Kartoffel.createKartoffel(<IKartoffel>{name: 'yourGroup'});
            await Kartoffel.createKartoffel(<IKartoffel>{name: 'hisGroup'});

            groups = await Kartoffel.getAllKartoffeln();
            groups.should.be.a('array');
            groups.should.have.lengthOf(3);
            groups[0].should.have.property('name', 'myGroup');
            groups[1].should.exist;
            groups[2].should.have.property('name', 'hisGroup');
        });
    });
    describe('#createKartoffel', () => {
        it('Should create a simple group', async () => {
            const group = await Kartoffel.createKartoffel(<IKartoffel>{name: 'Biran'});
            group.should.exist;
            group.should.have.property('name', 'Biran');
            group.should.have.property('ancestors');
            group.ancestors.should.be.an('array');
            group.ancestors.should.have.lengthOf(0);
        });
        it('Should throw an error when parent doesn\'t exist', async () => {
            await expectError(Kartoffel.createKartoffel, [<IKartoffel>{name: 'Biran'}, '597053012c3b60031211a063'] );
        });
        it('Should throw an error when group is undefined', async () => {
            await expectError(Kartoffel.createKartoffel, [undefined] );
        });
        it('Should create a group correctly with one parent', async () => {
            const parent = await Kartoffel.createKartoffel(<IKartoffel>{name: 'Ido'});
            const child = await Kartoffel.createKartoffel(<IKartoffel>{name: 'Elad'}, parent.id);
            child.should.exist;
            child.should.have.property('ancestors');
            child.ancestors.should.have.lengthOf(1);
            const hisParent = child.ancestors[0].toString();
            hisParent.should.equal(parent.id);
        });
    });
    describe('#getKartoffelByID', () => {
        it('Should throw an error when there is no matching group', async () => {
            await expectError(Kartoffel.getKartoffel, [ID_EXAMPLE]);
        });
        it('Should return the group if existed', async () => {
            const kartoffel = await Kartoffel.createKartoffel(<IKartoffel>{name: 'myGroup'});
            const res = await Kartoffel.getKartoffel(kartoffel.id);

            res.should.exist;
            res.should.have.property('id', kartoffel.id);
            res.should.have.property('name', kartoffel.name);
        });
    });
    describe('Update Kartoffel', () => {
        describe('#updateKartoffel', () => {
            it('Should throw an error if the group doesn\'t exist', async () => {
                // Kartoffel.updateKartoffelDry(ID_EXAMPLE, <IKartoffel>{name: 'newName'});
                await expectError(Kartoffel.updateKartoffel, [<IKartoffel>{_id: ID_EXAMPLE, name: 'newName'}]);
            });
            it('Should update the group', async() => {
                const kartoffel = await Kartoffel.createKartoffel(<IKartoffel>{name: 'myTeam'});
                const updated = await Kartoffel.updateKartoffel(<IKartoffel>{_id: kartoffel.id, name: 'newName'});

                updated.should.exist;
                updated.should.have.property('name', 'newName');
            });


        });
        describe('#updateUsers (Members w.l.o.g)', () => {
            it('Should throw an error when group doesn\'t exist', async () => {
                expectError(Kartoffel.addUsers, [ID_EXAMPLE, ['1234567', '7654321']]);
            });
            it('Should return the same group even if there is no members to add', async () => {
                const kartoffel = await Kartoffel.createKartoffel(<IKartoffel>{name: 'MyGroup'});
                const res = await Kartoffel.addUsers(kartoffel._id, []);

                res.should.exist;
                res.should.have.property('name', kartoffel.name);
                res.should.have.property('members');
                res.members.should.be.an('array');
                res.members.should.have.lengthOf(0);
            });
            it('Should update the members of the group if there is none before', async () => {
                const kartoffel = await Kartoffel.createKartoffel(<IKartoffel>{name: 'MyGroup'});
                const res = await Kartoffel.addUsers(kartoffel._id, ['1234567']);

                res.should.exist;
                res.should.have.property('name', 'MyGroup');
                res.should.have.property('members');
                res.members.should.be.an('array');
                res.members.should.have.lengthOf(1);
                res.members[0].should.be.equal('1234567');
            });
            it('Should update the members of the group and don\'t delete the previous members', async () => {
                const kartoffel = await Kartoffel.createKartoffel(<IKartoffel>{name: 'MyGroup'});
                await Kartoffel.addUsers(kartoffel._id, ['1234567']);
                const res = await Kartoffel.addUsers(kartoffel._id, ['7654321']);

                res.should.have.property('name', 'MyGroup');
                res.members.should.have.lengthOf(2);
                res.members[0].should.be.equal('1234567');
                res.members[1].should.be.equal('7654321');
            });
        });
        describe('#removeUsers (Members w.l.o.g)', () => {
            it('Should throw an error when group doesn\'t exist', async () => {
                expectError(Kartoffel.removeUsers, [ID_EXAMPLE, ['1234567', '7654321']]);
            });
            it('Should return the same group even if there is no members to remove', async () => {
                const kartoffel = await Kartoffel.createKartoffel(<IKartoffel>{name: 'MyGroup'});
                const res = await Kartoffel.removeUsers(kartoffel._id, []);

                res.should.exist;
                res.should.have.property('name', kartoffel.name);
                res.should.have.property('members');
                res.members.should.be.an('array');
                res.members.should.have.lengthOf(0);
            });
            it('Should remove the users', async () => {
                const kartoffel = await Kartoffel.createKartoffel(<IKartoffel>{name: 'MyGroup'});
                await Kartoffel.addUsers(kartoffel._id, ['1234567', '7654321']);
                const res = await Kartoffel.removeUsers(kartoffel._id, ['7654321']);

                res.should.exist;
                res.should.have.property('name', 'MyGroup');
                res.should.have.property('members');
                res.members.should.be.an('array');
                res.members.should.have.lengthOf(1);
                res.members[0].should.be.equal('1234567');
            });
        });
        describe('#childrenAdoption', () => {
            it('Should throw an error if parent does not exist', async () => {
                await expectError(Kartoffel.childrenAdoption, [ID_EXAMPLE]);
            });
            it('Should update a child\'s parent', async () => {
                const parent = await Kartoffel.createKartoffel(<IKartoffel>{name: 'parent'});
                let child = await Kartoffel.createKartoffel(<IKartoffel>{name: 'child'});

                await Kartoffel.childrenAdoption(parent._id, [child._id]);

                child = await Kartoffel.getKartoffel(child._id);

                child.should.exist;
                child.should.have.property('ancestors');
                child.ancestors.should.have.lengthOf(1);
                expect(child.ancestors[0].toString() == parent._id.toString()).to.be.ok;
            });
            it('Should update the child\'s previous parent', async () => {
                const parent_old = await Kartoffel.createKartoffel(<IKartoffel>{name: 'parent_old'});
                let child = await Kartoffel.createKartoffel(<IKartoffel>{name: 'child'});
                const parent = await Kartoffel.createKartoffel(<IKartoffel>{name: 'parent'});

                await Kartoffel.childrenAdoption(parent_old._id, [child._id]);
                await Kartoffel.childrenAdoption(parent._id, [child._id]);
                child = await Kartoffel.getKartoffel(child._id);

                child.should.exist;
                child.should.have.property('ancestors');
                child.ancestors.should.have.lengthOf(1);
                expect(child.ancestors[0].toString() == parent._id.toString()).to.be.ok;
            });
            it('Should update a child\'s hierarchy', async () => {
                const grandparent = await Kartoffel.createKartoffel(<IKartoffel>{name: 'grandparent'});
                const parent = await Kartoffel.createKartoffel(<IKartoffel>{name: 'parent'});
                let child = await Kartoffel.createKartoffel(<IKartoffel>{name: 'child'});

                await Kartoffel.childrenAdoption(grandparent._id, [parent._id]);
                await Kartoffel.childrenAdoption(parent._id, [child._id]);

                child = await Kartoffel.getKartoffel(child._id);

                child.should.exist;
                child.should.have.property('ancestors');
                child.ancestors.should.have.lengthOf(2);
                expect(child.ancestors[0].toString() == parent._id.toString()).to.be.ok;
                expect(child.ancestors[1].toString() == grandparent._id.toString()).to.be.ok;
            });
            it('Should update a child\'s hierarchy multiple times', async () => {
                const grandparent = await Kartoffel.createKartoffel(<IKartoffel>{name: 'grandparent'});
                const grandparent_2 = await Kartoffel.createKartoffel(<IKartoffel>{name: 'grandparent_2'});
                const parent = await Kartoffel.createKartoffel(<IKartoffel>{name: 'parent'});
                let child = await Kartoffel.createKartoffel(<IKartoffel>{name: 'child'});

                await Kartoffel.childrenAdoption(grandparent._id, [parent._id]);
                await Kartoffel.childrenAdoption(parent._id, [child._id]);
                await Kartoffel.childrenAdoption(grandparent_2._id, [parent._id]);

                child = await Kartoffel.getKartoffel(child._id);

                child.should.exist;
                child.should.have.property('ancestors');
                child.ancestors.should.have.lengthOf(2);
                expect(child.ancestors[0].toString() == parent._id.toString()).to.be.ok;
                expect(child.ancestors[1].toString() == grandparent_2._id.toString()).to.be.ok;
            });
        });
    });
});