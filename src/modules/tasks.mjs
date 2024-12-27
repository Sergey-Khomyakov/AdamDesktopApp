export default function(data) {
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            data.forEach((item) => {
                const tasksWidget = document.querySelector('[tasks]');
                let colorSystem = "";
                const dateObject = new Date(item.data);
                switch (item.system) {
                    case "СБИС":
                        colorSystem = "bg-[#0c94ff]";
                        break;
                    case "1С":
                        colorSystem = "bg-[#c4161c]";
                        break;
                    case "iSpring":
                        colorSystem = "bg-[#29b958]";
                        break;
                    case "HelpDesk":
                        colorSystem = "bg-[#60c843]";
                        break;
                    case "Битрикс":
                        colorSystem = "bg-[#0bbbef]";
                        break;
                    default:
                        colorSystem = "bg-[#F2E8D5]";
                        break;
                }
                tasksWidget.innerHTML += `
                <div class="flex flex-col gap-1 pr-2">
                    <div class="flex gap-4">
                        <p class="font-Manrope font-semibold text-white dark:text-black text-base w-3/4">${item.name}</p>
                        <p class="font-Manrope font-semibold text-white  text-xs ${colorSystem} rounded-full px-2 py-1 h-max">${item.system}</p>
                    </div>
                    <div class="flex items-center gap-4 justify-between">
                        <p class="font-Manrope font-semibold text-white dark:text-black text-sm">${dateObject.toLocaleDateString('ru-RU', { month: 'long', day: 'numeric' })}</p>
                        <div flex items-center gap-2>
                            <button type="button" class="px-2 py-1 rounded-xl font-Manrope font-normal text-sm text-white dark:text-black hover:text-primary">Отклонить</button>
                            <button type="button" class="px-2 py-1 rounded-xl dark:bg-black bg-white font-Manrope font-normal text-sm text-black dark:text-white hover:text-primary hover:dark:text-gray-300">Согласовать</button>
                        </div>
                    </div>
                </div>
                `;
            });
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    });
}