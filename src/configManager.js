import _ from 'lodash';

function configManager() {

    function render(data, selector) {
        let el = document.querySelector(selector),
            template, configItems = '';

        template = document.createElement('ul');

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

        visibilityEvents(template);

        el.appendChild(template);
    }

    function visibilityEvents(configEl) {
        configEl.addEventListener('click', function (ev) {
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

    return {
        render: render
    }
};

export default configManager();