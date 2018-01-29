import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "../../../../src/index";

@Entity()
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({type: 'timestamp', transformer: {
            from (raw: Date): string {
                return raw.toISOString();
            },
            to (str: string) {
                return new Date(str);
            }
        }
    })
    created_date: string;
}