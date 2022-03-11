var Servers = [];
var showVersions = showEmptyServers = showPasswordedServers = true;
var sortBy = "A-Z";

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) { 
            return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
        });
    };
}

function fetchServers() {
    return fetch('https://mtasa.com/api/')
    .then(result => result.json())
    .then(data => {
        return data;
    })
}

function updateServersList() {
    var list = document.getElementById("ServerList");
    sortServerList();

    var code = "";
    Servers.forEach((server) => {
        var className = (
            (server.visible && 
            (showEmptyServers || (!showEmptyServers && server.players > 0)) &&
            (showPasswordedServers || (!showPasswordedServers && server.password != 1))
            ) ? "ServerItem" : "Hidden");
        var passworded = (server.password == 1 ? "Yes" : "");
        var version = (showVersions ? `<div class="itemText" style="width: 3%">${server.version}</div>` : "");

        code = code + (
            `<div class="${className}">
            ${version}
            <div class="itemText" style="width: 70%">${server.name}</div>
            <div class="itemText" style="width: 7%">${server.players}/${server.maxplayers}</div>
            <div class="itemText" style="width: 13%">${passworded}</div>
            <button onclick="location.href='mtasa://${server.ip}:${server.password}'" class="connect">Connect</button>
            </div>`
        )
    });

    list.innerHTML = code;
}

function sortServerList() {
    Servers.sort((a, b) => {
        if(sortBy == "A-Z") {
            return ((a.name > b.name) ? -1 : 1);
        } else if(sortBy == "Z-A") {
            return ((a.name > b.name) ? 1 : -1);
        } else if(sortBy == "ascending") {
            return ((a.players > b.players) ? -1 : 1);
        } else if(sortBy == "descending") {
            return ((a.players > b.players) ? 1 : -1);
        }
    });
}

function searchInServers(name) {
    Servers.forEach((server) => {
        server.visible = server.name.toLowerCase().includes(name.toLowerCase());
    });
}

function updateSearch() {
    searchInServers(this.value);
    updateServersList();
}

function updateCheckboxVersions() {
    showVersions = this.checked;
    updateServersList();
}

function updateCheckboxEmpty() {
    showEmptyServers = this.checked;
    updateServersList();
}

function updateCheckboxPassworded() {
    showPasswordedServers = this.checked;
    updateServersList();
}

function updateSorting() {
    sortBy = this.value;
    updateServersList();
}

async function onLoad(newColor)
{
    [Servers] = await Promise.all([
        fetchServers()
    ]);
    
    searchInServers("");
    updateServersList();

    document.getElementById("Search").addEventListener('input', updateSearch);
    document.getElementById("checkbox").addEventListener('change', updateCheckboxVersions);
    document.getElementById("checkbox2").addEventListener('change', updateCheckboxEmpty);
    document.getElementById("checkbox3").addEventListener('change', updateCheckboxPassworded);
    document.getElementById("sort-by").addEventListener('change', updateSorting);
}