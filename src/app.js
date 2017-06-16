import _ from 'lodash';
import dataManager from './dataManager';
import configurationController from './configurationController';
import drawController from './drawController';
import '../assets/style.scss';

const findMatchBtn = document.querySelector('#findMatch');
const pieHandlers = document.querySelector('#graph');

findMatchBtn.addEventListener('click', function () {
    var matchId = document.querySelector('#matchId').value;
    dataManager.getMatchData(matchId).then(function (data) {
        if (!document.querySelector('#config ul.stats')) {
            configurationController.renderStatOption(data.dataConfig, '#config');
        }
        if (!document.querySelector('#config ul.heroes')) {
            configurationController.renderHeroList(data.heroData, '#config');
        }
        drawGraph(data.heroData, data.dataConfig);
    });
});

pieHandlers.addEventListener('click', function (ev) {
    const target = ev.target.classList.contains('bar') ? ev.target :
        (ev.target.parentElement.classList.contains('bar') ? ev.target.parentElement :
            (ev.target.parentElement.classList.contains('rowTitle') ? ev.target : false));
    if (target) {
        drawController.drawPieChart('#pie', target.getAttribute('class').replace(/(bar)[\s\W]/g, ''));
    }
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
        drawController.drawBarChart(heroes, dataConfig, '#graph')
    }
}


