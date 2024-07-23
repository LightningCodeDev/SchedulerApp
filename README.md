<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Scheduler App in NestJS
## Description

App that handles management and scheduling of tasks.

## Installation

1. Install dependencies
	```bash
$ npm install
```
2. Setup postgresql and redis locally
3. Update .env file
4. Run prisma migrations
	```bash
$ npx prisma migrate deploy
```


## Running the app

```bash
# run the app
$ npm run start

```

## Tests

```bash
# unit tests
$ npm run test
```

## Documentation
Once the app is running access swagger UI on http://localhost:3000/api


## License

Nest is [MIT licensed](LICENSE).
