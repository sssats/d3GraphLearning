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

    function getColors() {
        return ["#2e6ae6", "#5de6ad", "#ad00ad", "#dcd90a", "#e66200", "#e67ab0", "#92a440", "#5cc5e0", "#00771f", "#956000"]
    }

    return {
        renderStatOption: renderStatOption,
        renderHeroList: renderHeroList,
        getColors: getColors
    }
};

export default configurationController();