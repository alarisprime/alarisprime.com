const initOverlayContactForm = () => {
	document.addEventListener('turbolinks:load', () => {
		const overlayEl = document.querySelector('.overlay');

		const subject = overlayEl.querySelector('#contact-form-subject').value;
		const message = overlayEl.querySelector('#contact-form-message').value;

		const toggleOverlay = e => {
			e.preventDefault();

			const el = e.target;
			const overrideSubject = el.getAttribute('data-subject');
			const overrideMessage = el.getAttribute('data-message');

			if (overrideSubject) {
				overlayEl.querySelector('#contact-form-subject').value = overrideSubject
			} else {
				overlayEl.querySelector('#contact-form-subject').value = subject
			}

			if (overrideMessage) {
				overlayEl.querySelector('#contact-form-message').value = overrideMessage
			} else {
				overlayEl.querySelector('#contact-form-message').value = message
			}

			overlayEl.classList.toggle('overlay--open');
		};

		const triggerElements = document.querySelectorAll('.js-overlay-open, .js-overlay-close');

		triggerElements.forEach(el => {
			el.addEventListener('click', toggleOverlay, false);
		});
	});
};

export default initOverlayContactForm;
