# Requirements
* NodeJS (v18.8.0 or later)
* npm (v8.18.0 or later)
* Gulp (v4.0.2 or later)

# Installation

#### ▶️️️️️ Step 1: Checking Environment.
Before start make sure to check your current environment. In your shell termnial enter the following:
```
node -v
npm -v
```
The commands above should display the current Node and NPM versions.

#### ▶️️️️️ Step 2: Using Different Node Version. (optional)
If your Node version is different from the required one, you can install and use [NVM – Node Version Manager](https://github.com/nvm-sh/nvm) This manager allows to use the specific Node version per project.

Navigate your termnial working directory to `📁 SOURCE` folder. The following command will set the currently used NodeJS version to the required one:
```
nvm use
```

#### ▶️️️️️ Step 3: Installing Gulp.
It's recommended to install Gulp and Gulp CLI globally so `gulp` command will be accessible via system terminal.
```
npm i -g gulp gulp-cli
npm i
```

#### ▶️️️️️ Step 4: Configuring.
Open `📁 SOURCE/gulpfile.js` file specify the working directories and optionally turn on/off minification:
```js
const
  compilation = {
    src: '.', // source dir (current)
    dist: '../HTML', // compilation dir
    minify: true
  };
```

#### ▶️️️️️ Step 5: Running.
```
gulp default
```

In your browser open `http://localhost:3000/`. You should the see template index page.
