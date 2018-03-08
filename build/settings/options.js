import secrets from './secrets.json';

module.exports = {
    "optionsDisco": {
        key: secrets.apiKey // My API Key
    },
    "optionsRSS": {
        title: "Discovery Gaming Community",
        description: "A live feed of the posts within the Discovery GC Forum.",
        site_url: "https://discoverygc.com/forums/",
        feed_url: "https://discoverygc.com/forums/syndication.php?fid=9&limit=15",
        docs: "https://discoverygc.com/forums/misc.php?action=syndication",
        webMaster: "@Alex. - https://discoverygc.com/forums/member.php?action=profile&uid=13536"
    }
    // See docs for usage
    // https://www.npmjs.com/package/rss
};