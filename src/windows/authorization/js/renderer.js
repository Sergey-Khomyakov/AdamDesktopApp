import './../../../style.css'
    
window.addEventListener("load", async () => {
    await window.darkMode.system()
    const btnPassword = document.querySelector('[passwordBtn]');

    btnPassword.addEventListener('click', async (e) => {
        e.preventDefault();
        const parent = btnPassword.closest('[passwordBox]');
        const password = parent.querySelector('#password');

        if (password.getAttribute('type') === 'password') {
            btnPassword.setAttribute('src', '/src/assets/icons/EyeSlash.svg');
            password.setAttribute('type', 'text');
        } else {
            password.setAttribute('type', 'password');
            btnPassword.setAttribute('src', '/src/assets/icons/Eye.svg');
        }
    });

    document.getElementById('singin').addEventListener('click', async () => {
        const login = document.getElementById('login');
        const password = document.getElementById('password');

        if (login.value === '' || password.value === '') {
            if(login.value === '') {
                login.classList.add('invalid:border-red-600');
            } else {
                login.classList.remove('invalid:border-red-600');
            }

            if(password.value === '') {
                password.classList.add('invalid:border-red-600');
            } else {
                password.classList.remove('invalid:border-red-600');
            }
            return;
        }

        const result = await window.user.login(login.value, password.value);

        if (!result) {
            const info = document.querySelector('[info]');
            info.textContent = 'Неправильный логин или пароль';
        }
    });

    const dataFill= await window.user.autoFill();

    if (dataFill) {
        document.getElementById('login').value = dataFill.login;
        document.getElementById('password').value = dataFill.password;
    }
});