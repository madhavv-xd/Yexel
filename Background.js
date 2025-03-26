chrome.runtime.onMessage.addListener((request , sender , sendResponse) => {
    if(request.action === 'extractChannelLinks'){
        extractChannelLinks(request.channelUrl)
        .then(links => {
            saveLinksToexcel(links);
            sendResponse({status : 'success'});
        })
        .catch(error => {
            sendResponse({status : 'error' , message : error.toString()});
        });
        return true;
    }
});

async function extractChannelLinks(channelUrl){
    const tab = await chrome.tabs.create({url : channelUrl , active: "false"});

    const links = await chrome.scripting.executeScript({
        target: {tabId: tab.id} ,
        function: () => {
            const videoLinks = [];

            const videoElements = document.querySelectorAll('a#video-title-link');

            videoElements.forEach(element => {
                videoLinks.push({
                    title: element.textContent.trim() ,
                    link: element.href
                });
            });
            return videoLinks;
        }
    });

    await chrome.tabs.remove(tab.id);

    return links[0].result;
}

function saveLinksToexcel(links){
    const csvContent = [
        ['Title' , 'Link'] , 
        ...links.map(link => [link.title , link.link]) 
    ].map(e => e.join(',')).join("\n");

    const blob = new Blob([csvContent] , {type: 'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);

    chrome.downloads.download({
        url:url ,
        filename: 'youtube_channel_links.csv' ,
        saveAs : true
    })
}