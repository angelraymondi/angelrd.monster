<script lang="ts">
	import '#/index.scss';
	import { browser } from '$app/environment';
	import { writable } from 'svelte/store';

	type Dialogs = 'isShareDialogOpen' | 'isSendDialogOpen';

	class Cooldown {
		private timeout: number | null = null;
		isActive = () => (this.timeout ? true : false);
		time = 0;

		constructor(time: number) {
			this.time = time;
		}

		checkntoggle() {
			const wasActive = this.isActive();

			if (!wasActive) {
				this.timeout = setTimeout(() => {
					this.timeout = null;
				}, this.time);
			}

			return wasActive;
		}
	}

	let isPictureFlipped = $state(false);
	let theme = writable(
		browser && ['Light', 'Dark'].includes(window.localStorage.getItem('theme') || '')
			? (window.localStorage.getItem('theme') as string)
			: 'Light'
	);
	let openDialogs: { [key in Dialogs]: boolean } = $state({
		isShareDialogOpen: false,
		isSendDialogOpen: false
	});
	// let isShareDialogOpen = $state(false);
	// let isSendDialogOpen = $state(false);
	let shareWithQR = $state(false);
	let shareURL = $derived(
		shareWithQR ? 'https://angelrd.monster/#qrcode' : 'https://angelrd.monster/'
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

	const flipPictureCooldown = new Cooldown(500);
	function flipPicture() {
		if (flipPictureCooldown.checkntoggle()) return;

		isPictureFlipped = !isPictureFlipped;

		if (browser) {
			window.location.hash = isPictureFlipped ? '#qrcode' : '';
		}
	}

	const toggleThemeCooldown = new Cooldown(500);
	function toggleTheme() {
		if (toggleThemeCooldown.checkntoggle()) return;

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

	function copyShareURL() {
		if (!browser) return;

		navigator.clipboard
			.writeText(shareURL)
			.then(() => {
				document.querySelector('.container-alert > .container > div > p')?.animate(
					[
						{
							opacity: 0
						},
						{
							opacity: 1
						}
					],
					{
						duration: 300,
						iterations: 1,
						easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
						fill: 'forwards'
					}
				);
			})
			.catch(() => {
				alert('ERROR');
			});
	}
	function shareQRChange() {
		document.querySelector('.container-alert > .container > div > p')?.animate(
			[
				{
					opacity: 0
				}
			],
			{
				duration: 200,
				iterations: 1,
				easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
				fill: 'forwards'
			}
		);
	}

	function closeAlert(key: Dialogs) {
		if (!browser) return;
		const container = document.querySelector(`.container-alert[data-alert="${key}"]`);
		if (container === null) return;

		if (container.getAnimations().length) return;

		container
			.animate(
				[
					{
						opacity: 1
					},
					{
						opacity: 0
					}
				],
				{
					easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
					duration: 300
				}
			)
			.finished.then(() => {
				openDialogs[key] = false;
			});
	}

	if (browser) {
		document.querySelectorAll('.container-alert').forEach((al) => {
			al.addEventListener('click', (e) => {
				if (e.target !== al) return;
				closeAlert(al.getAttribute('data-alert') as Dialogs);
			});
		});
	}
</script>

<svelte:head>
	<title>Angel Raymondi</title>
</svelte:head>

<div
	class={['container-alert', openDialogs.isShareDialogOpen ? 'open' : undefined]}
	data-alert="isShareDialogOpen"
>
	<div class="container">
		<button class="close" aria-label="Close" onclick={() => closeAlert('isShareDialogOpen')}
		></button>
		<h1>Compartir perfil</h1>
		<div>
			<input type="text" value={shareURL} disabled autocomplete="off" />
			<p style="opacity: 0;">Copiado!</p>
		</div>
		<label class="check">
			<input
				type="checkbox"
				name="share_qr"
				id="share_qr"
				bind:checked={shareWithQR}
				onchange={shareQRChange}
			/>
			<span class="checkmark"></span>
			<span>Compartir con QR</span>
		</label>
		<div class="button-group">
			<button onclick={copyShareURL}>Copiar</button>
		</div>
	</div>
</div>
<div
	class={['container-alert', openDialogs.isSendDialogOpen ? 'open' : undefined]}
	data-alert="isSendDialogOpen"
>
	<div class="container">
		<button class="close" aria-label="Close" onclick={() => closeAlert('isSendDialogOpen')}
		></button>
		<h1>Enviar dinero</h1>
		<div style="display: flex; align-items: center; gap: 5px">
			<i class="icon paypal-icon"></i>
			<a href="https://paypal.me/angelraymondi" target="_blank">paypal.me/angelraymondi</a>
		</div>
	</div>
</div>

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
			<button
				onpointerdown={() => {
					openDialogs.isShareDialogOpen = !openDialogs.isShareDialogOpen;
				}}>Compartir</button
			>
			<button
				onpointerdown={() => {
					openDialogs.isSendDialogOpen = !openDialogs.isSendDialogOpen;
				}}>Enviar dinero</button
			>
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
