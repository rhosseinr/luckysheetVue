# luckysheetVue

> LuckySheet Wrapper for vue 2

![](https://raw.githubusercontent.com/rhosseinr/luckysheetVue/master/screen.png)

## Features

- Open Form File
- Open From Url

## Tested in (desktop)

- Edge
- Chrome
- Firefox

## Installation

```
npm i luckysheetvue --save
```

## props

| Prop        | Type    | Description                 |
| ----------- | ------- | --------------------------- |
| url         | String  | Excel Url                   |
| file        | String  | Excel File                  |
| lang        | String  | set Ui Language             |
| showInfoBar | Boolean | Show/Hide Info Bar          |
| backUrl     | String  | Url Address For Back Button |
| update      | Event   | After change data emitted   |

## Usage

```js
import LuckySheet from "luckysheetVue";
```

```html
<lucky-sheet
  url=""
  show-info-bar
  backUrl="/"
  lang="en"
  @update="onUpdateData"
/>
```

## More information

[LuckySheet Documents](https://dream-num.github.io/LuckysheetDocs)
