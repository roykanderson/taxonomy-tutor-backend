# Taxonomy Tutor
#### Live Demo: https://taxonomy-tutor.onrender.com/

Taxonomy Tutor is a web application for practicing species identification with virtual flashcards. I built it with Express, React, React Router, React Query, and MongoDB. The app was inspired by my experience working as a field biologist, when I needed an efficient way to memorize all of the tide pool species on the Oregon coast. I wanted an app where I could seamlessly search for species and add their information to flashcard sets, all on one platform.

### Overview

The application is split into two parts: the server and the client. The server-side application is implemented in Node.js with Express. The server interfaces with a MongoDB database, which stores information about users and their flashcard sets. The client-side application is written with React. The production build of the React code is sent to the client as static content by the server. Users can create an account, search for species by taxonomic group, add species to flashcard sets, and edit or delete sets. All species information is retrieved from the iNaturalist API and MediaWiki API.

### Server

All code for the server-side Express application is contained within the project’s root directory.
There are several configuration files: package.json and package-lock.json contain descriptive and functional metadata about the application, .gitignore tells git to ignore certain sensitive files, .eslintrc configures ESLint, and .eslintignore is necessary for ESLint to ignore .eslintrc.

The index.js file is the entry point into the Express application. index.js creates the server that listens for HTTP requests from the client, and app.js defines the Express application that the server uses to handle these HTTP requests. Environment variables are accessed via ./utils/config.js. Functions for logging requests and errors are defined in utils/logger.js. All custom Express middleware is defined in utils/middleware.js. Any helper functions are defined in utils/helpers.js.

The "models" subdirectory contains two files, StudySet.js and User.js, which define interfaces for creating, reading, updating, and deleting user and flashcard set documents from the database, which is hosted on MongoDB Atlas. The "controllers" subdirectory contains Express routers for handling HTTP requests from the client for performing and retrieving various actions and resources throughout the application. loginRouter.js allow users to create an account, usersRouter.js is used for accessing those accounts via token-based authentication, and studySetsRouter.js handles requests for flashcard sets. taxaRouter.js is a wrapper around the iNaturalist API and provides custom endpoints for retrieving data for all species contained within any particular taxonomic group.

### Client

All code for the client-side React application is contained in the “build” and “client” subdirectories.

“build” contains the production build of the client-side React application. In “build”, there are several files that the browser receives when it accesses the site. Among these files is index.html. Whenever an HTTP GET request is made to the Express application that does not match any API endpoint, the application serves the client index.html. Once received, index.html instructs the client’s browser to send an additional request for the minified production code of the React application, which is contained in the build/static/js subdirectory. This single script injects the entire React application into index.html, adding content to the page. index.html also instructs the browser to send additional requests for all CSS, SVG icons, and favicons, which are contained in build/static/css, build/static/media, and build subdirectories, respectively.

In “client”, there are two subdirectories (“src” and “public”) along with two configuration files. “src” contains all source code for the React application. “public” contains index.html and all other static files bundled with the application. package.json and package-lock.json contain descriptive and functional metadata about the application.

Within "src", there are several more subdirectories, along with index.js and App.js. index.js acts as the entry point into the React application. App.js serves as the highest level React component, handling the rendering of all content that appears on the webpage. Routing to subpages is implemented within App.js using React Router. Within the “context” subdirectory, UserContext.js defines a user object that is accessed and set throughout application via the React Context API. The "pages" subdirectory contains the React components used in each page of the application, as well their styles. The "components" subdirectory contains all React components and styles that are not unique to a specific page (e.g. Navbar or LoadingIcon). The "assets" subdirectory contains global styles and all SVG icons used throughout the app. The "utils" subdirectory contains utility functions for various functionalities implemented within select components. The "services" subdirectory defines two modules (taxaService.js and userService.js) that allow the client to interface with the API endpoints defined in the Express application. Lastly, the "hooks" subdirectory contains individual files for all custom hooks used throughout the application. The majority of the project’s custom hooks utilize React Query to perform data fetching tasks.