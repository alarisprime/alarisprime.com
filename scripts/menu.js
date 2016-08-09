document.addEventListener('turbolinks:load', function () {
	const toggleEl = document.querySelectorAll('.js-nav-dropdown-toggle')[0];
	const menuEl = document.querySelectorAll('.js-main-nav')[0];

	const openMenu = () => menuEl.classList.add('main-nav--open');
	const closeMenu = () => menuEl.classList.remove('main-nav--open');

	if (toggleEl && menuEl) {
		toggleEl.addEventListener('click', e => {
			e.stopPropagation();
			if (menuEl.classList.contains('main-nav--open')) {
				closeMenu();
			} else {
				openMenu();
			}
		});

		document.addEventListener('click', () => {
			if (menuEl.classList.contains('main-nav--open')) {
				closeMenu();
			}
		});
	}
});
