import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid /* "as" serve para renomear*/ } from 'uuid';
@Entity("surveys")
class Survey {
 
    @PrimaryColumn()
    readonly id: string;
    @Column()
    title: string;
    @Column()
    description: string;
    @CreateDateColumn()
    created_at: Date;

    constructor() {
        if(!this.id){
            this.id = uuid();
        }
    }
    
}

export { Survey };