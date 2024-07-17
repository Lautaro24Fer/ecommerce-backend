import { MigrationInterface, QueryRunner } from "typeorm";

export class First1721110783123 implements MigrationInterface {
    name = 'First1721110783123'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`method\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`brand\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`supplier\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`price\` int NOT NULL, \`brandIdId\` int NULL, \`supplierIdId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`destinity\` varchar(255) NOT NULL, \`date_created\` datetime NOT NULL, \`dev_date_estimated\` datetime NOT NULL, \`dev_date\` datetime NOT NULL, \`userIdId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_products_product\` (\`orderId\` int NOT NULL, \`productId\` int NOT NULL, INDEX \`IDX_1f9ea0b0e59e0d98ade4f2d5e9\` (\`orderId\`), INDEX \`IDX_d6c66c08b9c7e84a1b657797df\` (\`productId\`), PRIMARY KEY (\`orderId\`, \`productId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_8bb7597a5829a3de252b6f35dee\` FOREIGN KEY (\`brandIdId\`) REFERENCES \`brand\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_d4764a4b4bfd1662ea5341f9607\` FOREIGN KEY (\`supplierIdId\`) REFERENCES \`supplier\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_77a3765d815efc0006ede1f2cff\` FOREIGN KEY (\`userIdId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_products_product\` ADD CONSTRAINT \`FK_1f9ea0b0e59e0d98ade4f2d5e99\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`order_products_product\` ADD CONSTRAINT \`FK_d6c66c08b9c7e84a1b657797dff\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_products_product\` DROP FOREIGN KEY \`FK_d6c66c08b9c7e84a1b657797dff\``);
        await queryRunner.query(`ALTER TABLE \`order_products_product\` DROP FOREIGN KEY \`FK_1f9ea0b0e59e0d98ade4f2d5e99\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_77a3765d815efc0006ede1f2cff\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_d4764a4b4bfd1662ea5341f9607\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_8bb7597a5829a3de252b6f35dee\``);
        await queryRunner.query(`DROP INDEX \`IDX_d6c66c08b9c7e84a1b657797df\` ON \`order_products_product\``);
        await queryRunner.query(`DROP INDEX \`IDX_1f9ea0b0e59e0d98ade4f2d5e9\` ON \`order_products_product\``);
        await queryRunner.query(`DROP TABLE \`order_products_product\``);
        await queryRunner.query(`DROP TABLE \`order\``);
        await queryRunner.query(`DROP TABLE \`product\``);
        await queryRunner.query(`DROP TABLE \`supplier\``);
        await queryRunner.query(`DROP TABLE \`brand\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
