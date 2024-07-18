<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# PadelPoint v1

## Levantar servidor

```bash
$ npm run start:dev
```

Por defecto se levanta en el puerto 3000

## Base de datos

La conexión a la base de datos parte de dos puntos principales en el proyecto que en escencia son el mismo concepto, el datasource.
Dentro del proyecto vas a encontrarte dos veces la misma configuración del datasource que van con funciones distintas

```typescrypt

app.module.ts

TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'nest',
      entities: [Brand, Order, Product, Supplier, User],
      synchronize: false,
    }),

orm-config.ts

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '1234',
  database: 'nest',
  synchronize: false,
  logging: false,
  entities: [User, Brand, Order, Product, Supplier], // Ajusta según tus entidades
  migrations: ['src/migrations/*.ts'],
  subscribers: [],
});

```

Uno es para darle a entender a nest el 'contexto' de la base de datos y el otro es una configuracion para typeorm para la creacion de las interfaces. Esto es lo de menos, lo importante es que cambies las credenciales por las tuyas que vayas a usar en local hasta que cambiemos a produccion. Principalmente el username, password y la database son las principales credenciales que varian en local. Asi que lo de siempre, vas a tener que tener un entorno para ejecutar la db en mysql (MySql Workbench, DBeaver, el que sea), crees tanto el usuario como una base para conectarse y cambies las credenciales.
El resto dejalo como está, no debe tener mas problemas para conectarse a partir de acá

## Migrations

Para generar la migración se debe tipear el siguiente comando en consola

```bash
# path: Lugar del proyecto donde se guarda la migracion. Por ejemplo puede ser ./src/migrations/(nombremigracion) hace esa por las dudas xd
$ npm run migration:generate -- path*
```

Para ejecutar la migracion y llevarla a la db se debe hacer lo siguiente

```bash
# Se guardará en la base configurada en el datasource
$ npm run migration:run
```

Una vez creada y ejecutada la migración se crearán las tablas, por defecto de voy a dejar una migracion que por defecto crean un par de marcas, un par de provedores y 5 productos con una imagen de prueba. Tené en cuenta que si creas una migracion nueva no vas a tener registros cargados y vas a tener que cargar productos a mano.

## Endpoints

No voy a detallar mucho acerca de los endpoints ya que está todo en swagger, por lo que podrás hacerte cuenta por como viene la mano. Lo unico que te voy a decir es que vas a poder acceder a todos los controladores a excepcion de las ordenes de compra, opté por dejarlas para versionado posterior. Pero en lo que es productos, marcas y provedores vas a poder crear, actualizar y eliminar sin problemas.
Cabe destacar que todas estas operaciones son publicas por defecto asi que servirá para dar forma en el frontend de una forma mas sencilla, con el tiempo iremos añadiendo roles para limitar el acceso

## Auth / Users

Los usuarios es mas de lo mismo, se podra registrar, actualizar todos los campos (incluida la contraseña) pero no lo unico que no vas a poder será eliminar usuarios. Para eso requerirás iniciar sesión (en algun lado tenia que meter el auth ajajaj)
Los inicios de sesión son mediante cookies, esto facilita que no tengas que poner el token en el header.
Por defecto los tokens duran 30 minutos, por lo que cuando inicies sesion tendras permisos durante ese tiempo para hacer las peticiones.

(A este punto de escribir la documentacion son las 04:48 de la mañana y un deseo inmenso de cortartme los huevos al darme cuenta que hay un inicio de sesion pero no hay register la re putisima madre)
(Falsa alarma si está, estaba en users asi que piola)

Para iniciar sesion tenes que ingresar el nombre de usuario y la contraseña

## Toma nota de todo

A este punto la api tomo un tamaño importante que no puedo estar al tanto de todo, cualquier error que encuentres está perfecto que lo arregles en local si te sentis zarpado, pero es importante que me lo comentes asi lo arreglo lo antes posible ㊗
