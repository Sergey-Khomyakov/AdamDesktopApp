export default function() {

  
const updateOnlineStatus = () => {
  const userStatus = document.querySelector('[userStatus]');
  if(navigator.onLine){
    userStatus.classList.remove('bg-red-400');
    userStatus.classList.add('bg-green-400');
  }else{
    userStatus.classList.add('bg-red-400');
    userStatus.classList.remove('bg-green-400');
  }
}

  document.addEventListener('DOMContentLoaded', () => {
    const btnNav = document.querySelector("[ToggleNav]");

    btnNav.addEventListener("click", (e) => {
      e.preventDefault();
      const closestParent = btnNav.closest('nav');
      const logout = closestParent.querySelector('[logout]');
      const userBlock = closestParent.querySelector('[userBlock]');
      const ToggleMode = closestParent.querySelector('[ToggleMode]');
      
      if(closestParent.classList.contains('w-64')) {
        closestParent.classList.remove('w-64');
        closestParent.classList.add('w-20');
        btnNav.classList.remove('rotate-180');
        closestParent.querySelectorAll('[NavItem] > p').forEach((item) => {
          item.classList.add('hidden');
        })
        logout.classList.add('hidden');
        userBlock.classList.remove('flex');
        userBlock.classList.add('hidden');
        ToggleMode.classList.add('hidden');
      }else{
        closestParent.classList.remove('w-20');
        closestParent.classList.add('w-64');
        btnNav.classList.add('rotate-180');
        closestParent.querySelectorAll('[NavItem] > p').forEach((item) => {
          item.classList.remove('hidden');
        })
        logout.classList.remove('hidden');
        userBlock.classList.remove('hidden');
        userBlock.classList.add('flex');
        ToggleMode.classList.remove('hidden');
      }
    });



    document.querySelector('[logout]').addEventListener('click', async () => {
      await window.preload.logout();
    })
  });


  document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
    const isDarkMode = await window.darkMode.toggle()
    document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
  })
  
  window.addEventListener('online', () => {
    updateOnlineStatus();
  })
  window.addEventListener('offline', () => {
    updateOnlineStatus();
  })
}
