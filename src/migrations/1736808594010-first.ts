import { MigrationInterface, QueryRunner } from "typeorm";

export class First1736808594010 implements MigrationInterface {
    name = 'First1736808594010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "address" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "postalCode" varchar(10) NOT NULL, "addressStreet" varchar(30) NOT NULL, "addressNumber" varchar(10) NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(50) NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "surname" varchar NOT NULL, "username" varchar NOT NULL, "isActive" boolean NOT NULL DEFAULT (1), "phone" varchar(20) NOT NULL, "idNumber" varchar NOT NULL, "email" varchar NOT NULL, "method" varchar NOT NULL DEFAULT ('local'), "password" varchar, "passwordResetToken" varchar, "passwordResetTokenExpiresIn" date)`);
        await queryRunner.query(`CREATE TABLE "brand" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(50) NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "supplier" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(50) NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "product_type" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(50) NOT NULL, CONSTRAINT "UQ_8978484a9cee7a0c780cd259b88" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "product_image" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "url" text NOT NULL, "productId" integer)`);
        await queryRunner.query(`CREATE TABLE "product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "isActive" boolean NOT NULL DEFAULT (1), "price" decimal(10,2) NOT NULL, "cost" decimal(10,2) NOT NULL, "name" varchar NOT NULL, "stock" integer NOT NULL DEFAULT (0), "description" text NOT NULL, "image" text NOT NULL, "typeId" integer, "brandId" integer, "supplierId" integer)`);
        await queryRunner.query(`CREATE TABLE "order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "paymentId" varchar NOT NULL, "dateCreated" date NOT NULL DEFAULT (CURRENT_TIMESTAMP), "paymentMethod" varchar NOT NULL DEFAULT ('Mercado Pago Transference'), "netPrice" decimal(10,2) NOT NULL, "IVA" decimal(10,2) NOT NULL DEFAULT (0.21), "total" decimal(10,2) NOT NULL, "profit" decimal(10,2) NOT NULL, "addressId" integer, "userId" integer, CONSTRAINT "UQ_9ad13532f48db4ac5a3b3dd70e5" UNIQUE ("paymentId"))`);
        await queryRunner.query(`CREATE TABLE "product-order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL DEFAULT (1), "orderId" integer, "productId" integer)`);
        await queryRunner.query(`CREATE TABLE "user_address_address" ("userId" integer NOT NULL, "addressId" integer NOT NULL, PRIMARY KEY ("userId", "addressId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b3641446351e94089ba80de503" ON "user_address_address" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c3ca130325607a626583e7e9c4" ON "user_address_address" ("addressId") `);
        await queryRunner.query(`CREATE TABLE "user_roles_roles" ("userId" integer NOT NULL, "rolesId" integer NOT NULL, PRIMARY KEY ("userId", "rolesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0d0cc409255467b0ac4fe6b169" ON "user_roles_roles" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7521d8491e7c51f885e9f861e0" ON "user_roles_roles" ("rolesId") `);
        await queryRunner.query(`CREATE TABLE "temporary_product_image" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "url" text NOT NULL, "productId" integer, CONSTRAINT "FK_40ca0cd115ef1ff35351bed8da2" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_product_image"("id", "url", "productId") SELECT "id", "url", "productId" FROM "product_image"`);
        await queryRunner.query(`DROP TABLE "product_image"`);
        await queryRunner.query(`ALTER TABLE "temporary_product_image" RENAME TO "product_image"`);
        await queryRunner.query(`CREATE TABLE "temporary_product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "isActive" boolean NOT NULL DEFAULT (1), "price" decimal(10,2) NOT NULL, "cost" decimal(10,2) NOT NULL, "name" varchar NOT NULL, "stock" integer NOT NULL DEFAULT (0), "description" text NOT NULL, "image" text NOT NULL, "typeId" integer, "brandId" integer, "supplierId" integer, CONSTRAINT "FK_53bafe3ecc25867776c07c9e666" FOREIGN KEY ("typeId") REFERENCES "product_type" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_bb7d3d9dc1fae40293795ae39d6" FOREIGN KEY ("brandId") REFERENCES "brand" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4346e4adb741e80f3711ee09ba4" FOREIGN KEY ("supplierId") REFERENCES "supplier" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_product"("id", "isActive", "price", "cost", "name", "stock", "description", "image", "typeId", "brandId", "supplierId") SELECT "id", "isActive", "price", "cost", "name", "stock", "description", "image", "typeId", "brandId", "supplierId" FROM "product"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`ALTER TABLE "temporary_product" RENAME TO "product"`);
        await queryRunner.query(`CREATE TABLE "temporary_order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "paymentId" varchar NOT NULL, "dateCreated" date NOT NULL DEFAULT (CURRENT_TIMESTAMP), "paymentMethod" varchar NOT NULL DEFAULT ('Mercado Pago Transference'), "netPrice" decimal(10,2) NOT NULL, "IVA" decimal(10,2) NOT NULL DEFAULT (0.21), "total" decimal(10,2) NOT NULL, "profit" decimal(10,2) NOT NULL, "addressId" integer, "userId" integer, CONSTRAINT "UQ_9ad13532f48db4ac5a3b3dd70e5" UNIQUE ("paymentId"), CONSTRAINT "FK_73f9a47e41912876446d047d015" FOREIGN KEY ("addressId") REFERENCES "address" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_order"("id", "paymentId", "dateCreated", "paymentMethod", "netPrice", "IVA", "total", "profit", "addressId", "userId") SELECT "id", "paymentId", "dateCreated", "paymentMethod", "netPrice", "IVA", "total", "profit", "addressId", "userId" FROM "order"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`ALTER TABLE "temporary_order" RENAME TO "order"`);
        await queryRunner.query(`CREATE TABLE "temporary_product-order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL DEFAULT (1), "orderId" integer, "productId" integer, CONSTRAINT "FK_69082506ca875b517d210b1efbb" FOREIGN KEY ("orderId") REFERENCES "order" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_8df7afab455fc84fee7c9fd0a47" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_product-order"("id", "quantity", "orderId", "productId") SELECT "id", "quantity", "orderId", "productId" FROM "product-order"`);
        await queryRunner.query(`DROP TABLE "product-order"`);
        await queryRunner.query(`ALTER TABLE "temporary_product-order" RENAME TO "product-order"`);
        await queryRunner.query(`DROP INDEX "IDX_b3641446351e94089ba80de503"`);
        await queryRunner.query(`DROP INDEX "IDX_c3ca130325607a626583e7e9c4"`);
        await queryRunner.query(`CREATE TABLE "temporary_user_address_address" ("userId" integer NOT NULL, "addressId" integer NOT NULL, CONSTRAINT "FK_b3641446351e94089ba80de5034" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_c3ca130325607a626583e7e9c41" FOREIGN KEY ("addressId") REFERENCES "address" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("userId", "addressId"))`);
        await queryRunner.query(`INSERT INTO "temporary_user_address_address"("userId", "addressId") SELECT "userId", "addressId" FROM "user_address_address"`);
        await queryRunner.query(`DROP TABLE "user_address_address"`);
        await queryRunner.query(`ALTER TABLE "temporary_user_address_address" RENAME TO "user_address_address"`);
        await queryRunner.query(`CREATE INDEX "IDX_b3641446351e94089ba80de503" ON "user_address_address" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c3ca130325607a626583e7e9c4" ON "user_address_address" ("addressId") `);
        await queryRunner.query(`DROP INDEX "IDX_0d0cc409255467b0ac4fe6b169"`);
        await queryRunner.query(`DROP INDEX "IDX_7521d8491e7c51f885e9f861e0"`);
        await queryRunner.query(`CREATE TABLE "temporary_user_roles_roles" ("userId" integer NOT NULL, "rolesId" integer NOT NULL, CONSTRAINT "FK_0d0cc409255467b0ac4fe6b1693" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_7521d8491e7c51f885e9f861e02" FOREIGN KEY ("rolesId") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE CASCADE, PRIMARY KEY ("userId", "rolesId"))`);
        await queryRunner.query(`INSERT INTO "temporary_user_roles_roles"("userId", "rolesId") SELECT "userId", "rolesId" FROM "user_roles_roles"`);
        await queryRunner.query(`DROP TABLE "user_roles_roles"`);
        await queryRunner.query(`ALTER TABLE "temporary_user_roles_roles" RENAME TO "user_roles_roles"`);
        await queryRunner.query(`CREATE INDEX "IDX_0d0cc409255467b0ac4fe6b169" ON "user_roles_roles" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_7521d8491e7c51f885e9f861e0" ON "user_roles_roles" ("rolesId") `);

        // INSERTS
        
        // MARCAS
        await queryRunner.query(`insert into brand (name) values ('ADIDAS'),('BABOLAT'),('BULLPADEL'),('NOX'),('SIUX'),('ROYAL'),('COAST'),('TOP FORCE'),('BLACK CROWN'),('FELINA PADEL'),('HEAD')`);
        
        // // PROVEDORES
        await queryRunner.query(`insert into supplier (name) values ('Gonza'), ('SC Group Gus'), ('Maxi Fernandez')`);

        // // TIPO DE PRODUCTO
        await queryRunner.query(`insert into product_type (name) values ('paleta')`);

        // // PRODUCTOS

        await queryRunner.query(`insert into product (name, price, cost, stock, description, image, typeId , brandId, supplierId) values
        ('ADIDAS ADIPOWER LIGHT 3.2 2023', 280.00, 250.00, 100, 'Esta es la descripcion de la ADIDAS ADIPOWER LIGHT 3.2 2023', 'https://imgs.search.brave.com/CntldRuuGAWhuSmml4KJkCDa-AVZydzdHVBEBhBayQc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMjho/aTkzZ3I2OTdvbC5j/bG91ZGZyb250Lm5l/dC81YTFhNzBlMS02/MzIxLTY5NDQtZWQ5/My02N2E0ODU1MDM1/MDQvaW1nL1Byb2R1/Y3RvL2U2YmUyOTMz/LTVkMGUtZmVkMS1i/OThkLTVlYjgxNDhj/YzBjNy9BQS1WZXJ0/ZXgtMDMtMjAyMy02/NGFlZTBkMTU2MDRm/LmpwZw', 1, 1, 1),
        ('BABOLAT AIR VERON 2022', 235.00, 210.00, 100, 'Esta es la descripcion de la BABOLAT AIR VERON 2022', 'https://imgs.search.brave.com/CntldRuuGAWhuSmml4KJkCDa-AVZydzdHVBEBhBayQc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMjho/aTkzZ3I2OTdvbC5j/bG91ZGZyb250Lm5l/dC81YTFhNzBlMS02/MzIxLTY5NDQtZWQ5/My02N2E0ODU1MDM1/MDQvaW1nL1Byb2R1/Y3RvL2U2YmUyOTMz/LTVkMGUtZmVkMS1i/OThkLTVlYjgxNDhj/YzBjNy9BQS1WZXJ0/ZXgtMDMtMjAyMy02/NGFlZTBkMTU2MDRm/LmpwZw', 1, 2, 1),
        ('BULLPADEL FLOW LIGHT 2022', 120.00, 100.00, 100, 'Esta es la descripcion de la BULLPADEL FLOW LIGHT 2022', 'https://imgs.search.brave.com/CntldRuuGAWhuSmml4KJkCDa-AVZydzdHVBEBhBayQc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMjho/aTkzZ3I2OTdvbC5j/bG91ZGZyb250Lm5l/dC81YTFhNzBlMS02/MzIxLTY5NDQtZWQ5/My02N2E0ODU1MDM1/MDQvaW1nL1Byb2R1/Y3RvL2U2YmUyOTMz/LTVkMGUtZmVkMS1i/OThkLTVlYjgxNDhj/YzBjNy9BQS1WZXJ0/ZXgtMDMtMjAyMy02/NGFlZTBkMTU2MDRm/LmpwZw', 1, 3, 1),
        ('PITON 11', 282.00, 200.00, 100, 'Esta es la descripcion de la PITON 11', 'https://imgs.search.brave.com/CntldRuuGAWhuSmml4KJkCDa-AVZydzdHVBEBhBayQc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMjho/aTkzZ3I2OTdvbC5j/bG91ZGZyb250Lm5l/dC81YTFhNzBlMS02/MzIxLTY5NDQtZWQ5/My02N2E0ODU1MDM1/MDQvaW1nL1Byb2R1/Y3RvL2U2YmUyOTMz/LTVkMGUtZmVkMS1i/OThkLTVlYjgxNDhj/YzBjNy9BQS1WZXJ0/ZXgtMDMtMjAyMy02/NGFlZTBkMTU2MDRm/LmpwZw', 1, 9, 2),
        ('METALBONE 3.3 HRD', 490.00, 450.00, 100, 'Esta es la descripcion de la METALBONE 3.3 HRD', 'https://imgs.search.brave.com/CntldRuuGAWhuSmml4KJkCDa-AVZydzdHVBEBhBayQc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kMjho/aTkzZ3I2OTdvbC5j/bG91ZGZyb250Lm5l/dC81YTFhNzBlMS02/MzIxLTY5NDQtZWQ5/My02N2E0ODU1MDM1/MDQvaW1nL1Byb2R1/Y3RvL2U2YmUyOTMz/LTVkMGUtZmVkMS1i/OThkLTVlYjgxNDhj/YzBjNy9BQS1WZXJ0/ZXgtMDMtMjAyMy02/NGFlZTBkMTU2MDRm/LmpwZw', 1, 1, 3)`);

        // // IMAGENES SECUNDARIAS

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

        // // TIPO DE USUARIO

        await queryRunner.query(`insert into roles (name) values ('user'), ('admin')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_7521d8491e7c51f885e9f861e0"`);
        await queryRunner.query(`DROP INDEX "IDX_0d0cc409255467b0ac4fe6b169"`);
        await queryRunner.query(`ALTER TABLE "user_roles_roles" RENAME TO "temporary_user_roles_roles"`);
        await queryRunner.query(`CREATE TABLE "user_roles_roles" ("userId" integer NOT NULL, "rolesId" integer NOT NULL, PRIMARY KEY ("userId", "rolesId"))`);
        await queryRunner.query(`INSERT INTO "user_roles_roles"("userId", "rolesId") SELECT "userId", "rolesId" FROM "temporary_user_roles_roles"`);
        await queryRunner.query(`DROP TABLE "temporary_user_roles_roles"`);
        await queryRunner.query(`CREATE INDEX "IDX_7521d8491e7c51f885e9f861e0" ON "user_roles_roles" ("rolesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0d0cc409255467b0ac4fe6b169" ON "user_roles_roles" ("userId") `);
        await queryRunner.query(`DROP INDEX "IDX_c3ca130325607a626583e7e9c4"`);
        await queryRunner.query(`DROP INDEX "IDX_b3641446351e94089ba80de503"`);
        await queryRunner.query(`ALTER TABLE "user_address_address" RENAME TO "temporary_user_address_address"`);
        await queryRunner.query(`CREATE TABLE "user_address_address" ("userId" integer NOT NULL, "addressId" integer NOT NULL, PRIMARY KEY ("userId", "addressId"))`);
        await queryRunner.query(`INSERT INTO "user_address_address"("userId", "addressId") SELECT "userId", "addressId" FROM "temporary_user_address_address"`);
        await queryRunner.query(`DROP TABLE "temporary_user_address_address"`);
        await queryRunner.query(`CREATE INDEX "IDX_c3ca130325607a626583e7e9c4" ON "user_address_address" ("addressId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b3641446351e94089ba80de503" ON "user_address_address" ("userId") `);
        await queryRunner.query(`ALTER TABLE "product-order" RENAME TO "temporary_product-order"`);
        await queryRunner.query(`CREATE TABLE "product-order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "quantity" integer NOT NULL DEFAULT (1), "orderId" integer, "productId" integer)`);
        await queryRunner.query(`INSERT INTO "product-order"("id", "quantity", "orderId", "productId") SELECT "id", "quantity", "orderId", "productId" FROM "temporary_product-order"`);
        await queryRunner.query(`DROP TABLE "temporary_product-order"`);
        await queryRunner.query(`ALTER TABLE "order" RENAME TO "temporary_order"`);
        await queryRunner.query(`CREATE TABLE "order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "paymentId" varchar NOT NULL, "dateCreated" date NOT NULL DEFAULT (CURRENT_TIMESTAMP), "paymentMethod" varchar NOT NULL DEFAULT ('Mercado Pago Transference'), "netPrice" decimal(10,2) NOT NULL, "IVA" decimal(10,2) NOT NULL DEFAULT (0.21), "total" decimal(10,2) NOT NULL, "profit" decimal(10,2) NOT NULL, "addressId" integer, "userId" integer, CONSTRAINT "UQ_9ad13532f48db4ac5a3b3dd70e5" UNIQUE ("paymentId"))`);
        await queryRunner.query(`INSERT INTO "order"("id", "paymentId", "dateCreated", "paymentMethod", "netPrice", "IVA", "total", "profit", "addressId", "userId") SELECT "id", "paymentId", "dateCreated", "paymentMethod", "netPrice", "IVA", "total", "profit", "addressId", "userId" FROM "temporary_order"`);
        await queryRunner.query(`DROP TABLE "temporary_order"`);
        await queryRunner.query(`ALTER TABLE "product" RENAME TO "temporary_product"`);
        await queryRunner.query(`CREATE TABLE "product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "isActive" boolean NOT NULL DEFAULT (1), "price" decimal(10,2) NOT NULL, "cost" decimal(10,2) NOT NULL, "name" varchar NOT NULL, "stock" integer NOT NULL DEFAULT (0), "description" text NOT NULL, "image" text NOT NULL, "typeId" integer, "brandId" integer, "supplierId" integer)`);
        await queryRunner.query(`INSERT INTO "product"("id", "isActive", "price", "cost", "name", "stock", "description", "image", "typeId", "brandId", "supplierId") SELECT "id", "isActive", "price", "cost", "name", "stock", "description", "image", "typeId", "brandId", "supplierId" FROM "temporary_product"`);
        await queryRunner.query(`DROP TABLE "temporary_product"`);
        await queryRunner.query(`ALTER TABLE "product_image" RENAME TO "temporary_product_image"`);
        await queryRunner.query(`CREATE TABLE "product_image" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "url" text NOT NULL, "productId" integer)`);
        await queryRunner.query(`INSERT INTO "product_image"("id", "url", "productId") SELECT "id", "url", "productId" FROM "temporary_product_image"`);
        await queryRunner.query(`DROP TABLE "temporary_product_image"`);
        await queryRunner.query(`DROP INDEX "IDX_7521d8491e7c51f885e9f861e0"`);
        await queryRunner.query(`DROP INDEX "IDX_0d0cc409255467b0ac4fe6b169"`);
        await queryRunner.query(`DROP TABLE "user_roles_roles"`);
        await queryRunner.query(`DROP INDEX "IDX_c3ca130325607a626583e7e9c4"`);
        await queryRunner.query(`DROP INDEX "IDX_b3641446351e94089ba80de503"`);
        await queryRunner.query(`DROP TABLE "user_address_address"`);
        await queryRunner.query(`DROP TABLE "product-order"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "product_image"`);
        await queryRunner.query(`DROP TABLE "product_type"`);
        await queryRunner.query(`DROP TABLE "supplier"`);
        await queryRunner.query(`DROP TABLE "brand"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "address"`);
    }

}
