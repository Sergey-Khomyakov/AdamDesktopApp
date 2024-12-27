export default function() {
    document.addEventListener('DOMContentLoaded', async () => {
        const tabBlock = document.querySelector('[tabBlock]');
        const tabs = tabBlock.querySelectorAll('[tab]');

        tabs.forEach((tab, index) => {
            tab.addEventListener('click', (event) => {
                const item = event.currentTarget;
                const tabStatus = item.getAttribute('data-tab-status');
                if(tabStatus === 'false') {
                    const oldActive = item.closest('[tabBlock]').querySelector('[tab][data-tab-status="true"]');
                    const oldContentBlock = item.closest('[tabBlock]').querySelector('[tabContent="'+ oldActive.getAttribute('tab') +'"]');
                    const newContentBlock = item.closest('[tabBlock]').querySelector('[tabContent="'+ item.getAttribute('tab') +'"]');


                    oldActive.setAttribute('data-tab-status', 'false');
                    oldActive.classList.remove('border-b-2');
                    oldActive.classList.remove('border-primary');
                    oldActive.classList.remove('outline-offset-2');
                    oldContentBlock.classList.add('hidden');
                    oldContentBlock.classList.remove('flex');

                    newContentBlock.classList.remove('hidden');
                    newContentBlock.classList.remove('flex');

                    item.setAttribute('data-tab-status', 'true');
                    item.classList.add('border-b-2');
                    item.classList.add('border-primary');
                    item.classList.add('outline-offset-2');

                }
            });
        });
    });
}