chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
        conditions: [
            new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'www.icom.org.cn'},
            }),
            
            new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {hostEquals: 'icom.org.cn'}
            })
        ],
        
        actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
})