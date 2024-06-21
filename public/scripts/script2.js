
const generateInput = document.getElementById('visiongenInput');
const generateBtn = document.getElementById('visiongenButton');
const generateImageInput = document.getElementById('visiongenImageInput');
const responseContainer = document.getElementById('visiongenResponse');
const request = (url, params = {}, method = 'GET') => {
    let options = {
        method
    };
    if ('GET' === method) {
        url += '?' + (new URLSearchParams(params)).toString();
    } else {
        options.body = JSON.stringify(params);
        options.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
    }
    return fetch(url, options).then(response => response.json());
};
const get = (url, params) => request(url, params, 'GET');
const post = (url, params) => request(url, params, 'POST');

function fetchData(e) {
    e.preventDefault();
    responseContainer.innerHTML = "<strong>Please wait: Processing with Model... Please wait</strong>"
    post('http://localhost:3000/visionHandler', { userInput: generateInput.value, userImageInput: `${generateImageInput.value}.jpg` })
        .then(function (responseData) {
            if (!responseData) {
                console.log(
                    'Looks like there was a problem'
                );
                return;
            }
            responseContainer.innerHTML = `<strong>Result: </strong><br> ${responseData.response}`;
        })
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
            responseContainer.innerHTML = `<strong>Fetch Error :</strong><br>${err}<br>Processing error...Possibly LMS server is down.`
        });
}

generateBtn.addEventListener('click', fetchData);

generateImageInput.addEventListener('change', (e) => {
    const imagesToHide = document.getElementsByClassName('demo-images');
    for(var i = 0; i < imagesToHide.length; i++){
        imagesToHide[i].style.display = "none";
    }
    const selectedImageId = `image-${e.target.value}`;
    document.getElementById(selectedImageId).style.display = 'block';
});

