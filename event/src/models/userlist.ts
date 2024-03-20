const { Entity, PrimaryGeneratedColumn, Column } = require('typeorm');

@Entity()
export class UserList {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false })
    name: string = "";

    @Column({ nullable: false })
    password: string = "";

    @Column({unique: true, nullable: false})
    email: string = "";

    @Column({ nullable: true })
    refreshtoken: string = "";

    @Column({ default: false })
    verifyEmail!: boolean;

}
