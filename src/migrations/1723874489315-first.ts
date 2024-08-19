import { MigrationInterface, QueryRunner } from "typeorm";

export class First1723874489315 implements MigrationInterface {
    name = 'First1723874489315'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`method\` varchar(255) NOT NULL DEFAULT 'local', UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`brand\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`supplier\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_type\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, UNIQUE INDEX \`IDX_8978484a9cee7a0c780cd259b8\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_image\` (\`id\` int NOT NULL AUTO_INCREMENT, \`url\` text NOT NULL, \`productId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`price\` int NOT NULL, \`description\` text NOT NULL, \`image\` text NOT NULL, \`typeId\` int NULL, \`brandId\` int NULL, \`supplierId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`destinity\` varchar(255) NOT NULL, \`date_created\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`dev_date_estimated\` datetime NOT NULL, \`dev_date\` datetime NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_products_product\` (\`orderId\` int NOT NULL, \`productId\` int NOT NULL, INDEX \`IDX_1f9ea0b0e59e0d98ade4f2d5e9\` (\`orderId\`), INDEX \`IDX_d6c66c08b9c7e84a1b657797df\` (\`productId\`), PRIMARY KEY (\`orderId\`, \`productId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`product_image\` ADD CONSTRAINT \`FK_40ca0cd115ef1ff35351bed8da2\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_53bafe3ecc25867776c07c9e666\` FOREIGN KEY (\`typeId\`) REFERENCES \`product_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_bb7d3d9dc1fae40293795ae39d6\` FOREIGN KEY (\`brandId\`) REFERENCES \`brand\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_4346e4adb741e80f3711ee09ba4\` FOREIGN KEY (\`supplierId\`) REFERENCES \`supplier\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_caabe91507b3379c7ba73637b84\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_products_product\` ADD CONSTRAINT \`FK_1f9ea0b0e59e0d98ade4f2d5e99\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`order_products_product\` ADD CONSTRAINT \`FK_d6c66c08b9c7e84a1b657797dff\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`insert into brand (name) values ('ADIDAS'),('BABOLAT'),('BULLPADEL'),('NOX'),('SIUX'),('ROYAL'),('COAST'),('TOP FORCE'),('BLACK CROWN'),('FELINA PADEL'),('HEAD')`);
        await queryRunner.query(`insert into supplier (name) values ('Gonza'), ('SC Group Gus'), ('Maxi Fernandez')`);
        await queryRunner.query(`insert into product_type (name) values ('paleta')`);

        // PRODUCTOS

        await queryRunner.query(`insert into product (name, price, description, image, typeId , brandId, supplierId) values
        ('ADIDAS ADIPOWER LIGHT 3.2 2023', 280.00, 'Esta es la descripcion de la ADIDAS ADIPOWER LIGHT 3.2 2023', 'https://imgs.search.brave.com/CntldRuuGAWhuSmml4KJkCDa-AVZydzdHVBEBhBayQc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMjho/aTkzZ3I2OTdvbC5j/bG91ZGZyb250Lm5l/dC81YTFhNzBlMS02/MzIxLTY5NDQtZWQ5/My02N2E0ODU1MDM1/MDQvaW1nL1Byb2R1/Y3RvL2U2YmUyOTMz/LTVkMGUtZmVkMS1i/OThkLTVlYjgxNDhj/YzBjNy9BQS1WZXJ0/ZXgtMDMtMjAyMy02/NGFlZTBkMTU2MDRm/LmpwZw', 1, 1, 1),
        ('BABOLAT AIR VERON 2022', 235.00, 'Esta es la descripcion de la BABOLAT AIR VERON 2022', 'https://imgs.search.brave.com/CntldRuuGAWhuSmml4KJkCDa-AVZydzdHVBEBhBayQc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMjho/aTkzZ3I2OTdvbC5j/bG91ZGZyb250Lm5l/dC81YTFhNzBlMS02/MzIxLTY5NDQtZWQ5/My02N2E0ODU1MDM1/MDQvaW1nL1Byb2R1/Y3RvL2U2YmUyOTMz/LTVkMGUtZmVkMS1i/OThkLTVlYjgxNDhj/YzBjNy9BQS1WZXJ0/ZXgtMDMtMjAyMy02/NGFlZTBkMTU2MDRm/LmpwZw', 1, 2, 1),
        ('BULLPADEL FLOW LIGHT 2022', 120.00, 'Esta es la descripcion de la BULLPADEL FLOW LIGHT 2022', 'https://imgs.search.brave.com/CntldRuuGAWhuSmml4KJkCDa-AVZydzdHVBEBhBayQc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMjho/aTkzZ3I2OTdvbC5j/bG91ZGZyb250Lm5l/dC81YTFhNzBlMS02/MzIxLTY5NDQtZWQ5/My02N2E0ODU1MDM1/MDQvaW1nL1Byb2R1/Y3RvL2U2YmUyOTMz/LTVkMGUtZmVkMS1i/OThkLTVlYjgxNDhj/YzBjNy9BQS1WZXJ0/ZXgtMDMtMjAyMy02/NGFlZTBkMTU2MDRm/LmpwZw', 1, 3, 1),
        ('PITON 11', 282.00, 'Esta es la descripcion de la PITON 11', 'https://imgs.search.brave.com/CntldRuuGAWhuSmml4KJkCDa-AVZydzdHVBEBhBayQc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMjho/aTkzZ3I2OTdvbC5j/bG91ZGZyb250Lm5l/dC81YTFhNzBlMS02/MzIxLTY5NDQtZWQ5/My02N2E0ODU1MDM1/MDQvaW1nL1Byb2R1/Y3RvL2U2YmUyOTMz/LTVkMGUtZmVkMS1i/OThkLTVlYjgxNDhj/YzBjNy9BQS1WZXJ0/ZXgtMDMtMjAyMy02/NGFlZTBkMTU2MDRm/LmpwZw', 1, 9, 2),
        ('METALBONE 3.3 HRD', 490.00, 'Esta es la descripcion de la METALBONE 3.3 HRD', 'https://imgs.search.brave.com/CntldRuuGAWhuSmml4KJkCDa-AVZydzdHVBEBhBayQc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMjho/aTkzZ3I2OTdvbC5j/bG91ZGZyb250Lm5l/dC81YTFhNzBlMS02/MzIxLTY5NDQtZWQ5/My02N2E0ODU1MDM1/MDQvaW1nL1Byb2R1/Y3RvL2U2YmUyOTMz/LTVkMGUtZmVkMS1i/OThkLTVlYjgxNDhj/YzBjNy9BQS1WZXJ0/ZXgtMDMtMjAyMy02/NGFlZTBkMTU2MDRm/LmpwZw', 1, 1, 3)`);

        // IMAGENES SECUNDARIAS

        await queryRunner.query(`insert into product_image (url, productId) values
        ('https://drive.google.com/thumbnail?id=1I5RSU6MD7uCmGwE4yHz3SzLmuDQXGvq6', 1),
        ('https://drive.google.com/thumbnail?id=13SUucDb_wE69epj5OjTXkdj2-GbHCIq5', 1),
        ('https://drive.google.com/thumbnail?id=1wekHtMwrQyPn3JsGjHlPbaVhm885C-K6', 1),
        ('https://drive.google.com/thumbnail?id=1I5RSU6MD7uCmGwE4yHz3SzLmuDQXGvq6', 2),
        ('https://drive.google.com/thumbnail?id=13SUucDb_wE69epj5OjTXkdj2-GbHCIq5', 2),
        ('https://drive.google.com/thumbnail?id=1wekHtMwrQyPn3JsGjHlPbaVhm885C-K6', 2),
        ('https://drive.google.com/thumbnail?id=1I5RSU6MD7uCmGwE4yHz3SzLmuDQXGvq6', 3),
        ('https://drive.google.com/thumbnail?id=13SUucDb_wE69epj5OjTXkdj2-GbHCIq5', 3),
        ('https://drive.google.com/thumbnail?id=1wekHtMwrQyPn3JsGjHlPbaVhm885C-K6', 3),
        ('https://drive.google.com/thumbnail?id=1I5RSU6MD7uCmGwE4yHz3SzLmuDQXGvq6', 4),
        ('https://drive.google.com/thumbnail?id=13SUucDb_wE69epj5OjTXkdj2-GbHCIq5', 4),
        ('https://drive.google.com/thumbnail?id=1wekHtMwrQyPn3JsGjHlPbaVhm885C-K6', 4),
        ('https://drive.google.com/thumbnail?id=1I5RSU6MD7uCmGwE4yHz3SzLmuDQXGvq6', 5),
        ('https://drive.google.com/thumbnail?id=13SUucDb_wE69epj5OjTXkdj2-GbHCIq5', 5),
        ('https://drive.google.com/thumbnail?id=1wekHtMwrQyPn3JsGjHlPbaVhm885C-K6', 5)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_products_product\` DROP FOREIGN KEY \`FK_d6c66c08b9c7e84a1b657797dff\``);
        await queryRunner.query(`ALTER TABLE \`order_products_product\` DROP FOREIGN KEY \`FK_1f9ea0b0e59e0d98ade4f2d5e99\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_caabe91507b3379c7ba73637b84\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_4346e4adb741e80f3711ee09ba4\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_bb7d3d9dc1fae40293795ae39d6\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_53bafe3ecc25867776c07c9e666\``);
        await queryRunner.query(`ALTER TABLE \`product_image\` DROP FOREIGN KEY \`FK_40ca0cd115ef1ff35351bed8da2\``);
        await queryRunner.query(`DROP INDEX \`IDX_d6c66c08b9c7e84a1b657797df\` ON \`order_products_product\``);
        await queryRunner.query(`DROP INDEX \`IDX_1f9ea0b0e59e0d98ade4f2d5e9\` ON \`order_products_product\``);
        await queryRunner.query(`DROP TABLE \`order_products_product\``);
        await queryRunner.query(`DROP TABLE \`order\``);
        await queryRunner.query(`DROP TABLE \`product\``);
        await queryRunner.query(`DROP TABLE \`product_image\``);
        await queryRunner.query(`DROP INDEX \`IDX_8978484a9cee7a0c780cd259b8\` ON \`product_type\``);
        await queryRunner.query(`DROP TABLE \`product_type\``);
        await queryRunner.query(`DROP TABLE \`supplier\``);
        await queryRunner.query(`DROP TABLE \`brand\``);
        await queryRunner.query(`DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
