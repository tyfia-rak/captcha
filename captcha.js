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
        apiKey: "TBiG/+TZQjEXaYq8nllidX3C1pVZ9kMGM/Nkf6CaSHZw3JtDEPxkMRWhz7gBFEIc1hcf5JpUBHU+NYIgFzuSCPLD/8PXa/rLdlEzvJ4L1/k3sfyUlbalW8eRtI/Xl74mLtCxGxLw+VoeiVvHh0yF/QqiPwaAo3D3w/stwx1PoRq/GOfyWE2Yn7uNTM9Moxly1DKX8A3yFTp60m7KpFpEB/ck9Q5npoUMvQesXYyzqGC6sji3SzISjVhJ7gZXliocLFIgOSOGaPZEx3QAahJonOG5ty8uaKa13beAUxEbbh2Cyz7Sn7ttZx/EGCLC4dasVqjHRZnyKAS17SckAee9/mkRwdZl9RiG71UQTELFC9rIOYINj7GnklDvTvf0PRbJo+9VRC9wh4EqPps76NKcQchomcN+2tnNpbVg6oBiVXC5xBN31QsVs0QsHalrJOszZmJcZgWalMXA8hB6UHVLa7KEvsBoeCvYhyCGm/QFRvegWaA4s+upwHZS93XB+UH+jw4D0LH8dvSXFBqzDN70QlDQk6WlLlqtDoUlh42/+IHLAmk5P4b2EsryMKOiGiwypxrzQC3/u1cbg67Aq6IFOZPxqcqpjZ7qteh00kMF3vFklLgs+G8isB+8HzeW5y3DRfijFKGtqtpDnw9RLJXN0PvR8ip6Bf7ZVjAUg9Zkees=_0_1",
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
