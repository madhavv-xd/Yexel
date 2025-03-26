document.addEventListener('DOMContentLoaded', function() {
    const extractbutton = document.getElementById('extractlinks');
    const channelUrlinput = document.getElementById('channelurl');
    const statusDiv = document.getElementById('status');

    function isValidYoutube(url){
        try{
            const parsed = new URL(url);

            const validHosts = ['www.youtube.com', 'youtube.com' , 'm.youtube.com'];
            if(!validHosts.includes(parsed.host)){
                return false;
            }

            const validPathPatterns = [
                /^\/(@[a-zA-Z0-9.-]+)/, // Modern @username format
                /^\/c\/[a-zA-Z0-9.-]+/, // /c/channelname format
                /^\/channel\/[a-zA-Z0-9_-]+/, // /channel/ID format
                /^\/user\/[a-zA-Z0-9.-]+/ // /user/username format
              ];
          return validPathPatterns.some(pattern => pattern.test(parsed.pathname));
        } catch(error){
            return false;
        }
    }

    extractbutton.addEventListener('click' , function(){
        const channelUrl = channelUrlinput.value.trim();

        statusDiv.textContent = '';
        statusDiv.style.color = 'black';

        if (!channelUrl) {
            statusDiv.style.color = 'red';
            statusDiv.textContent = 'Please enter a channel URL';
            return;
          }
      
          if (!isValidYouTubeChannelUrl(channelUrl)) {
            statusDiv.style.color = 'red';
            statusDiv.textContent = 'Invalid YouTube channel URL. Please enter a valid YouTube channel link.';
            return;
          }

          chrome.runtime.sendMessage({
            action : 'extractChannelLinks',
            channelUrl : channelUrl 
          } , function(response){
            if(response.status === 'success'){
                statusDiv.textContent = 'Links extracted successfully';
            }
            else{
                statusDiv.textContent = 'Failed to extract links. Please try again';
            }
          })
    })
});