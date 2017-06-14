import _ from 'lodash';
import * as d3 from "d3";
import dataManager from './dataManager';
import configurationController from './configurationController';

var findMatchBtn = document.querySelector('#findMatch');

findMatchBtn.addEventListener('click', function () {
    var matchId = document.querySelector('#matchId').value;
    dataManager.getMatchData(matchId).then(function (data) {
        if (!document.querySelector('#config ul.stats')) {
            configurationController.renderStatOption(data.dataConfig, '#config');
        }
        if (!document.querySelector('#config ul.heroes')) {
            configurationController.renderHeroList(data.heroData, '#config');
        }
        drawGraph(data.heroData, data.dataConfig)
    });
});

document.addEventListener('toggleBarVisibility', (ev) => {
    let details = ev.detail,
        bars = document.querySelectorAll('.' + details.type);

    _.forEach(bars, function (bar) {
        if (details.visibility) {
            bar.classList.remove('hide');
        } else {
            bar.classList.add('hide');
        }
    });
});

document.addEventListener('toggleHeroVisibility', (ev) => {
    let details = ev.detail,
        heroItem = document.querySelectorAll('#graph .heroItem.' + details.hero);

    _.forEach(heroItem, function (hero) {
        if (details.visibility) {
            hero.classList.remove('hide');
        } else {
            hero.classList.add('hide');
        }
    });
});


function drawGraph(heroes, dataConfig, graphTypeId = 0) {
    if (graphTypeId == 0) {
        drawBarChart(heroes, dataConfig)
    }
}

function drawBarChart(heroes, dataConfig) {
    var graph,
        graphItem,
        title;

    title = d3.select('#graph').append('div').classed('rowTitle', true);

    d3.map(dataConfig).each(function (val, key) {
        if (val.drawInChart) {
            title.append('div').classed(key, true).text(function () {
                return val.displayName;
            });
        }
    });

    graph = d3.select('#graph').append('div')
        .selectAll('div:not(.rowTitle)').data(heroes)
        .enter()
        .append('div').attr('class', function (hero) {
            return 'heroItem ' + hero.heroName.toLowerCase().replace(/[\s\W]/g, '');
        });

    graph.append('div').append('img')
        .attr('src', function (hero) {
            return hero.heroIcon
        })
        .attr('title', function (hero) {
            return hero.heroName;
        });

    graph.append('div')
        .classed('barWrapper', true)
        .each(function (hero) {
            var self = this;
            d3.map(hero).each(function (val, key) {
                graphItem = d3.select(self).filter(function () {
                    return dataConfig[key].drawInChart
                }).append('div').attr('class', 'bar ' + key);

                graphItem.append('p')
                    .classed('row', true)
                    .style('width', (val * 100) / dataConfig[key].max + '%')

                graphItem.append('p')
                    .classed('title', true)
                    .text(val);

            });
        });
}

