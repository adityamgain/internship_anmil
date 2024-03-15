const { Entity, PrimaryGeneratedColumn, Column } = require('typeorm');

@Entity()
export class Applicants {
    @PrimaryGeneratedColumn()
    id: number=0;

    @Column()
    name: string="";

    @Column()
    event: string="";

    @Column()
    nameId: number=0;

    @Column()
    eventId: number=0;
}