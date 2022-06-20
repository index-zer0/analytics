!(function () {
    "use strict";
    var a = window.location,
        r = window.document,
        o = r.currentScript,
        s = o.getAttribute("data-api") || new URL(o.src).origin;

    function l(t) {
        console.warn("Ignoring Event: " + t);
    }
    function t(t, e) {
        /*if (
            /^localhost$|^127(\.[0-9]+){0,2}\.[0-9]+$|^\[::1?\]$/.test(
                a.hostname
            ) ||
            "file:" === a.protocol
        )
            return l("localhost");*/
        if (
            !(
                window._phantom ||
                window.__nightmare ||
                window.navigator.webdriver ||
                window.Cypress
            )
        ) {
            try {
                if ("true" === window.localStorage.plausible_ignore)
                    return l("localStorage flag");
            } catch (t) {}
            var i = {};
            (i.n = t),
                (i.h = a.host),
                (i.u = a.href),
                (i.d = o.getAttribute("data-domain")),
                (i.r = r.referrer || null),
                (i.w = window.innerWidth),
                (i.p = a.pathname);
            e && e.meta && (i.m = JSON.stringify(e.meta)),
                e && e.props && (i.p = e.props);
            // console.log(i);
            var n = new XMLHttpRequest();
            n.open("POST", s, !0),
                n.setRequestHeader("Content-Type", "text/plain"),
                n.send(JSON.stringify(i)),
                (n.onreadystatechange = function () {
                    4 === n.readyState && e && e.callback && e.callback();
                });
        }
    }
    var e = (window.plausible && window.plausible.q) || [];
    window.plausible = t;
    for (var i, n = 0; n < e.length; n++) t.apply(this, e[n]);
    function p() {
        // console.log("popstate: ", a);
        i !== a.pathname && ((i = a.pathname), t("pageview"));
    }
    var w,
        d = window.history;
    // Adds an entry to the browser's session history stack
    function u(e) {
        e.preventDefault();
        //return (e.returnValue = "Are you sure you want to exit?");
    }
    window.addEventListener("beforeunload", u);
    d.pushState &&
        ((w = d.pushState),
        (d.pushState = function () {
            w.apply(this, arguments), p();
        }),
        // on go back
        window.addEventListener("popstate", p)),
        // before loading
        "prerender" === r.visibilityState
            ? r.addEventListener("visibilitychange", function () {
                  // if not loaded
                  i || "visible" !== r.visibilityState || p();
              })
            : // if it is visible
              p();
})();

// if(document.referrer.indexOf(window.location.hostname)==-1)