<?php 

/* Debug Vars
———————————————————————————————————————*/
$mode = 'debug';

?>
<!DOCTYPE html>
<html lang="en-gb">
	<head>
		<!-- title -->
		<title>Tappy</title>
		
		<!-- metas -->
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
		
		<!-- favicon -->
		<link rel="icon" type="image/png" href="static/images/favicon.ico"/>

		<!-- font imports -->
		<style type="text/css">
			@import url(https://fonts.googleapis.com/css?family=Arvo);
			@import url(https://fonts.googleapis.com/css?family=Oswald);
		</style>

		<!-- main css -->
		<link rel="stylesheet" href="static/main-<?php echo $mode; ?>.css" />
	</head>
	<body>
		<div id="loading-placeholder" class="spinner" data-bind="visible:loading, click:app.start">
			<div class="double-bounce1"></div>
			<div class="double-bounce2"></div>
		</div>

		<!-- ko if:component -->
		<div class="main" data-bind="component:{name:component,params:component_params}"></div>
		<!-- /ko -->

		<script src="static/bower_components/requirejs/require.js" data-main="static/main-<?php echo $mode; ?>"></script>
	</body>
</html>
