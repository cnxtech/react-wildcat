/* eslint-disable no-useless-escape */
const __DEV__ = process.env.NODE_ENV === "development";

module.exports = function defaultTemplate(cfg) {
    const data = cfg.data;
    const head = cfg.head;
    const html = cfg.html;

    const wildcatConfig = cfg.wildcatConfig;
    const clientSettings = wildcatConfig.clientSettings;
    const protocol = wildcatConfig.serverSettings.appServer.protocol;
    const generalSettings = wildcatConfig.generalSettings;

    const reactRootElementID = clientSettings.reactRootElementID;
    const serviceWorker = clientSettings.serviceWorker;

    const staticUrl = generalSettings.staticUrl;

    const helmetTags = Object.keys(head)
        .filter(meta => meta !== "htmlAttributes")
        .map(meta => head[meta].toString().trim());

    return `
<!doctype html>
<html ${head.htmlAttributes.toString()}>
    <head>
        <link rel="dns-prefetch" href="${staticUrl}" />
        <link rel="preconnect" href="${staticUrl}" />

        ${helmetTags.join(``)}
    </head>
    <body>
        <div id="${reactRootElementID}">${html}</div>
        ${
            serviceWorker && protocol !== "http"
                ? `
        <script src="/register-sw.js"></script>
        `
                : ``
        }

        ${
            serviceWorker && __DEV__ && protocol !== "http"
                ? `
        <script>
            // Remove any registered service workers
            if ("serviceWorker" in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                    for (var registration of registrations) {
                        registration.unregister();
                    }
                    if (registrations.length > 0) {
                        window.location.reload();
                    }
                })
            }
        </script>
        `
                : ``
        }

        <script>
            __INITIAL_DATA__ = ${JSON.stringify(data)};
            __REACT_ROOT_ID__ = "${reactRootElementID}";
        </script>
    </body>
</html>
`.trim();
};
