// Copyright (c) 2008-2010 Kris Maglione <maglione.k at Gmail>
//
// This work is licensed for reuse under an MIT license. Details are
// given in the LICENSE.txt file included with this file.
"use strict";

(function () {
    const jsmodules = {}
    const modules = { __proto__: jsmodules };
    const BASE = "chrome://dactyl/content/";

    modules.modules = modules;

    const loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"]
                             .getService(Components.interfaces.mozIJSSubScriptLoader);

    modules.load = function load(script) {
        for (let [i, base] in Iterator(prefix)) {
            try {
                loader.loadSubScript(base + script + ".js", modules, "UTF-8");
                return;
            }
            catch (e) {
                if (typeof e !== "string") {
                    dump("dactyl: Trying: " + (base + script + ".js") + ": " + e + "\n" + e.stack + "\n");
                    Components.utils.reportError(e);
                }
            }
        }
        try {
            Components.utils.import("resource://dactyl/" + script + ".jsm", jsmodules);
        }
        catch (e) {
            dump("dactyl: Loading script " + script + ": " + e.result + " " + e + "\n");
            dump(Error().stack + "\n");
            Components.utils.reportError(e);
        }
    };

    let prefix = [BASE];

    modules.load("services");
    prefix.unshift("chrome://" + modules.services.get("dactyl:").name + "/content/");

    ["base",
     "modules",
     "storage",
     "util",
     "modes",
     "abbreviations",
     "autocommands",
     "buffer",
     "commandline",
     "commands",
     "completion",
     "configbase",
     "config",
     "dactyl",
     "editor",
     "events",
     "finder",
     "highlight",
     "hints",
     "io",
     "javascript",
     "mappings",
     "marks",
     "options",
     "statusline",
     "styles",
     "template"
     ].forEach(modules.load);

    modules.Config.prototype.scripts.forEach(modules.load);
})();

// vim: set fdm=marker sw=4 ts=4 et:
