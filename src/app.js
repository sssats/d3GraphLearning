import _ from 'lodash';
import * as d3 from "d3";
import dataManager from './dataManager';
import configManager from './configManager';

var findMatchBtn = document.querySelector('#findMatch'),
    allHeroes;


findMatchBtn.addEventListener('click', function () {
    var matchId = document.querySelector('#matchId').value;
    dataManager.getMatchData(matchId).then(function (data) {
        //printData(renderHeroList(data.heroData));
        configManager.render(data.dataConfig, '#config');
        drawGraph(data.heroData, data.dataConfig)
    });
});

document.addEventListener('toggleBarVisibility', (ev) => {
    let details = ev.detail,
        bars = document.querySelectorAll('#graph .bar.' + details.type);

    _.forEach(bars, function (bar) {
        if (details.visibility) {
            bar.classList.remove('hide');
        } else {
            bar.classList.add('hide');
        }
    });

});

function printData(data) {
    document.querySelector('#resp').innerHTML = '';
    document.querySelector('#resp').appendChild(data);
}


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


function drawGraph(heroes, dataConfig, graphTypeId = 0) {
    if (graphTypeId == 0) {
        drawBarChart(heroes, dataConfig)
    }
}

function drawBarChart(heroes, dataConfig) {
    var graph = d3.select('#graph')
        .selectAll('div').data(heroes)
        .enter()
        .append('div').attr('class', function (hero) {
            return 'heroItem ' + hero.heroName.toLowerCase().replace(/\s/g, '');
        });

    graph.append('div')
        .classed('name', true)
        .text(function (hero) {
            return hero.heroName;
        })
        .append('img')
        .attr('src', function (hero) {
            return hero.heroIcon
        });


    graph.append('div')
        .classed('barWrapper', true)
        .each(function (hero) {
            var self = this;
            d3.map(hero).each(function (val, key) {
                d3.select(self).filter(function () {
                    return dataConfig[key].drawInChart
                }).append('div')
                    .attr('class', 'bar ' + key)
                    .style('width', (val * 100) / dataConfig[key].max + '%')
                    .append('p')
                    .text(dataConfig[key].displayName + '   ' + val);
            });
        });


}

