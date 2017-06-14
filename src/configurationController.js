import _ from 'lodash';

function configurationController() {

    function renderStatOption(data, selector) {
        let el = document.querySelector(selector),
            template, configItems = '';

        template = document.createElement('ul');
        template.classList.add('stats');

        _.forIn(data, function (dataItem, key) {
            if (dataItem.drawInConfig) {
                configItems += `<li>
                                    <label>
                                        <input type="checkbox" checked value="${key}" class="visibilityToggle"/> 
                                        ${dataItem.displayName}
                                    </label>
                                </li>`
            }
        });

        template.innerHTML = configItems;

        visibilityStatEvents(template);

        el.appendChild(template);
    }

    function visibilityStatEvents(statsEl) {
        statsEl.addEventListener('click', function (ev) {
            let target = ev.target.className === 'visibilityToggle' ? ev.target :
                (ev.target.firstChild.className === 'visibilityToggle' ? ev.target.firstChild : undefined);
            if (target) {
                let event = new CustomEvent("toggleBarVisibility", {
                    detail: {
                        'type': target.value,
                        'visibility': target.checked
                    }
                });
                document.dispatchEvent(event);
            }
        });
    }

    function renderHeroList(data, selector) {
        let el = document.querySelector(selector),
            template, configItems = '';

        template = document.createElement('ul');
        template.classList.add('heroes');

        _.forIn(data, function (hero) {
            configItems += `<li>
                                <label>
                                    <input type="checkbox" checked value="${hero.heroName.toLowerCase().replace(/[\s\W]/g, '')}" class="visibilityToggle"/> 
                                    ${hero.heroName}
                                </label>
                            </li>`
        });

        template.innerHTML = configItems;

        visibilityHeroEvents(template);

        el.appendChild(template);
    }

    function visibilityHeroEvents(heroesEl) {
        heroesEl.addEventListener('click', function (ev) {
            let target = ev.target.className === 'visibilityToggle' ? ev.target :
                (ev.target.firstChild.className === 'visibilityToggle' ? ev.target.firstChild : undefined);
            if (target) {
                let event = new CustomEvent("toggleHeroVisibility", {
                    detail: {
                        'hero': target.value,
                        'visibility': target.checked
                    }
                });
                document.dispatchEvent(event);
            }
        });
    }

    return {
        renderStatOption: renderStatOption,
        renderHeroList: renderHeroList
    }
};

export default configurationController();