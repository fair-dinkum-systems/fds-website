// add classes for mobile navigation toggling
var CSbody = document.querySelector('body');
const CSnavbarMenu = document.querySelector('#navigation');
const CShamburgerMenu = document.querySelector('#navigation .toggle');

CShamburgerMenu.addEventListener('click', function () {
	CShamburgerMenu.classList.toggle('active');
	CSnavbarMenu.classList.toggle('active');
	CSbody.classList.toggle('open');
	// run the function to check the aria-expanded value
	ariaExpanded();
});

// checks the value of aria expanded on the ul and changes it accordingly whether it is expanded or not
function ariaExpanded() {
	const csUL = document.querySelector('#expanded');
	const csExpanded = csUL.getAttribute('aria-expanded');

	if (csExpanded === 'false') {
		csUL.setAttribute('aria-expanded', 'true');
	} else {
		csUL.setAttribute('aria-expanded', 'false');
	}
}

// mobile nav toggle code
const dropDowns = Array.from(document.querySelectorAll('#navigation .dropdown'));
for (const item of dropDowns) {
	const onClick = () => {
		item.classList.toggle('active');
	};
	item.addEventListener('click', onClick);
}
                                