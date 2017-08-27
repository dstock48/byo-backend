document.querySelector('form').addEventListener('submit', (e) => {
  const tokenContainer = document.getElementById('token-container');
  const email = document.getElementById('email');
  const appName = document.getElementById('app-name');

  fetch('/api/v1/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'Application/JSON',
    },
    body: JSON.stringify({
      email: email.value,
      appName: appName.value,
    }),
  })
    .then(data => data.json())
    .then((data) => {
      tokenContainer.querySelector('#token-display').textContent = data.token;
      tokenContainer.classList.remove('hidden');
      email.value = '';
      appName.value = '';
    });

  e.preventDefault();
});
