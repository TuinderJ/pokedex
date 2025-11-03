const TOTAL_NUMBER_OF_POKEMONS = 151;
const TYPE_TO_COLOR = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

let hideCollectedCards = true;
const collected = [];

main();

function main() {
  document.getElementById('load-count').querySelector('span').textContent = TOTAL_NUMBER_OF_POKEMONS;
  loadPokemons();
  calculateRemaining();
  document.getElementById('search').addEventListener('keyup', reRenderCards);
  document.getElementById('show-hide-toggle-button').addEventListener('click', (_event) => {
    hideCollectedCards = !hideCollectedCards;
    reRenderCards();
  });
}

async function loadPokemons() {
  const pokemons = (await (await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_NUMBER_OF_POKEMONS}`)).json()).results;
  // console.log(pokemons);

  for (const index in pokemons) {
    let pokemon = pokemons[index];
    // console.log(pokemon);

    const container = document.getElementById('card-container');

    const card = await createCard(pokemon);
    card.dataset.collected = collected.includes(parseInt(index) + 1);
    if (collected.includes(parseInt(index) + 1)) hideCard(card);

    const searchTerm = document.getElementById('search').value.toLowerCase();
    if (searchTerm !== '') {
      if (!card.dataset.name.toLowerCase().includes(searchTerm)) card.style.display = 'none';
    }
    container.appendChild(card);
    const loadCounter = document.getElementById('load-count').querySelector('span');
    loadCounter.textContent = parseInt(loadCounter.textContent) - 1;
  }
  document.getElementById('load-count').remove();
}

async function createCard(pokemon) {
  const data = await (await fetch(pokemon.url)).json();
  // console.log(data);

  const card = document.createElement('div');
  card.dataset.id = data.id;
  card.dataset.name = pokemon.name;
  card.dataset.collected = 'false';
  card.className = 'card';

  card.addEventListener('click', (_event) => {
    if (collected.includes(card.dataset.id)) return;
    collected.push(card.dataset.id);
    card.dataset.collected = 'true';
    hideCard(card);
    calculateRemaining();
  });

  const header = document.createElement('header');
  card.appendChild(header);

  const pokemonName = document.createElement('h3');
  pokemonName.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.substr(1).toLowerCase();
  header.appendChild(pokemonName);

  const image = document.createElement('img');
  image.src = data.sprites.front_default;
  card.appendChild(image);

  const info = document.createElement('div');
  card.appendChild(info);

  const types = document.createElement('p');
  types.textContent = 'Types:';
  info.appendChild(types);

  const interval = Math.ceil(100 / data.types.length);
  console.log(interval);

  const ul = document.createElement('ul');
  info.appendChild(ul);

  let gradient = '';
  for (const index in data.types) {
    const li = document.createElement('li');
    li.textContent = data.types[index].type.name;
    ul.appendChild(li);

    if (index == 0) {
      gradient = `${TYPE_TO_COLOR[data.types[index].type.name]} ${interval * parseInt(index)}%`;
    } else if (index != data.types.length - 1) {
      gradient += `, ${TYPE_TO_COLOR[data.types[index].type.name]} ${interval * parseInt(index)}%`;
    } else {
      gradient += `, ${TYPE_TO_COLOR[data.types[index].type.name]} 100%`;
    }
  }

  console.log('gradient:', gradient);
  card.style.background = `linear-gradient(45deg, ${gradient})`;

  const footer = document.createElement('footer');
  card.appendChild(footer);

  const pokedexNumber = document.createElement('h4');
  pokedexNumber.textContent = '# ' + data.id;
  footer.appendChild(pokedexNumber);

  return card;
}

function calculateRemaining() {
  document.getElementById('collected-pokemons').textContent = collected.length;
  document.getElementById('remaining-pokemons').textContent = TOTAL_NUMBER_OF_POKEMONS - collected.length;
}

function hideCard(card) {
  card.classList.add('grey');
  if (hideCollectedCards) {
    card.style.display = 'none';
  }
}

function reRenderCards() {
  searchTerm = document.getElementById('search').value.toLowerCase();
  document.querySelectorAll('.card').forEach((card) => {
    card.style.display = 'flex';
    card.classList.remove('grey');

    if (searchTerm === '') {
      if (card.dataset.collected === 'true') {
        hideCollectedCards ? (card.style.display = 'none') : card.classList.add('grey');
      }
    } else {
      // console.log(`Checking ${searchTerm} in ${card.dataset.name}: ${card.dataset.name.toLowerCase().includes(searchTerm)}`);
      if (card.dataset.name.toLowerCase().includes(searchTerm)) {
        // console.log(`${card.dataset.name}: ${card.dataset.collected}`);
        if (card.dataset.collected === 'true') {
          hideCollectedCards ? (card.style.display = 'none') : card.classList.add('grey');
        }
      } else {
        card.style.display = 'none';
      }
    }
  });
}
