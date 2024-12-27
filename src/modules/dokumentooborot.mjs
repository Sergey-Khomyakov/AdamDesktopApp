import txt from '../assets/icons/FileText.svg';
import img from '../assets/icons/FileImage.svg';
import jpg from '../assets/icons/FileJpg.svg';
import png from '../assets/icons/FilePng.svg';
import ppt from '../assets/icons/FilePpt.svg';
import pdf from '../assets/icons/FilePdf.svg';
import xls from '../assets/icons/FileXls.svg';
import doc from '../assets/icons/FileDoc.svg';
import zip from '../assets/icons/FileZip.svg';
import video from '../assets/icons/FileVideo.svg';
import audio from '../assets/icons/FileAudio.svg';
import folder from '../assets/icons/FolderNotch.svg';
import { Buffer } from 'buffer';

export default function() {
    document.addEventListener('DOMContentLoaded', () => {
        try {
            render('/')

            const dropzone = document.querySelector('[Body]')
            dropzone.addEventListener("dragover", (e) =>{
                e.stopPropagation();
                e.preventDefault()
            })

            dropzone.addEventListener("drop", async (e) =>{
                e.stopPropagation();
                e.preventDefault()

                const filesInput = e.dataTransfer.files;
                const body = document.querySelector('[Body]');
                const path = body.getAttribute('data-folder');
                for(const file of filesInput){
                    const buffer = await fileToBuffer(file);
                    if(file.type !== ""){
                        const answer = await window.dokumentooborot.sendFile(path, file.name, buffer, file.type)
                        if(answer.error === null){
                            renderFiles(body, {
                                path: answer.path,
                                name: file.name,
                                type: "file",
                                extension: file.type.split("/")[1],
                            })
                            
                        }
                    }
                }
                const files = document.querySelectorAll('[draggable="true"]');
                files.forEach(file => {
                    file.ondragstart = (event) => {
                        event.preventDefault()
                        window.electron.startDrag(file.getAttribute('data-name'),file.getAttribute('data-path'))
                    }
                });
            })
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    });
}

const tuggleLoading = () => {
    const loading = document.querySelector('[loading]');
    if(loading.classList.contains('hidden')){
        loading.classList.remove('hidden');
        loading.classList.add('flex');
    }else{
        loading.classList.remove('flex');
        loading.classList.add('hidden');
    }
}

const renderNav = (path) => {
    const nav = document.querySelector('[Nav]');
    if(path === undefined) {
        return;
    }
    nav.innerHTML = ``
    const pathArray = path.split('\\');

    if(pathArray.length > 1) {
        let pathCustom = '';
        pathArray.forEach((item, index) => {
            if(index === 0){
                pathCustom += item;
                nav.innerHTML += `<div class="flex items-center gap-2">
                    <svg navItem="/" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="cursor-pointer w-8 h-8 shrink-0 group-hover:fill-white fill-white dark:fill-black">
                        <path d="M27 9H16.3337L12.8663 6.4C12.5196 6.14132 12.0988 6.00107 11.6663 6H5C4.46957 6 3.96086 6.21071 3.58579 6.58579C3.21071 6.96086 3 7.46957 3 8V25C3 25.5304 3.21071 26.0391 3.58579 26.4142C3.96086 26.7893 4.46957 27 5 27H27C27.5304 27 28.0391 26.7893 28.4142 26.4142C28.7893 26.0391 29 25.5304 29 25V11C29 10.4696 28.7893 9.96086 28.4142 9.58579C28.0391 9.21071 27.5304 9 27 9ZM5 8H11.6663L14.3337 10L11.6663 12H5V8ZM27 25H5V14H11.6663C12.0988 13.9989 12.5196 13.8587 12.8663 13.6L16.3337 11H27V25Z" />
                    </svg> 
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0 group-hover:fill-white fill-white dark:fill-black"">
                        <path d="M22.7074 16.7075L12.7074 26.7075C12.6145 26.8004 12.5042 26.8741 12.3828 26.9244C12.2614 26.9747 12.1313 27.0006 11.9999 27.0006C11.8686 27.0006 11.7384 26.9747 11.617 26.9244C11.4957 26.8741 11.3854 26.8004 11.2924 26.7075C11.1995 26.6146 11.1258 26.5043 11.0756 26.3829C11.0253 26.2615 10.9994 26.1314 10.9994 26C10.9994 25.8686 11.0253 25.7385 11.0756 25.6171C11.1258 25.4957 11.1995 25.3854 11.2924 25.2925L20.5862 16L11.2924 6.70751C11.1048 6.51987 10.9994 6.26537 10.9994 6.00001C10.9994 5.73464 11.1048 5.48015 11.2924 5.29251C11.4801 5.10487 11.7346 4.99945 11.9999 4.99945C12.2653 4.99945 12.5198 5.10487 12.7074 5.29251L22.7074 15.2925C22.8004 15.3854 22.8742 15.4957 22.9245 15.6171C22.9748 15.7385 23.0007 15.8686 23.0007 16C23.0007 16.1314 22.9748 16.2615 22.9245 16.3829C22.8742 16.5043 22.8004 16.6146 22.7074 16.7075Z" />
                    </svg>
                </div>`;
            }else if(index === path.split('\\').length - 1){
                pathCustom += '/' + item;
                nav.innerHTML += `
                <div navItem="${pathCustom}" class="flex rounded-xl items-center px-2 py-1 gap-3 cursor-pointer group hover:bg-white hover:dark:bg-black">
                    <p class="font-Manrope font-semibold text-white dark:text-black hover:text-black hover:dark:text-white group-hover:text-black group-hover:dark:text-white">${item}</p>
                </div>
                `;
            }else{
                pathCustom += '/' + item;
                nav.innerHTML += `<div class="flex items-center gap-2">
                    <div navItem="${pathCustom}" class="flex rounded-xl items-center px-2 py-1 gap-3 cursor-pointer group hover:bg-white hover:dark:bg-black">
                        <p class="font-Manrope font-semibold text-white dark:text-black hover:text-black hover:dark:text-white group-hover:text-black group-hover:dark:text-white">${item}</p>
                    </div>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0 group-hover:fill-white fill-white dark:fill-black"">
                        <path d="M22.7074 16.7075L12.7074 26.7075C12.6145 26.8004 12.5042 26.8741 12.3828 26.9244C12.2614 26.9747 12.1313 27.0006 11.9999 27.0006C11.8686 27.0006 11.7384 26.9747 11.617 26.9244C11.4957 26.8741 11.3854 26.8004 11.2924 26.7075C11.1995 26.6146 11.1258 26.5043 11.0756 26.3829C11.0253 26.2615 10.9994 26.1314 10.9994 26C10.9994 25.8686 11.0253 25.7385 11.0756 25.6171C11.1258 25.4957 11.1995 25.3854 11.2924 25.2925L20.5862 16L11.2924 6.70751C11.1048 6.51987 10.9994 6.26537 10.9994 6.00001C10.9994 5.73464 11.1048 5.48015 11.2924 5.29251C11.4801 5.10487 11.7346 4.99945 11.9999 4.99945C12.2653 4.99945 12.5198 5.10487 12.7074 5.29251L22.7074 15.2925C22.8004 15.3854 22.8742 15.4957 22.9245 15.6171C22.9748 15.7385 23.0007 15.8686 23.0007 16C23.0007 16.1314 22.9748 16.2615 22.9245 16.3829C22.8742 16.5043 22.8004 16.6146 22.7074 16.7075Z" />
                    </svg>
                </div>
                `;
            }
        });

    }else{
        nav.innerHTML += `
            <div class="flex items-center gap-2">
                <svg navItem="/" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="cursor-pointer w-8 h-8 shrink-0 group-hover:fill-white fill-white dark:fill-black">
                    <path d="M27 9H16.3337L12.8663 6.4C12.5196 6.14132 12.0988 6.00107 11.6663 6H5C4.46957 6 3.96086 6.21071 3.58579 6.58579C3.21071 6.96086 3 7.46957 3 8V25C3 25.5304 3.21071 26.0391 3.58579 26.4142C3.96086 26.7893 4.46957 27 5 27H27C27.5304 27 28.0391 26.7893 28.4142 26.4142C28.7893 26.0391 29 25.5304 29 25V11C29 10.4696 28.7893 9.96086 28.4142 9.58579C28.0391 9.21071 27.5304 9 27 9ZM5 8H11.6663L14.3337 10L11.6663 12H5V8ZM27 25H5V14H11.6663C12.0988 13.9989 12.5196 13.8587 12.8663 13.6L16.3337 11H27V25Z" />
                </svg>
            </div>
        `;
    }

    const navItems = nav.querySelectorAll('[navItem]');
    navItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            const path = e.currentTarget.getAttribute('navItem');
            tuggleLoading();
            render(path);
        });
    });
}  

const renderFiles = (body, item) => {
    let icon = getIcon(item.extension);
    body.innerHTML += `
        <div data-type="${item.type}" data-name="${item.name}" data-path="${item.type !== 'directory' ? item.path.replace(':\\', '://') : item.path}" ${item.type !== 'directory' ? 'draggable="true"' : ''} class="rounded-lg p-4 flex flex-col gap-2 group w-full h-full aspect-1-1 border dark:bg-black bg-gray-200 justify-between">
            <div class="flex gap-2 justify-between items-center w-full">
                <svg favorites="false" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 shrink-0 dark:fill-white fill-black cursor-pointer">
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#ffa516;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#ff0000;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    <path d="M29.9 12.1612C29.7789 11.788 29.5506 11.4586 29.2437 11.2141C28.9367 10.9696 28.5646 10.8208 28.1737 10.7862L20.75 10.1462L17.84 3.22624C17.6885 2.86314 17.4329 2.55298 17.1055 2.33482C16.7781 2.11665 16.3934 2.00024 16 2.00024C15.6065 2.00024 15.2219 2.11665 14.8945 2.33482C14.5671 2.55298 14.3115 2.86314 14.16 3.22624L11.2587 10.1462L3.82624 10.79C3.43379 10.823 3.0598 10.9711 2.75119 11.2158C2.44258 11.4604 2.21307 11.7908 2.09146 12.1654C1.96984 12.54 1.96153 12.9421 2.06756 13.3214C2.17359 13.7007 2.38925 14.0403 2.68749 14.2975L8.32624 19.225L6.63624 26.5425C6.54688 26.9254 6.57238 27.3262 6.70955 27.6947C6.84672 28.0632 7.08949 28.3831 7.40748 28.6144C7.72548 28.8457 8.10461 28.9782 8.49746 28.9951C8.89031 29.0121 9.27945 28.913 9.61624 28.71L15.9912 24.835L22.38 28.71C22.7168 28.913 23.1059 29.0121 23.4988 28.9951C23.8916 28.9782 24.2707 28.8457 24.5887 28.6144C24.9067 28.3831 25.1495 28.0632 25.2867 27.6947C25.4239 27.3262 25.4494 26.9254 25.36 26.5425L23.6712 19.2175L29.3087 14.2975C29.6069 14.0394 29.8222 13.6989 29.9274 13.3188C30.0326 12.9387 30.023 12.5359 29.9 12.1612ZM27.9975 12.7862L22.36 17.7062C22.0856 17.9449 21.8815 18.2539 21.7696 18.5999C21.6577 18.9459 21.6423 19.3159 21.725 19.67L23.4187 27L17.035 23.125C16.7235 22.9353 16.3659 22.835 16.0012 22.835C15.6366 22.835 15.2789 22.9353 14.9675 23.125L8.59249 27L10.275 19.675C10.3577 19.3209 10.3422 18.9509 10.2304 18.6049C10.1185 18.2589 9.91437 17.9499 9.63999 17.7112L3.99999 12.7937C3.99953 12.79 3.99953 12.7862 3.99999 12.7825L11.43 12.14C11.7927 12.108 12.1399 11.9776 12.434 11.7628C12.728 11.5481 12.9579 11.2571 13.0987 10.9212L16 4.00999L18.9 10.9212C19.0408 11.2571 19.2707 11.5481 19.5648 11.7628C19.8589 11.9776 20.206 12.108 20.5687 12.14L28 12.7825C28 12.7825 28 12.79 28 12.7912L27.9975 12.7862Z" fill="unset"/>
                </svg>
            </div>
            <img src="${icon}" alt="${item.name}" class="w-2/5 mx-auto dark:filter-white filter-black">
            <p class="font-Manrope font-semibold text-base dark:text-white text-black cursor-pointer hover:text-primary hover:dark:text-gray-300">${item.name}</p>
        </div>
    `;
}

const render = async (path) => {
    const data = await window.dokumentooborot.getFolder(path);
    const body = document.querySelector('[Body]');
    body.setAttribute('data-folder', path)
    tuggleLoading();
    if(data !== undefined) {
        renderNav(data.path);
        if(data.files !== undefined){
            const body = document.querySelector('[Body]');
            body.innerHTML = '';
            data.files.forEach((item) => {
                renderFiles(body, item);
            });
        }
        const folders = document.querySelectorAll('[data-type="directory"]');
        const files = document.querySelectorAll('[draggable="true"]');
        folders.forEach(folder => {
            folder.addEventListener('click', () => {
                tuggleLoading();
                const path = folder.getAttribute('data-path');
                render(path);
            })
        });
        files.forEach(file => {
            file.ondragstart = (event) => {
                event.preventDefault()
                window.electron.startDrag(file.getAttribute('data-name'),file.getAttribute('data-path'))
            }
        });
    }
}

const fileToBuffer = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            // Create a Buffer from the ArrayBuffer
            const arrayBuffer = event.target.result;
            const buffer = Buffer.from(arrayBuffer);
            resolve(buffer);
        };
        reader.onerror = function(err) {
            reject(new Error('Error reading file: ' + err.message));
        };
        // Read the file as an ArrayBuffer
        reader.readAsArrayBuffer(file);
    });
}

const getIcon = (type) => {
    type = type.toLowerCase();
    if(type === 'file') {
        return txt;
    }
    if(type === 'image') {
        return img;
    }
    if(type === 'jpg') {
        return jpg;
    }
    if(type === 'png') {
        return png;
    }
    if(type === 'ppt') {
        return ppt;
    }
    if(type === 'pdf') {
        return pdf;
    }
    if(type === 'xls') {
        return xls;
    }
    if(type === 'doc' || type === 'docx') {
        return doc;
    }
    if(type === 'zip') {
        return zip;
    }
    if(type === 'video') {
        return video;
    }
    if(type === 'audio') {
        return audio;
    }
    if (type === 'directory') {
        return folder;
    }

    return icon;
}