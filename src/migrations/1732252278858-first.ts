import { MigrationInterface, QueryRunner } from "typeorm";

export class First1732252278858 implements MigrationInterface {
    name = 'First1732252278858'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`address\` (\`id\` int NOT NULL AUTO_INCREMENT, \`postalCode\` varchar(10) NOT NULL, \`addressStreet\` varchar(30) NOT NULL, \`addressNumber\` varchar(10) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`identification_type\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(20) NOT NULL, UNIQUE INDEX \`IDX_1bddbdc00ecfb061c6b81a3cc8\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`surname\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`phone\` varchar(20) NOT NULL, \`idNumber\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`method\` enum ('LOCAL', 'GOOGLE') NOT NULL DEFAULT 'LOCAL', \`password\` varchar(255) NULL, \`passwordResetToken\` varchar(255) NULL, \`passwordResetTokenExpiresIn\` timestamp NULL, \`idTypeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`brand\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`supplier\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_type\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(50) NOT NULL, UNIQUE INDEX \`IDX_8978484a9cee7a0c780cd259b8\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_image\` (\`id\` int NOT NULL AUTO_INCREMENT, \`url\` text NOT NULL, \`productId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`price\` int NOT NULL, \`shippingCost\` float NOT NULL, \`stock\` int NOT NULL DEFAULT '0', \`description\` text NOT NULL, \`image\` text NOT NULL, \`typeId\` int NULL, \`brandId\` int NULL, \`supplierId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`paymentId\` varchar(255) NOT NULL, \`dateCreated\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`devDateEstimated\` datetime NULL, \`devDate\` datetime NULL, \`paymentMethod\` varchar(255) NOT NULL DEFAULT 'MP_TRANSFER', \`isPayed\` tinyint NOT NULL DEFAULT 0, \`datePayed\` timestamp NULL, \`installments\` int NULL, \`addressId\` int NULL, \`userId\` int NULL, UNIQUE INDEX \`IDX_9ad13532f48db4ac5a3b3dd70e\` (\`paymentId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product-order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL DEFAULT '1', \`orderId\` int NULL, \`productId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_address_address\` (\`userId\` int NOT NULL, \`addressId\` int NOT NULL, INDEX \`IDX_b3641446351e94089ba80de503\` (\`userId\`), INDEX \`IDX_c3ca130325607a626583e7e9c4\` (\`addressId\`), PRIMARY KEY (\`userId\`, \`addressId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_roles_roles\` (\`userId\` int NOT NULL, \`rolesId\` int NOT NULL, INDEX \`IDX_0d0cc409255467b0ac4fe6b169\` (\`userId\`), INDEX \`IDX_7521d8491e7c51f885e9f861e0\` (\`rolesId\`), PRIMARY KEY (\`userId\`, \`rolesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD CONSTRAINT \`FK_8fab721793695eec4a7d65f8c00\` FOREIGN KEY (\`idTypeId\`) REFERENCES \`identification_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_image\` ADD CONSTRAINT \`FK_40ca0cd115ef1ff35351bed8da2\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_53bafe3ecc25867776c07c9e666\` FOREIGN KEY (\`typeId\`) REFERENCES \`product_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_bb7d3d9dc1fae40293795ae39d6\` FOREIGN KEY (\`brandId\`) REFERENCES \`brand\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_4346e4adb741e80f3711ee09ba4\` FOREIGN KEY (\`supplierId\`) REFERENCES \`supplier\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_73f9a47e41912876446d047d015\` FOREIGN KEY (\`addressId\`) REFERENCES \`address\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_caabe91507b3379c7ba73637b84\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product-order\` ADD CONSTRAINT \`FK_69082506ca875b517d210b1efbb\` FOREIGN KEY (\`orderId\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product-order\` ADD CONSTRAINT \`FK_8df7afab455fc84fee7c9fd0a47\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_address_address\` ADD CONSTRAINT \`FK_b3641446351e94089ba80de5034\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_address_address\` ADD CONSTRAINT \`FK_c3ca130325607a626583e7e9c41\` FOREIGN KEY (\`addressId\`) REFERENCES \`address\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_roles_roles\` ADD CONSTRAINT \`FK_0d0cc409255467b0ac4fe6b1693\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_roles_roles\` ADD CONSTRAINT \`FK_7521d8491e7c51f885e9f861e02\` FOREIGN KEY (\`rolesId\`) REFERENCES \`roles\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    
        // INSERTS
        
        // MARCAS
        await queryRunner.query(`insert into brand (name) values ('ADIDAS'),('BABOLAT'),('BULLPADEL'),('NOX'),('SIUX'),('ROYAL'),('COAST'),('TOP FORCE'),('BLACK CROWN'),('FELINA PADEL'),('HEAD')`);
        
        // PROVEDORES
        await queryRunner.query(`insert into supplier (name) values ('Gonza'), ('SC Group Gus'), ('Maxi Fernandez')`);

        // TIPO DE PRODUCTO
        await queryRunner.query(`insert into product_type (name) values ('paleta')`);

        // PRODUCTOS

        await queryRunner.query(`insert into product (name, price, shippingCost, stock, description, image, typeId , brandId, supplierId) values
        ('ADIDAS ADIPOWER LIGHT 3.2 2023', 280.00, 100.00, 3, 'Esta es la descripcion de la ADIDAS ADIPOWER LIGHT 3.2 2023', 'https://imgs.search.brave.com/CntldRuuGAWhuSmml4KJkCDa-AVZydzdHVBEBhBayQc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMjho/aTkzZ3I2OTdvbC5j/bG91ZGZyb250Lm5l/dC81YTFhNzBlMS02/MzIxLTY5NDQtZWQ5/My02N2E0ODU1MDM1/MDQvaW1nL1Byb2R1/Y3RvL2U2YmUyOTMz/LTVkMGUtZmVkMS1i/OThkLTVlYjgxNDhj/YzBjNy9BQS1WZXJ0/ZXgtMDMtMjAyMy02/NGFlZTBkMTU2MDRm/LmpwZw', 1, 1, 1),
        ('BABOLAT AIR VERON 2022', 235.00, 300.00, 12, 'Esta es la descripcion de la BABOLAT AIR VERON 2022', 'https://imgs.search.brave.com/CntldRuuGAWhuSmml4KJkCDa-AVZydzdHVBEBhBayQc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMjho/aTkzZ3I2OTdvbC5j/bG91ZGZyb250Lm5l/dC81YTFhNzBlMS02/MzIxLTY5NDQtZWQ5/My02N2E0ODU1MDM1/MDQvaW1nL1Byb2R1/Y3RvL2U2YmUyOTMz/LTVkMGUtZmVkMS1i/OThkLTVlYjgxNDhj/YzBjNy9BQS1WZXJ0/ZXgtMDMtMjAyMy02/NGFlZTBkMTU2MDRm/LmpwZw', 1, 2, 1),
        ('BULLPADEL FLOW LIGHT 2022', 120.00, 405.50, 0, 'Esta es la descripcion de la BULLPADEL FLOW LIGHT 2022', 'https://imgs.search.brave.com/CntldRuuGAWhuSmml4KJkCDa-AVZydzdHVBEBhBayQc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMjho/aTkzZ3I2OTdvbC5j/bG91ZGZyb250Lm5l/dC81YTFhNzBlMS02/MzIxLTY5NDQtZWQ5/My02N2E0ODU1MDM1/MDQvaW1nL1Byb2R1/Y3RvL2U2YmUyOTMz/LTVkMGUtZmVkMS1i/OThkLTVlYjgxNDhj/YzBjNy9BQS1WZXJ0/ZXgtMDMtMjAyMy02/NGFlZTBkMTU2MDRm/LmpwZw', 1, 3, 1),
        ('PITON 11', 282.00, 100.10, 21, 'Esta es la descripcion de la PITON 11', 'https://imgs.search.brave.com/CntldRuuGAWhuSmml4KJkCDa-AVZydzdHVBEBhBayQc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMjho/aTkzZ3I2OTdvbC5j/bG91ZGZyb250Lm5l/dC81YTFhNzBlMS02/MzIxLTY5NDQtZWQ5/My02N2E0ODU1MDM1/MDQvaW1nL1Byb2R1/Y3RvL2U2YmUyOTMz/LTVkMGUtZmVkMS1i/OThkLTVlYjgxNDhj/YzBjNy9BQS1WZXJ0/ZXgtMDMtMjAyMy02/NGFlZTBkMTU2MDRm/LmpwZw', 1, 9, 2),
        ('METALBONE 3.3 HRD', 490.00, 321.32, 2, 'Esta es la descripcion de la METALBONE 3.3 HRD', 'https://imgs.search.brave.com/CntldRuuGAWhuSmml4KJkCDa-AVZydzdHVBEBhBayQc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMjho/aTkzZ3I2OTdvbC5j/bG91ZGZyb250Lm5l/dC81YTFhNzBlMS02/MzIxLTY5NDQtZWQ5/My02N2E0ODU1MDM1/MDQvaW1nL1Byb2R1/Y3RvL2U2YmUyOTMz/LTVkMGUtZmVkMS1i/OThkLTVlYjgxNDhj/YzBjNy9BQS1WZXJ0/ZXgtMDMtMjAyMy02/NGFlZTBkMTU2MDRm/LmpwZw', 1, 1, 3)`);

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

        // TIPO DE USUARIO

        await queryRunner.query(`insert into roles (name) values ('user'), ('admin')`);

        // TIPOS DE IDENTIFICACION

        await queryRunner.query(`insert into identification_type (name) values ('DNI'), ('CPF'), ('CURP'), ('RUT')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_roles_roles\` DROP FOREIGN KEY \`FK_7521d8491e7c51f885e9f861e02\``);
        await queryRunner.query(`ALTER TABLE \`user_roles_roles\` DROP FOREIGN KEY \`FK_0d0cc409255467b0ac4fe6b1693\``);
        await queryRunner.query(`ALTER TABLE \`user_address_address\` DROP FOREIGN KEY \`FK_c3ca130325607a626583e7e9c41\``);
        await queryRunner.query(`ALTER TABLE \`user_address_address\` DROP FOREIGN KEY \`FK_b3641446351e94089ba80de5034\``);
        await queryRunner.query(`ALTER TABLE \`product-order\` DROP FOREIGN KEY \`FK_8df7afab455fc84fee7c9fd0a47\``);
        await queryRunner.query(`ALTER TABLE \`product-order\` DROP FOREIGN KEY \`FK_69082506ca875b517d210b1efbb\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_caabe91507b3379c7ba73637b84\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_73f9a47e41912876446d047d015\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_4346e4adb741e80f3711ee09ba4\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_bb7d3d9dc1fae40293795ae39d6\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_53bafe3ecc25867776c07c9e666\``);
        await queryRunner.query(`ALTER TABLE \`product_image\` DROP FOREIGN KEY \`FK_40ca0cd115ef1ff35351bed8da2\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_8fab721793695eec4a7d65f8c00\``);
        await queryRunner.query(`DROP INDEX \`IDX_7521d8491e7c51f885e9f861e0\` ON \`user_roles_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_0d0cc409255467b0ac4fe6b169\` ON \`user_roles_roles\``);
        await queryRunner.query(`DROP TABLE \`user_roles_roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_c3ca130325607a626583e7e9c4\` ON \`user_address_address\``);
        await queryRunner.query(`DROP INDEX \`IDX_b3641446351e94089ba80de503\` ON \`user_address_address\``);
        await queryRunner.query(`DROP TABLE \`user_address_address\``);
        await queryRunner.query(`DROP TABLE \`product-order\``);
        await queryRunner.query(`DROP INDEX \`IDX_9ad13532f48db4ac5a3b3dd70e\` ON \`order\``);
        await queryRunner.query(`DROP TABLE \`order\``);
        await queryRunner.query(`DROP TABLE \`product\``);
        await queryRunner.query(`DROP TABLE \`product_image\``);
        await queryRunner.query(`DROP INDEX \`IDX_8978484a9cee7a0c780cd259b8\` ON \`product_type\``);
        await queryRunner.query(`DROP TABLE \`product_type\``);
        await queryRunner.query(`DROP TABLE \`supplier\``);
        await queryRunner.query(`DROP TABLE \`brand\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`roles\``);
        await queryRunner.query(`DROP INDEX \`IDX_1bddbdc00ecfb061c6b81a3cc8\` ON \`identification_type\``);
        await queryRunner.query(`DROP TABLE \`identification_type\``);
        await queryRunner.query(`DROP TABLE \`address\``);
    }

}
