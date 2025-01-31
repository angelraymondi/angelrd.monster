<script lang="ts">
	import '#/index.scss';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';

	let isPictureFlipped = $state(false);
	let theme = writable(
		browser && ['Light', 'Dark'].includes(window.localStorage.getItem('theme') || '')
			? window.localStorage.getItem('theme') as string
			: 'Light'
	);

	const socialMedia = [
		{
			name: 'GitHub',
			href: 'https://github.com/angelraymondi'
		},
		{
			name: 'Twitch',
			href: 'https://twitch.tv/angelraymondi'
		},
		{
			name: 'Instagram',
			href: 'https://instagram.com/angelraymondii'
		},
		{
			name: 'YouTube',
			href: 'https://youtube.com/@angelraymondi'
		}
	];

	function flipPicture() {
		isPictureFlipped = !isPictureFlipped;

		if (browser) {
			window.location.hash = isPictureFlipped ? '#qrcode' : '';
		}
	}

	function toggleTheme() {
		theme.update((t) => (t === 'Light' ? 'Dark' : 'Light'));
	}

	if (browser) {
		theme.subscribe((theme) => {
			window.localStorage.setItem('theme', theme);
			document.body.classList.toggle('light', theme !== 'Dark');
			document.body.classList.toggle('dark', theme === 'Dark');

			const toggleThemeButton = document.querySelector(
				'main > section > .controls > button[aria-label="Toggle theme"]'
			);
			toggleThemeButton?.classList.toggle('active', theme === 'Dark');

			toggleThemeButton?.firstElementChild?.classList.toggle('light-icon', theme !== 'Dark');
			toggleThemeButton?.firstElementChild?.classList.toggle('dark-icon', theme === 'Dark');
		});
	}

	if (browser && window.location.hash === '#qrcode') {
		isPictureFlipped = true;
	}
</script>

<svelte:head>
	<title>Angel Raymondi</title>
</svelte:head>

<main>
	<section>
		<div class="controls">
			<button
				aria-label="QR code"
				onclick={flipPicture}
				class={[isPictureFlipped ? 'active' : undefined]}><i class="icon qrcode-icon"></i></button
			>
			<button aria-label="Toggle theme" onclick={toggleTheme}
				><i class="icon light-icon"></i></button
			>
		</div>
		<div class={['picture', isPictureFlipped ? 'flip' : undefined]}>
			<div class="qr"></div>
		</div>
		<h1>Angel Raymondi</h1>
		<ul class="info">
			<li>Angel</li>
			<li>·</li>
			<li>Él/He/Him</li>
			<li>·</li>
			<li>Lima, Perú</li>
		</ul>
		<ul class="social-media">
			<li>—</li>
			{#each socialMedia as social (social.name)}
				<li>
					<a href={social.href} aria-label={social.name}
						><i class={['icon', `${social.name.toLowerCase()}-icon`]}></i></a
					>
				</li>
			{/each}
		</ul>
		<div class="button-group">
			<button>Compartir</button>
			<button>Enviar dinero</button>
		</div>
	</section>
	<section>
		<h1>Cuentas verificadas</h1>
		{#each socialMedia as social (social.name)}
			<div>
				<header>
					<i class={['icon', `${social.name.toLowerCase()}-icon`]}></i><span>{social.name}</span>
				</header>
				<a href={social.href} target="_blank">{social.href.replace('https://', '')}</a>
			</div>
		{/each}
	</section>
</main>
