# gifsync

[gifsync](http://gifsync.com) is a project designed 
to ensure synchronized visual and audio loops.

## Firebase
### Setup Firebase Globally
``` bash
npm install -g firebase-tools
```
### Serve locally with Firebase (hosting + functions)
```
firebase serve --except none
```

### Deploy cloud functions and hosted site to Firebase
```
firebase deploy
```

## Project Development
### To Install Project Dependencies
```
npm install
```

### To Serve as Webpack
```
npm run dev
```

### To Build with Webpack
```
npm run build
```

### Requirements
- Firebase currently deploys Cloud Functions to a server running Node v3.9.1