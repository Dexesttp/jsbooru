# JSBooru

![JSBooru screenshot](docs/images/screenshot.png)

## Description

JSBooru is a project to recreate a NodeJS version of the popular Booru websites starting from Danbooru onwards.

It's not intended for scalability, and will be optimized for small Unix environments. These requirements will probably change.

This project was originally made for a raspberry based Booru board.

### Features

Here is a list of feature we would want to integrate to JSBooru - starting from the most obvious ones to the most advanced !

- [x] Phase 1
  - [x] Upload pictures, picture info (such as source)
  - [x] Add tags to pictures
  - [x] Search by tags
- Phase 2
  - [ ] User login and options (exclude tags, disable comments, ...)
  - [ ] Score/favourites system
- Phase 3
  - [ ] Comment system
  - [ ] Notes/translations system
  - [ ] Wiki & Tag definitions
- Phase 4
  - [ ] Administration (flags, appeals, user management, image management)
- Extra features
  - [ ] Tag categories
  - [ ] Related pictures
  - [ ] Neverending scrolling
  - [ ] Server-wide customizable board theme
  - [ ] User theme choice
  - [ ] Board API

Here are some other features that we don't want to implement

- Forums : there is a lot of forum projects, just use one of them and redirect to them.

Feel free to propose other features as issues ! We will add them to the feature list or to the rejected list as they go, so don't hesitate to check back here from time to time.

## Getting started - installing

No releases are currently available. Check back later !

## Configuration

Server-wide configuration is available using the `config.json` file at the root.
An example file is given as `config.default.json`

The end goal is to have server-wide conigurations such as :

- [x] Where the files are stored.
- [ ] The need for user login to do some actions (post pictures, add tags, add notes, write comments).
- [ ] Whether to self-host or remote-host the files with things like imgur.
- [ ] Default user/admin options, so you don't have to login on your own server.
- [ ] API management (on/off features, manage tokens, throttle...)

In addition, user configs such as :

- [ ] Neverending board scroll
- [ ] Exclude tags
- [ ] Show/hide comments

As well as administrative features :

- [ ] Image management (delete pictures)
- [ ] User management (promotion, ban)
- [ ] Promotion levels (e.g. community moderator, moderator, administrator)

will be added via config pages.

### Adding themes

For now, themes are available under `/public/css/theme.css`.

The only way to edit the theme is to edit the file, and there is no current way to switch themes. Such options will be added at a further date.

## Getting started - developping

### General informations

THis project has the challenge of being able to run only on Javascript code.

The project is built solely using es3/5 for the front-end, and es6 features implemented in v8 for the backend.  
The only requirements are NodeJS compatibility (NodeJS v6 is the target version) and VueJS compatibility.

## Starting up

Ensure that you have `node` (version 8 or higher) and `npm` (version 5 or higher) installed. You can find them [here](https://nodejs.org/en/) (`npm` will get installed automatically).

To install the dependencies, you need run at least once:

```bash
npm install
```

Then, simply run:

```bash
npm start
```

To start the server with the default configuration.

### Librairies used

The goal is to use 100% Javascript/NodeJS librairies.

- [Jimp](https://github.com/oliver-moran/jimp)
  - Image manipulation in Javascript.
  - Sadly, it doesn't handle all the file formats we would allow, but it certainly does the job for png, jpg and bmp files.
- [Express](http://expressjs.com/)
  - ExpressJS is THE reference for NodeJS servers.
  - It is agremented of several components to handle data:
    - [body-parser](https://github.com/expressjs/body-parser) to handle JSON body contents
    - [busboy](https://github.com/mscdex/busboy) to handle file contents, as well as [connect-busboy](https://github.com/mscdex/connect-busboy) for middleware.
- [VueJS](http://vuejs.org/)
  - VueJS is one of the rising front-end presenters in the market.
  - It is agremented of several components for ease-of-use.
    - [vue-resource](https://github.com/pagekit/vue-resource) Easier HTTP calls, certainly beats using plain `XMLHttpRequest`.
    - [vue-router](https://router.vuejs.org/) adds page and hstory (back button) management to VueJS.
    - [vue2-autocomplete](https://github.com/BosNaufal/vue2-autocomplete) adds autocompletion for search results.

This list is very likely to expand or evolve as the project grows.

## License

This project is MIT. You can do with it as you like.

Note that any board made with the JSBooru project isn't necessarily endorsed by the JSBooru team.  
Because the project is MIT, we can't even disallow them to use our codebase, so don't bother to ask.
