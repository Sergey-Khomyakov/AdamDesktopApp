import './../../../style.css'
import {NewsTags} from'./data.mjs'
import nav from './../../../modules/nav.mjs'

nav();

// // Следующая страница
// let nextPage = 2

// // Не отправляем ещё один запрос
// let isLoading = false

// // Больше не отправляем никаких запросов
// let shouldLoad = true

const renderNavCatalog = () => {
  const navCatalog = document.querySelector('[NavCatalog]');
  const data = NewsTags;

  navCatalog.innerHTML += `
  <div navItem="0" data-navActive="true" class="flex rounded-xl items-center px-2 py-1 gap-3 cursor-pointer group bg-white dark:bg-black">
      <p class="font-Manrope font-semibold text-black dark:text-white">Все</p>
  </div>
  `

  data.forEach((item) => {
    navCatalog.innerHTML += `
    <div navItem="${item.id}" data-navActive="false" class="flex rounded-xl items-center px-2 py-1 gap-3 cursor-pointer group hover:bg-white hover:dark:bg-black">
        <p class="font-Manrope font-semibold text-white dark:text-black hover:text-black hover:dark:text-white group-hover:text-black group-hover:dark:text-white">${item.name}</p>
    </div>
    `
  });
  
  navCatalog.querySelectorAll('[navItem]').forEach((item) => {
    item.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('navItem');
      const parent = e.currentTarget.closest('[NavCatalog]');
      const item = parent.querySelector(`[navItem="${id}"]`);
      const oldActiveNav = parent.querySelector('[data-navActive="true"]');
      oldActiveNav.setAttribute('data-navActive', 'false');
      item.setAttribute('data-navActive', 'true');


      oldActiveNav.classList.remove('dark:bg-black', 'bg-white');
      oldActiveNav.classList.add('hover:bg-white', 'hover:dark:bg-black');

      oldActiveNav.querySelector('p').classList.remove('dark:text-white', 'text-black');
      oldActiveNav.querySelector('p').classList.add('hover:text-black', 'hover:dark:text-white', 'text-white', 'dark:text-black');

      item.classList.add('dark:bg-black', 'bg-white');
      item.classList.remove('hover:bg-white', 'hover:dark:bg-black');
      item.querySelector('p').classList.remove('hover:text-black', 'hover:dark:text-white', 'text-white', 'dark:text-black');
      item.querySelector('p').classList.add('text-black', 'dark:text-white');

    })
  });
}


// const checkPosition = async () => {
//   const contentBlock = document.querySelector('[ContentCards]')
//   // Высота документа и экрана
//   const height = contentBlock.offsetHeight
//   const screenHeight = contentBlock.innerHeight

//   // Сколько пикселей уже проскроллили
//   const scrolled = contentBlock.scrollY

//   // Порог
//   const threshold = height - screenHeight / 4

//   // Низ экрана относительно страницы
//   const position = scrolled + screenHeight

//   if (position >= threshold) {
//     await fetchPosts()
//   }
// }

// const fetchPosts = async () => {
//   // Не отправляем новый запрос
//   if (isLoading || !shouldLoad) return

//   // Предотвращаем новые запросы
//   isLoading = true

//   const { posts, next } = await server.posts(nextPage)
//   posts.forEach(appendPost)

//   // Следующая страница
//   nextPage = next

//   // Больше не надо ничего запрашивать
//   if (!next) shouldLoad = false

//   // Снимаем флаг
//   isLoading = false
// }

// const throttle = (callee, timeout) => {
//   let timer = null

//   return function perform(...args) {
//     if (timer) return

//     timer = setTimeout(() => {
//       callee(...args)

//       clearTimeout(timer)
//       timer = null
//     }, timeout)
//   }
// }

// const appendPost = (postData) => {
//   // Если данных нет, ничего не делаем
//   if (!postData) return

//   // Храним ссылку на элемент
//   const main = document.querySelector('[ContentCards]')

//   // Превращает данные в HTML-элемент
//   const postNode = composePost(postData)

//   // Добавляем созданный элемент
//   main.append(postNode)
// }

// const composePost = (postData) => {
//   // Если ничего не передано, ничего не возвращаем
//   if (!postData) return

//   // Обращаемся к старому шаблону
//   const template = document.getElementById('post_template')

//   // Клонируем
//   const post = template.content.cloneNode(true)

//   // Получаем нужную информацию
//   const { title, body, likes, reposts } = postData

//   // Добавляем соответствующие тексты и числа
//   post.querySelector('h1').innerText = title
//   post.querySelector('p').innerText = body
//   post.querySelector('button:first-child').innerText += likes
//   post.querySelector('button:last-child').innerText += reposts

//   // Возвращаем созданный элемент
//   return post
// }


window.addEventListener("load", () => {
  renderNavCatalog();

  document.querySelector('[screenShot]').addEventListener('click', () => {
    window.mainApi.screenshot()
  })
});

// window.addEventListener('scroll', throttle(checkPosition, 250))
// window.addEventListener('resize', throttle(checkPosition, 250))