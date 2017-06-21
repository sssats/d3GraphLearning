import _ from 'lodash';
import * as d3 from "d3";
import dataManager from './dataManager';


function drawController() {

    function drawBarChart(heroes, dataConfig, selector) {
        var graph,
            graphItem,
            title;

        document.querySelector(selector).innerHTML = '';

        title = d3.select(selector).append('div').classed('rowTitle', true);

        d3.map(dataConfig).each(function (val, key) {
            if (val.drawInChart) {
                title.append('div').classed(key, true).text(function () {
                    return val.displayName;
                });
            }
        });

        graph = d3.select(selector).append('div')
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

    function mapDataForPie(data, heroes) {
        return _.map(data, function (val, key) {
            return {
                number: val,
                name: heroes[key].heroName
            }
        })
    }

    function drawPieChart(selector, statName) {
        dataManager.getMatchData().then(function (data) {
            const pieData = mapDataForPie(data.dataConfig[statName].values, data.heroData)
            const svg = d3.select(selector).append('svg:svg')
                .attr('width', '300px')
                .attr('height', '300px');
            const g = svg.append("g").attr("transform", "translate(150, 150)");
            const color = d3.scaleOrdinal(["#F44336", "#795548", "#9C27B0", "#76FF03", "#3F51B5", "#2196F3", "#4CAF50", "#FF9800", "#607D8B", "#69F0AE"]);
            const radius = 150;
            const pie = d3.pie()(pieData.map(function (d) {
                return d.number;
            }));

            var path = d3.arc()
                .outerRadius(radius - 10)
                .innerRadius(0);

            var label = d3.arc()
                .outerRadius(radius - 40)
                .innerRadius(radius - 40);

            var arc = g.selectAll('.arc').data(pie).enter().append("g")
                .attr("class", "arc");

            arc.append("path")
                .attr("d", path)
                .attr("fill", function (el, ind) {
                    return color(ind);
                });
        })
    }

    return {
        drawBarChart: drawBarChart,
        drawPieChart: drawPieChart
    }
};

export default drawController();