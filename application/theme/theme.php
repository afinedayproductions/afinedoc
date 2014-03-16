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
		
	</head>

	<body>

		<div id="loading-screen">
			<div class="loader"></div>
		</div>
		<!-- en #loading-screen -->

		<header>

			<h1><?php echo anchor('', 'Afinedoc<sup>alpha</sup>'); ?></h1>
			<h2>Don't forget the *.</h2>

			<menu>
				<ul>
					<li>
						<input type="radio" name="technologies" value="angularjs" id="angularjs">
						<label for="angularjs">AngularJS</label>
					</li>
					<li>
						<input type="radio" name="technologies" value="css" id="css">
						<label for="css">CSS</label>
					</li>
					<li>
						<input type="radio" name="technologies" value="js" id="js">
						<label for="js">JavaScript</label>
					</li>
					<!--
					<li>
						<input type="radio" name="technologies" value="nodejs" id="nodejs">
						<label for="nodejs">NodeJS</label>
					</li>
					-->
					<li>
						<input type="radio" name="technologies" value="php" id="php">
						<label for="php">PHP</label>
					</li>
				</ul>
			</menu>

			<div id="input-label">
				<input id="search" name="search" type="text" placeholder="Your search: array, *, …" required>
				<label for="search">Your search</label>
			</div>
			<!-- end #input-label -->

		</header>
		<!-- end header -->

		<div id="content">
			<?php echo $output ; ?>
		</div>

		<footer>
			<p>
				©2014+ <?php echo anchor('', 'Afinedoc.com'); ?> 
				<br>
				By par <?php echo anchor('http://www.afinedayproductions.fr', 'F.Mathis — afinedayproductions', array('title' => 'www.afinedayproductions.fr — F.Mathis', 'target' => '_blank')); ?>
			</p>
		</footer>
		<!-- end footer -->
		
		<!-- JAVASCRIPT -->
		<script src="<?php echo js_url('showdown'); ?>"></script>
		<script src="<?php echo js_url('master'); ?>"></script>

		<?php foreach($js as $url): ?>

		    <script src="<?php echo $url; ?>"></script>

		<?php endforeach; ?>

	</body>
</html>