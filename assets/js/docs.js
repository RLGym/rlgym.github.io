
const docs = [
	{
		id: 'introduction',
		files: [
			'docs/introduction/introduction.md',
		]
	},
	{
		id: 'getting-started',
		files: [
			'docs/getting-started/getting_started.md',
		]
	},
	{
		id: 'documentation',
		files: [
			'docs/documentation/placeholder.md',
		]
	},
	{
		id: 'tutorials',
		files: [
			'docs/tutorials/introduction_to_configuration_objects.md',
			'docs/tutorials/reward_functions.md',
			'docs/tutorials/observation_builders.md',
			'docs/tutorials/terminal_conditions.md',
			'docs/tutorials/self_play.md',
		]
	},
	{
		id: 'tools',
		files: [
			'docs/tools/introduction_to_rlgym_tools.md',
		    'docs/tools/sb3_single_env_wrapper.md',
		    'docs/tools/sb3_multi_env_wrapper.md',
		    'docs/tools/reward_functions.md',
		    'docs/tools/observation_builders.md',
		]
	},
	{
		id: 'faq',
		files: [
			'docs/faq/faq.md',
		]
	},
	{
		id: 'troubleshooting',
		files: [
			'docs/troubleshooting/troubleshooting.md',
		]
	}
]

function loadFileAsync(path, container) {
	return fetch(path)
		.then(response => response.text())
		.then(data => container.innerHTML = marked(data));
}

function loadFileMock(path, container) {
	container.innerHTML = marked('## Marked in browser\n\n'+path+'\n\nRendered by **marked**.\n\n## Header 2\n\nconteeeent');
	return Promise.resolve();
}

function generateSectionNav(article) {
	let lastNav = document.querySelector('a[href="#'+ article.id +'"]').parentElement;

	for (let header of article.getElementsByTagName('h2')) {
		header.className = 'section-heading';

		lastNav.insertAdjacentHTML('afterend',
			'<li class="nav-item"><a class="nav-link scrollto" href="#'+ header.id +'">'+ header.innerText +'</a></li>');
		lastNav = lastNav.nextElementSibling;
	}
}

function loadDocsAsync() {
	const articlePromises = [];
	for (let article of docs) {
		const articleElement = document.getElementById(article.id);
		const articleContent = [];
		article.files.forEach(file => {
			const container = document.createElement('section');
			container.className = 'docs-section';
			articleElement.appendChild(container);
			articleContent.push(loadFileAsync(file, container));
		})
		articlePromises.push(Promise.all(articleContent).then(() => generateSectionNav(articleElement)));
	}
	return Promise.all(articlePromises);
}

$(window).on('load resize', function() {
   
    //Add/remove class based on browser size when load/resize
    var w = $(window).width();

	if(w >= 1200) {
	    // if larger 
	    $('#docs-sidebar').addClass('sidebar-visible').removeClass('sidebar-hidden');
	} else {
	    // if smaller
	    $('#docs-sidebar').addClass('sidebar-hidden').removeClass('sidebar-visible');
	}
});


$(document).ready(function() {
	
	/* ====== Toggle Sidebar ======= */
	
	$('#docs-sidebar-toggler').on('click', function(){
	
		if ( $('#docs-sidebar').hasClass('sidebar-visible') ) {

			  $("#docs-sidebar").removeClass('sidebar-visible').addClass('sidebar-hidden');
			
			
		} else {

			  $("#docs-sidebar").removeClass('sidebar-hidden').addClass('sidebar-visible');
			
		}
			
    });
	
	
	/* Bootstrap lightbox */
    /* Ref: http://ashleydw.github.io/lightbox/ */

    $(document).delegate('*[data-toggle="lightbox"]', 'click', function(e) {
        e.preventDefault();
        $(this).ekkoLightbox();
    });


	loadDocsAsync()
		.then(() => Prism.highlightAll())
		.then(() => {
			/* ====== Activate scrollspy menu ===== */
			$('body').scrollspy({target: '#docs-nav', offset: 100});



			/* ===== Smooth scrolling ====== */
			$('#docs-sidebar a.scrollto').on('click', function(e){
				//store hash
				var target = this.hash;
				e.preventDefault();
				$('body').scrollTo(target, 800, {offset: -69, 'axis':'y'});

				//Collapse sidebar after clicking
				if ($('#docs-sidebar').hasClass('sidebar-visible') && $(window).width() < 1200){
					$('#docs-sidebar').removeClass('sidebar-visible').addClass('slidebar-hidden');
				}

			});

			/* smooth scrolling on page load if URL has a hash */
			if(window.location.hash) {
				var urlhash = window.location.hash;
				$('body').scrollTo(urlhash, 800, {offset: -69, 'axis':'y'});
			}
	});

});
