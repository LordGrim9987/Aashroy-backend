![Logo](https://res.cloudinary.com/rupamcloud/image/upload/v1632588318/logo512_vkauoz.png)

# Aashroy

Mapping the homless and helping them

## Backend Tech Stack

**Server:** Express, MongoDB

## Third party services

- Google Oauth for authentication
- Cloudinary as a media storage

## Run Locally / Development Setup

Go to the project directory

```bash
  cd backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```

Start the development server

```bash
  npm run devStart
```

## Environment variables

To run this project, you will need to add the following environment variables to your .env file

`MONGODB_URL` [see docs](https://docs.mongodb.com/manual/reference/connection-string/)

`CLOUDINARY_SECRET_KEY` [see docs](https://cloudinary.com/documentation/how_to_integrate_cloudinary)

`CLOUDINARY_KEY` [see docs](https://cloudinary.com/documentation/how_to_integrate_cloudinary)

`ACCESS_TOKEN_SECRET` [see docs](https://www.npmjs.com/package/jsonwebtoken)

`BCRYPT_SALTROUNDS` [see docs](https://www.npmjs.com/package/bcrypt)

## To serve the frontend

Move the contents in `build` folder of `frontend` to `public` folder of the backend after successfully building the frontend for production.

## Contributors

- [Debashish Gogoi](https://github.com/Devzard)
- [Forheen Ahmed](https://github.com/Forheen)
- [Rishparn Gogoi](https://github.com/RG-404)
- [Rupam Jyoti Das](https://github.com/rupam2001)
