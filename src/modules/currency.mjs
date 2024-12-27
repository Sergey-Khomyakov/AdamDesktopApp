import USA from '../assets/currency/USD.svg';
import EUR from '../assets/currency/EUR.svg';
import KZT from '../assets/currency/KZT.svg';
import CNY from '../assets/currency/CNY.svg';

export default function() {
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            const data = await window.api.currency();
            if(data !== undefined) {
                const currency = data.ValCurs.Valute.filter((item) => item.CharCode._text === 'USD' || item.CharCode._text === 'EUR' || item.CharCode._text === 'KZT' || item.CharCode._text === 'CNY');
                const currencyWidget = document.querySelector('[currencyWidget]');
                currency.forEach((item) => {
                    const src = item.CharCode._text === 'USD' ? USA : item.CharCode._text === 'EUR' ? EUR : item.CharCode._text === 'KZT' ? KZT : CNY;
                    currencyWidget.innerHTML += `
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <img src="${src}" alt="${item.CharCode._text}" class="w-8 h-8 filter-white dark:filter-black">
                            <p class="font-Manrope font-semibold text-white dark:text-black">${item.Name._text}</p>
                        </div>
                        <p class="font-Manrope font-semibold text-white dark:text-black text-xl">${Math.round(parseFloat(item.Value._text))}</p>
                    </div>
                    `;
                });
            }
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
    });
}