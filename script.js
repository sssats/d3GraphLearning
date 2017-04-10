'use strict';

var findMatchBtn = document.querySelector('#findMatch'),
	allHeroes;

getHeroes();

findMatchBtn.addEventListener('click', function() {
	var matchId = document.querySelector('#matchId').value;

	if (!allHeroes) {
		getHeroes();
	}

	fetch('https://api.opendota.com/api/matches/' + matchId).then(function(resp) {
		return resp.json();
	}).then(function(data) {
		var heroes = getHeroesFromMatch(data),
			heroesTemplate = renderHeroList(heroes);

		printData(heroesTemplate);
	});
});

function printData(data) {
	document.querySelector('#resp').innerHTML = '';
	document.querySelector('#resp').appendChild(data);

}

function getHeroes() {
	if (localStorage.getItem('heroes')) {
		allHeroes = JSON.parse(localStorage.getItem('heroes'))
	}
	else {
		fetch('https://api.opendota.com/api/heroStats').then(function(resp) {
			return resp.json();
		}).then(function(heroes) {
			allHeroes = heroes;
			localStorage.setItem('heroes', JSON.stringify(heroes));
		})
	}
};

function renderHeroList(heroes) {
	var template = document.createElement('article'),
		allHeroes = ``;
	template.setAttribute('class', 'heroList');
	_.forEach(heroes, function(hero) {
		allHeroes += `<li>
			<img src="${hero.heroImage}" alt="${hero.heroName}">
			<span>${hero.heroName}</span>
		</li>`
	});

	template.innerHTML = `<ul>${allHeroes}</ul>`;

	return template;
}

function getHeroesFromMatch(matchData) {
	return _.map(matchData['players'], function(player) {
		var heroId = player['hero_id'];
		return {
			heroId: heroId,
			heroImage: 'https://api.opendota.com' + _.find(allHeroes, {id: heroId})['icon'],
			heroName: _.find(allHeroes, {id: heroId})['localized_name'],
			lvl: player['level'],
			kills: player['kills'],
			death: player['deaths'],
			assists: player['assists'],
			gpm: player['gold_per_min'],
			xpm: player['xp_per_min'],
			lastHits: player['last_hits'],
			denies: player['denies'],
			heroDamage: player['hero_damage'],
			heal: player['hero_healing'],
			towerDamage: player['tower_damage'],
			gold: player['gold']
		}
	})
}