<!doctype html>
<html lang="fr">

	<head>
		
		<!-- TITLE -->
		<title><?php echo $second_part_title . $title; ?></title>

		<!-- META --> 
	    <meta http-equiv="Content-Type" content="text/html; charset=<?php echo $charset; ?>" >

	    <!-- CSS -->
		<link rel="stylesheet" href="<?php echo css_url('style'); ?>">
		<?php foreach($css as $url): ?>
		    <link rel="stylesheet" type="text/css" media="screen" href="<?php echo $url; ?>" >
		<?php endforeach; ?>

		<script src="<?php echo js_url('master'); ?>"></script>

	</head>

	<body>

		<header>

			<h1>Afinedoc</h1>
			<h2>No punchline.</h2>

			<div id="input-label">
				<input id="search" name="search" type="search" placeholder="Your search…" required>
				<label for="search">Your search</label>
			</div>

		</header>
		<!-- end header -->

		<div id="content">
			<?php echo $output ; ?>
		</div>
		
		<!-- JAVASCRIPT -->
		<?php foreach($js as $url): ?>
		    <script type="text/javascript" src="<?php echo $url; ?>"></script>
		<?php endforeach; ?>

	</body>
</html>