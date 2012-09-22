
<!doctype html>
<html lang="en">
	<head>
		<title>three.js canvas - materials - video</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
		<style>
			body {
				font-family: Monospace;
				background-color: #f0f0f0;
				margin: 0px;
				overflow: hidden;
			}
		</style>
	</head>
	<body>

		<script src="../build/Three.js"></script>

		<script src="js/Stats.js"></script>

		<video id="video" autoplay style="display:none">
			<source src="textures/sintel.mp4" type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'>
			<source src="textures/sintel.ogv" type='video/ogg; codecs="theora, vorbis"'>
		</video>

		<script>

			var AMOUNT = 100;

			var container, stats;

			var camera, scene, renderer;

			var video, image, imageContext,
			imageReflection, imageReflectionContext, imageReflectionGradient,
			texture, textureReflection;

			var mesh;

			var mouseX = 0;
			var mouseY = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;

			init();
			animate();

			function init() {

				container = document.createElement( 'div' );
				document.body.appendChild( container );

				var info = document.createElement( 'div' );
				info.style.position = 'absolute';
				info.style.top = '10px';
				info.style.width = '100%';
				info.style.textAlign = 'center';
				info.innerHTML = '<a href="http://github.com/mrdoob/three.js" target="_blank">three.js</a> - video demo. playing <a href="http://durian.blender.org/" target="_blank">sintel</a> trailer';
				container.appendChild( info );

				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
				camera.position.z = 1000;

				scene = new THREE.Scene();

				scene.add( camera );

				video = document.getElementById( 'video' );

				//

				image = document.createElement( 'canvas' );
				image.width = 480;
				image.height = 204;

				imageContext = image.getContext( '2d' );
				imageContext.fillStyle = '#000000';
				imageContext.fillRect( 0, 0, 480, 204 );

				texture = new THREE.Texture( image );
				texture.minFilter = THREE.LinearFilter;
				texture.magFilter = THREE.LinearFilter;

				var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: true } );

				imageReflection = document.createElement( 'canvas' );
				imageReflection.width = 480;
				imageReflection.height = 204;

				imageReflectionContext = imageReflection.getContext( '2d' );
				imageReflectionContext.fillStyle = '#000000';
				imageReflectionContext.fillRect( 0, 0, 480, 204 );

				imageReflectionGradient = imageReflectionContext.createLinearGradient( 0, 0, 0, 204 );
				imageReflectionGradient.addColorStop( 0.2, 'rgba(240, 240, 240, 1)' );
				imageReflectionGradient.addColorStop( 1, 'rgba(240, 240, 240, 0.8)' );

				textureReflection = new THREE.Texture( imageReflection );
				textureReflection.minFilter = THREE.LinearFilter;
				textureReflection.magFilter = THREE.LinearFilter;

				var materialReflection = new THREE.MeshBasicMaterial( { map: textureReflection, overdraw: true } );

				//

				var plane = new THREE.PlaneGeometry( 480, 204, 4, 4 );

				mesh = new THREE.Mesh( plane, material );
				mesh.rotation.x = Math.PI / 2;
				mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.5;
				scene.add(mesh);

				mesh = new THREE.Mesh( plane, materialReflection );
				mesh.position.y = -306;
				mesh.rotation.x = - Math.PI / 2;
				mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.5;
				mesh.doubleSided = true;
				scene.add( mesh );

				//

				var separation = 150;
				var amountx = 10;
				var amounty = 10;

				var PI2 = Math.PI * 2;
				var material = new THREE.ParticleCanvasMaterial( {

					color: 0x0808080,
					program: function ( context ) {

						context.beginPath();
						context.arc( 0, 0, 1, 0, PI2, true );
						context.closePath();
						context.fill();

					}

				} );

				for ( var ix = 0; ix < amountx; ix++ ) {

					for ( var iy = 0; iy < amounty; iy++ ) {

						particle = new THREE.Particle( material );
						particle.position.x = ix * separation - ( ( amountx * separation ) / 2 );
						particle.position.y = -153
						particle.position.z = iy * separation - ( ( amounty * separation ) / 2 );
						scene.add( particle );

					}
				}

				renderer = new THREE.CanvasRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight );

				container.appendChild( renderer.domElement );

				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				container.appendChild( stats.domElement );

				document.addEventListener( 'mousemove', onDocumentMouseMove, false );

			}

			function onDocumentMouseMove(event) {

				mouseX = ( event.clientX - windowHalfX );
				mouseY = ( event.clientY - windowHalfY ) * 0.2;

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();
				stats.update();

			}

			function render() {

				camera.position.x += ( mouseX - camera.position.x ) * 0.05;
				camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
				camera.lookAt( scene.position );

				if ( video.readyState === video.HAVE_ENOUGH_DATA ) {

					imageContext.drawImage( video, 0, 0 );

					if ( texture ) texture.needsUpdate = true;
					if ( textureReflection ) textureReflection.needsUpdate = true;

				}

				imageReflectionContext.drawImage( image, 0, 0 );
				imageReflectionContext.fillStyle = imageReflectionGradient;
				imageReflectionContext.fillRect( 0, 0, 480, 204 );

				renderer.render( scene, camera );

			}


		</script>

	</body>
</html>
