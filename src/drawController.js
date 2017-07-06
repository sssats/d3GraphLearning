import _ from 'lodash';
import * as d3 from 'd3';
import dataManager from './dataManager';
import configurationController from './configurationController';


function drawController() {
    let colors = configurationController.getColors();

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

        graph.append('div')
            .style('border-left', function (hero, index) {
                return '5px solid' + colors[index];
            })
            .append('img')
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
            let pieData, svg, g, pie, path, labels, arc, text, outerArc, lines,
                canvSize = {
                    width: 800,
                    height: 400
                },
                radius = 150;

            pieData = mapDataForPie(data.dataConfig[statName].values, data.heroData);

            document.querySelector(selector).innerHTML = '';

            svg = d3.select(selector).append('svg:svg')
                .attr('width', canvSize.width + 'px')
                .attr('height', canvSize.height + 'px')
                .append('g')
                .classed('wrapper', true)
                .attr('transform', 'translate(' + canvSize.width / 2 + ', ' + canvSize.height / 2 + ')');

            g = svg.append('g');

            labels = svg.append('g')
                .attr('class', 'labels');
            lines = svg.append('g')
                .attr('class', 'lines');

            pie = d3.pie()(pieData.map(function (d) {
                return d.number;
            }));

            path = d3.arc()
                .outerRadius(radius - 10)
                .innerRadius(0);

            outerArc = d3.arc()
                .innerRadius(radius * 0.9)
                .outerRadius(radius * 0.9);

            arc = g.selectAll('.arc').data(pie).enter().append('g')
                .attr('class', 'arc');

            arc.append('path')
                .attr('d', path)
                .attr('fill', function (el, ind) {
                    return colors[ind];
                });

            text = svg.select('.labels').selectAll('text')
                .data(pie);

            text.enter()
                .filter(function (d) {
                    return d.data !== 0;
                })
                .append('text')
                .attr('dy', '.35em')
                .text(function (d) {
                    return d.data;
                })
                .attr('transform', function (d) {
                    var pos = outerArc.centroid(d);
                    pos[0] *= 1.2;
                    pos[1] *= 1.2;
                    return 'translate(' + pos + ')';
                });
        });
    }

    return {
        drawBarChart: drawBarChart,
        drawPieChart: drawPieChart
    }
};

export default drawController();