'use strict';

var findMatchBtn = document.querySelector('#findMatch'),
    allHeroes;

getHeroes();

findMatchBtn.addEventListener('click', function () {
    var matchId = document.querySelector('#matchId').value;

    if (!allHeroes) {
        getHeroes();
    }

    fetch('https://api.opendota.com/api/matches/' + matchId).then(function (resp) {
        return resp.json();
    }).then(function (data) {
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
        fetch('https://api.opendota.com/api/heroStats').then(function (resp) {
            return resp.json();
        }).then(function (heroes) {
            allHeroes = heroes;
            localStorage.setItem('heroes', JSON.stringify(heroes));
        })
    }
};

function renderHeroList(heroes) {
    var template = document.createElement('article'),
        allHeroes = ``;
    template.setAttribute('class', 'heroList');
    _.forEach(heroes, function (hero) {
        var icon = _.find(hero, {id: 'heroIcon'}).value,
            name = _.find(hero, {id: 'heroName'}).value;

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
    return _.map(matchData['players'], function (player) {
        var heroId = player['hero_id'];
        return [
            {
                id: 'heroIcon',
                displayName: 'Icon',
                drawInChart: false,
                value: 'https://api.opendota.com' + _.find(allHeroes, {id: heroId})['icon']
            },
            {
                id: 'heroName',
                displayName: 'Name',
                drawInChart: false,
                value: _.find(allHeroes, {id: heroId})['localized_name']
            },
            {
                id: 'lvl',
                displayName: 'Level',
                drawInChart: true,
                value: player['level']
            },
            {
                id: 'kills',
                displayName: 'Kills',
                drawInChart: true,
                value: player['kills']
            },
            {
                id: 'death',
                displayName: 'Death',
                drawInChart: true,
                value: player['death']
            },
            {
                id: 'assists',
                displayName: 'Assists',
                drawInChart: true,
                value: player['assists']
            },
            {
                id: 'gpm',
                displayName: 'Gold per minute',
                drawInChart: true,
                value: player['gold_per_min']
            },
            {
                id: 'xpm',
                displayName: 'Experience per minute',
                drawInChart: true,
                value: player['xp_per_min']
            },
            {
                id: 'lastHits',
                displayName: 'Last hits',
                drawInChart: true,
                value: player['last_hits']
            },
            {
                id: 'denies',
                displayName: 'Denies',
                drawInChart: true,
                value: player['denies']
            },
            {
                id: 'heroDamage',
                displayName: 'Hero damage',
                drawInChart: true,
                value: player['heroDamage']
            },
            {
                id: 'heal',
                displayName: 'Heal done',
                drawInChart: true,
                value: player['hero_healing']
            },
            {
                id: 'towerDamage',
                displayName: 'Tower damage',
                drawInChart: true,
                value: player['towerDamage']
            },
            {
                id: 'gold',
                displayName: 'Gold earned',
                drawInChart: true,
                value: player['gold']
            }
        ]
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
        .text(function (hero) {
            return _.find(hero, {id: 'heroName'}).value;
        })
        .each(function (hero) {
            d3.select(this).selectAll('div').data(hero)
                .enter()
                .filter(function (stat) {
                    return stat.drawInChart
                })
                .append('div')
                .style(
                    'width', function (stat) {
                        return stat.value * 10 + 'px';
                    })
                .style('background', 'yellow')
                .text(function (stat) {
                    return stat.displayName + '  ' + stat.value
                });
        });

}