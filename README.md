<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

<h1 align="center">@nestutils/mongo-config-client</h1>


## Description
This NestJS Module can be used to connect with mongodb based config server to fetch environment specific configurations.

## Installation
In your existing NestJS-based project:
```
$ npm install --save @nestutils/mongo-config-client
```

## Usage
```typescript
import { Module } from '@nestjs/common'
import { ClientConfigModule } from '@nestutils/mongo-config-client'
@Module({
    imports: [
      ClientConfigModule.forRootAsync({
        uri: '*******************',
        dbName: '***************',
        collectionName: '****************',
        applicationId: '**************************'
    }),
      ]
})
export class AppModule {}
```

## Contributions
Any suggestions, issues, bug-fixes, PR's are most welcomed. Thanks.

## Note
This project is currently in active development 🚧. Breaking changes are expected.