'use strict';

var findMatchBtn = document.querySelector('#findMatch'),
	allHeroes,
	dataConfig;

dataConfig = {
	heroIcon: {
		displayName: 'Icon',
		drawInChart: false,
	},
	heroName: {
		displayName: 'Name',
		drawInChart: false,
	},
	lvl: {
		displayName: 'Level',
		drawInChart: true,
	},
	kills: {
		displayName: 'Kills',
		drawInChart: true,
	},
	deaths: {
		displayName: 'Deaths',
		drawInChart: true,
	},
	assists: {
		displayName: 'Assists',
		drawInChart: true,
	},
	gpm: {
		displayName: 'Gold per minute',
		drawInChart: true,
	},
	xpm: {
		displayName: 'Experience per minute',
		drawInChart: true,
	},
	lastHits: {
		displayName: 'Last hits',
		drawInChart: true,
	},
	denies: {
		displayName: 'Denies',
		drawInChart: true,
	},
	heroDamage: {
		displayName: 'Hero damage',
		drawInChart: true,
	},
	heal: {
		displayName: 'Heal done',
		drawInChart: true,
	},
	towerDamage: {
		displayName: 'Tower damage',
		drawInChart: true,
	},
	gold: {
		displayName: 'Gold earned',
		drawInChart: true,
	}
};

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
		drawGraph(heroes);
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
		var icon = hero.heroIcon,
			name = hero.heroName;

		allHeroes += `<li>
			<img src="${icon}" alt="${name}">
			<span>${name}</span>
		</li>`
	});

	template.innerHTML = `<ul>${allHeroes}</ul>`;

	return template;
}

// TODO: refactor data aggregation to {key: value} create dictionary for keys with display name and other options

function getHeroesFromMatch(matchData) {
	return _.map(matchData['players'], function(player) {
		var heroId = player['hero_id'];
		return {
			heroIcon: 'https://api.opendota.com' + _.find(allHeroes, {id: heroId})['icon'],
			heroName: _.find(allHeroes, {id: heroId})['localized_name'],
			lvl: player['level'],
			kills: player['kills'],
			deaths: player['deaths'],
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

function drawGraph(data, graphTypeId = 0) {
	if (graphTypeId == 0) {
		drawBarChart(data)
	}
}

function drawBarChart(heroes) {
	d3.select('#graph')
		.selectAll('div').data(heroes)
		.enter()
		.append('div').attr('class', 'bar')
		.text(function(hero) {
			return hero.heroName;
		})
		.each(function(hero) {
		/*	d3.select(self).selectAll('div').data(hero,function(d) {
				console.log(d)
				return d
			}).append('div');
			map.each(function() {
			})*/
		});

}