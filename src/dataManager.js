import _ from 'lodash';

function dataManager() {
    let dataConfig = {
        heroIcon: {
            displayName: 'Icon',
            drawInChart: false,
            drawInConfig: false
        },
        heroName: {
            displayName: 'Name',
            drawInChart: false,
            drawInConfig: false
        },
        lvl: {
            displayName: 'Level',
            drawInChart: true,
            drawInConfig: true,
            values: []
        },
        kills: {
            displayName: 'Kills',
            drawInChart: true,
            drawInConfig: true,
            values: []
        },
        deaths: {
            displayName: 'Deaths',
            drawInChart: true,
            drawInConfig: true,
            values: []
        },
        assists: {
            displayName: 'Assists',
            drawInChart: true,
            drawInConfig: true,
            values: []
        },
        gpm: {
            displayName: 'Gold per minute',
            drawInChart: true,
            drawInConfig: true,
            values: []
        },
        xpm: {
            displayName: 'Experience per minute',
            drawInChart: true,
            drawInConfig: true,
            values: []
        },
        lastHits: {
            displayName: 'Last hits',
            drawInChart: true,
            drawInConfig: true,
            values: []
        },
        denies: {
            displayName: 'Denies',
            drawInChart: true,
            drawInConfig: true,
            values: []
        },
        heroDamage: {
            displayName: 'Hero damage',
            drawInChart: true,
            drawInConfig: true,
            values: []
        },
        heal: {
            displayName: 'Heal done',
            drawInChart: true,
            drawInConfig: true,
            values: []
        },
        towerDamage: {
            displayName: 'Tower damage',
            drawInChart: true,
            drawInConfig: true,
            values: []
        },
        gold: {
            displayName: 'Gold earned',
            drawInChart: true,
            drawInConfig: true,
            values: []
        }
    };

    function getAllHeroes() {
        return new Promise((resolve, reject) => {
            if (localStorage.getItem('heroes')) {
                resolve(JSON.parse(localStorage.getItem('heroes')));
            }
            else {
                fetch('https://api.opendota.com/api/heroStats').then((resp) => {
                    return resp.json();
                }).then((heroes) => {
                    localStorage.setItem('heroes', JSON.stringify(heroes));
                    resolve(heroes);
                }).catch((err) => {
                    reject(err);
                });
            }
        });
    };

    function loadMatchData(matchId) {
        return fetch('https://api.opendota.com/api/matches/' + matchId).then((resp) => {
            return resp.json();
        });
    };

    function getMatchData(matchId) {
        return new Promise((resolve, reject) => {
            let localMatch = (localStorage.getItem('match' + matchId));
            if (!_.isEmpty(localMatch)) {
                resolve(JSON.parse(localMatch));
            } else {
                getAllHeroes().then((heroes) => {
                    loadMatchData(matchId).then((data) => {
                        resolve(formatData(data, heroes, matchId));
                    }).catch((err) => {
                        reject(err);
                    });
                });
            }
        });
    };

    function formatData(matchData, allHeroes, matchId) {
        let mappedInfo;

        mappedInfo = _.map(matchData['players'], (player) => {
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

        localStorage.setItem('match' + matchId, JSON.stringify({
            heroData: mappedInfo,
            dataConfig: dataConfig
        }));

        return {
            heroData: mappedInfo,
            dataConfig: dataConfig
        };
    }

    return {
        getMatchData: getMatchData
    }
};

export default dataManager();