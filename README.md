## About The Project

A full stack web application that streamlines the process of applying for jobs by allowing users to store tailored resumes and automatically selecting the best resumes for each job application. The application also includes features for tracking job applications, so you can easily check which resume you applied with and what the job description was. Visit [cv-stash.com](https://cv-stash.com) to try it out!

## Getting Started

### Prerequisites

To use this application, you will need accounts for the following services:

- Auth0
- MongoDB Atlas
- Amazon S3

### Installation

To install the application locally, run the following commands:

1. Clone the repository:

```sh
git clone https://github.com/jfang324/cv-stash.git
```

2. Navigate to the project directory:

```sh
cd cv-stash
```

3. Install the dependencies:

```sh
npm install
```

4. Create a `.env` file in the project directory and add the following environment variables:

```env
//use values provided to you after creating an app in auth0
AUTH0_DOMAIN = <provided by auth0>
AUTH0_CLIENT_ID = <provided by auth0>
AUTH0_CLIENT_SECRET = <provided by auth0>
AUTH0_SECRET = 'use [openssl rand -hex 32] to generate a 32 bytes value'
APP_BASE_URL = 'http://localhost:3000'

//use values provided after creating a bucket in s3 and an IAM user with read and write permissions
BUCKET_NAME = <bucket name>
BUCKET_REGION = <bucket region>
ACCESS_KEY = <bucket access key>
SECRET_ACCESS_KEY = <bucket secret access key>

//use values provided after creating a database in mongodb atlas
DATABASE_URL = <url provided after creating and choosing to programatiically connect>
```

5. Start the application:

```sh
npm run build
npm run start
```

6. Open your browser and navigate to `http://localhost:3000` to access the application.

## Gallery & Demonstrations

## Known Issues

- The app sidebar momentarily shows a login button after the user is authenticated due to cold start issues

## Contact

Jeffery Fang - [jefferyfang324@gmail.com](mailto:jefferyfang324@gmail.com)

## Tools & Technologies

- Next.js
- React
- Tailwind CSS
- Auth0
- MongoDB Atlas
- Amazon S3
- shadcn/ui
