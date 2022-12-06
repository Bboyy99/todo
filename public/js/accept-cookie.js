let buttonAccept = document.getElementById('button-accept');
let messageCookie = document.getElementById('message-cookie');

if(buttonAccept) {
    buttonAccept.addEventListener('click', async () => {
        let response = await fetch('/accept', {  
            method: 'POST'
        });

        if(response.ok) {
            messageCookie.remove();
        }
    });
}
