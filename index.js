
const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');


const apiURL = 'https://api.lyrics.ovh';


async function searchSongs(term) {
	const response = await fetch(`${apiURL}/suggest/${term}`);
	const data = await response.json();
	displayData(data);
}


function displayData(data) {
	const searchValue = search.value;
	result.innerHTML = `
		<p class="search-heading">Your search results for "<span class="search-value">${searchValue}</span>"</p>
		<ul class="songs">
			${data.data.map(song => `
				<li>
					<span><span class="song-artist">${song.artist.name}</span>- ${song.title}</span>
					<button class="btn lyrics-btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Lyrics</button>
				</li>`
			)
			.join('')}
		</ul>
	`;
	
	
	if (data.prev || data.next) {
		more.innerHTML = `
			${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')"><i class="fas fa-chevron-circle-left fa-3x"></i>

            </button>` : ''}
			${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')"><i class="fas fa-chevron-circle-right fa-3x"></i>

            </button>` : ''}
		`;
	}
	else {
		more.innerHTML = '';
	}
}


async function getMoreSongs(url) {

	const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
	const data = await response.json();  
	displayData(data); 
}  


async function getLyrics(artist, songTitle) {
	const response = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
	const data = await response.json();

	if (data.error) {
		result.innerHTML = data.error;
	}
	else {
		const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
		result.innerHTML = `
			<h2><span class="song-artist">${artist}</span> - ${songTitle}</h2>
			<span class="song-lyrics">${lyrics}</span>
		`;
	}

	more.innerHTML = '';

	search.value = '';
}  


form.addEventListener('submit', e => {
	e.preventDefault(); 

	const searchTerm = search.value.trim();
	searchSongs(searchTerm);
});

result.addEventListener('click', e => {
	const clickedBtn = e.target;

	if (clickedBtn.tagName === 'BUTTON') {
		const artist = clickedBtn.getAttribute('data-artist');
		const songTitle = clickedBtn.getAttribute('data-songtitle');

		getLyrics(artist, songTitle);
	}	
});
