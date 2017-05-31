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
        values: []
    },
    kills: {
        displayName: 'Kills',
        drawInChart: true,
        values: []
    },
    deaths: {
        displayName: 'Deaths',
        drawInChart: true,
        values: []
    },
    assists: {
        displayName: 'Assists',
        drawInChart: true,
        values: []
    },
    gpm: {
        displayName: 'Gold per minute',
        drawInChart: true,
        values: []
    },
    xpm: {
        displayName: 'Experience per minute',
        drawInChart: true,
        values: []
    },
    lastHits: {
        displayName: 'Last hits',
        drawInChart: true,
        values: []
    },
    denies: {
        displayName: 'Denies',
        drawInChart: true,
        values: []
    },
    heroDamage: {
        displayName: 'Hero damage',
        drawInChart: true,
        values: []
    },
    heal: {
        displayName: 'Heal done',
        drawInChart: true,
        values: []
    },
    towerDamage: {
        displayName: 'Tower damage',
        drawInChart: true,
        values: []
    },
    gold: {
        displayName: 'Gold earned',
        drawInChart: true,
        values: []
    }
};

getHeroes();

findMatchBtn.addEventListener('click', function () {
    var matchId = document.querySelector('#matchId').value;

    if (!allHeroes) {
        getHeroes();
    }

    fetch('https://api.opendota.com/api/matches/' + matchId).then(function (resp) {
        return resp.json();
    }).then(function (data) {
        var heroes = prepareData(data),
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

function prepareData(matchData) {
    var maxValues = [],
        mappedInfo;

    mappedInfo = _.map(matchData['players'], function (player) {
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
    });
    _.forIn(mappedInfo, function (hero) {
        _.forIn(hero, function (val, key) {
            if (dataConfig[key].drawInChart) {
                dataConfig[key].values.push(val);
            }
        })
    });

    _.forIn(dataConfig, function (val, key) {
        if (dataConfig[key].drawInChart) {
            dataConfig[key].min = _.min(dataConfig[key].values);
            dataConfig[key].max = _.max(dataConfig[key].values);
        }
    });

    return mappedInfo;
}

function drawGraph(data, graphTypeId = 0) {
    if (graphTypeId == 0) {
        drawBarChart(data)
    }
}

function drawBarChart(heroes) {
    var grapg = d3.select('#graph')
        .selectAll('div').data(heroes)
        .enter()
        .append('div').attr('class', 'bar');

    graph.append('div')
        .classed('name', true)
        .text(function (hero) {
            return hero.heroName;
        });

    grapg.each(function (hero) {
        var self = this;
        d3.map(hero).each(function (val, key) {
            d3.select(self).filter(function () {
                return dataConfig[key].drawInChart
            }).append('div')
                .style('height', (val * 100) / dataConfig[key].max + '%')
                .style('background-color', function (d, i) {
                    debugger;
                    return 'hsl(240,50%,' + (100 - d / 2) + '%)';
                })
                .append('p')
                .text(dataConfig[key].displayName + '   ' + val);
        });
    });




}