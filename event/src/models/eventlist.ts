const { Entity, PrimaryGeneratedColumn, Column } = require('typeorm');

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number=0;

    @Column()
    title: string="";

    @Column()
    description: string="";

    @Column()
    seats: number=0;

    @Column()
    price: number=0;

    @Column()
    date: Date = new Date();
  }
