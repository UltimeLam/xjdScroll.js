# xjdScroll

> xjdScroll.js demo

## Build Setup

```bash
# install dependencies
$ npm install
or
$ yarn install

# install tsc
$ npm install -g typescript

# build for production
$ npm run build
or
$ yarn run build
```

## Using nuxt.js programmatically

```javascript
// index.html

<!DOCTYPE html>
<html>

<head>
	<meta charset="utf-8" />
	<link rel="stylesheet" type="text/css" href="css/index.min.css" />
	<title></title>
</head>

<body>
	<div id="myScroll" class="myScroll__bar">
		<div class="myScroll__wrapper">
			<div class="myScroll__content">
				<!-- Content -->
			</div>
		</div>
	</div>
</body>

<script src="js/index.min.js" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript" charset="utf-8">
// xjdScroll(id, options)

var newScroll = new xjdScroll('myScroll')

// or

var newScroll = new xjdScroll('myScroll',{
  height: '600px',
  width: '600px'
})

</script>
```

## Options

| Name   | Description | Type   | Default |
| ------ | ----------- | ------ | ------- |
| width  | -           | string | "100%"  |
| height | -           | string | "100%"  |

## Methods

| Name    | Description                                        | Parameters | Return |
| ------- | -------------------------------------------------- | ---------- | ------ |
| refresh | Refresh the scrollbar when the plugin size changes | -          | -      |
