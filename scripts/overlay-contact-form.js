const disableDocumentScroll = () => {
	const scrollPosition = window.pageYOffset;
	document.documentElement.setAttribute('data-scroll', scrollPosition);

	// Might Need: document.documentElement.style.overflow = 'hidden';
	document.documentElement.style.position = 'fixed';
	document.documentElement.style.top = `-${scrollPosition}px`;
};

const enableDocumentScroll = () => {
	const scrollPosition = document.documentElement.getAttribute('data-scroll');
	document.documentElement.setAttribute('data-scroll', null);

	// Might Need: document.documentElement.style.overflow = '';
	document.documentElement.style.position = '';
	document.documentElement.style.top = '';

	if (scrollPosition) {
		window.scrollTo(0, parseInt(scrollPosition, 10));
	}
};

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
			const extraFieldGroup = el.getAttribute('data-extra-field-group');

			if (overrideSubject) {
				overlayEl.querySelector('#contact-form-subject').value = overrideSubject;
			} else {
				overlayEl.querySelector('#contact-form-subject').value = subject;
			}

			if (overrideMessage) {
				overlayEl.querySelector('#contact-form-message').value = overrideMessage;
			} else {
				overlayEl.querySelector('#contact-form-message').value = message;
			}

			if (extraFieldGroup) {
				overlayEl.querySelector(`.js-form-group-${extraFieldGroup}`).classList.remove('form__group--hidden');
			}

			const overlayActiveClass = 'overlay-open';
			if (document.body.classList.contains(overlayActiveClass)) {
				// Hide overlay
				document.body.classList.remove(overlayActiveClass);
				enableDocumentScroll();
			} else {
				// Show overlay
				disableDocumentScroll();
				document.body.classList.add(overlayActiveClass);
			}
		};

		const triggerElements = document.querySelectorAll('.js-overlay-open, .js-overlay-close');

		triggerElements.forEach(el => {
			el.addEventListener('click', toggleOverlay, false);
		});
	});
};

export default initOverlayContactForm;
