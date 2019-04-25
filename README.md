# Topcoder navigation prototype

## Demo URL

- https://tc-unified-nav.herokuapp.com/

## Design

- https://marvelapp.com/89423f8 
- https://marvelapp.com/1dgiejg6 

## Install gulp dependencies

```
npm install -g gulp  
npm i
```

## Build scss  

```
gulp styles
```

## Build and watch scss(auto build css after save file)  

```
gulp
```

## Theme

```
Theme is in sass/_global/_themes.scss
```

## Run web

```
npm start
```

- Then open http://localhost:3000/dark for dark theme in browser
- Then open http://localhost:3000/light for light theme in browser

## How to test different notification icon status
index-light.html and index-dark.html,there are 4 code lines:367,372,377,382.
remove the "hide" class from one of the 4 lines,will show the different notification icon status.

## Notification showcase in both Desktop and Mobile views
Click on notification icon first time,will show the notification popup with Empty status,
click it second time,will show the notification popup with Populated status.