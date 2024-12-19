let captchaResolved = false;

function fetchAndDisplaySequence() {
    const N = document.getElementById('numberInput').value;
    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';

    let i = 1;
    function fetchNext() {
        if (i <= N) {
            fetch('https://api.prod.jcloudify.com/whoami')
                .then(response => {
                    if (N >= 100 && response.status === 403 && !captchaResolved) {
                        showCaptcha();
                    } else {
                        outputDiv.innerHTML += `${i}. Forbidden<br>`;
                        i++;
                        setTimeout(fetchNext, 1000);
                    }
                })
                .catch(error => {
                    console.error('Error fetching:', error);
                });
        }
    }
    fetchNext();
}

function showCaptcha() {
    const container = document.getElementById("captcha-container");
    AwsWafCaptcha.renderCaptcha(container, {
        // apiKey: "",
        onSuccess: () => {
            captchaResolved = true;
            document.getElementById("captcha-container").innerHTML = '';
            fetchAndDisplaySequence();
        },
        onError: (error) => {
            const errorContainer = document.getElementById("error-container");
            errorContainer.textContent = error.message;
        },
    });
}
