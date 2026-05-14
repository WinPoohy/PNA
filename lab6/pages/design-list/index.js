import { DesignCardComponent } from "../../components/design-card/index.js";
import { DesignItemPage } from "../design-item/index.js";

export class DesignListPage {
    constructor(parent) {
        this.parent = parent;
    }

    async getData() {
        try {
            const response = await fetch('/stocks');
            const data = await response.json();
            console.log("Данные от сервера:", data); // Убедись, что они пришли
            return data;
        } catch (error) {
            console.error("Карточки не долетели:", error);
            return [];
        }
    }
    async render() {
        this.parent.innerHTML = '';
        const data = await this.getData();

        // Создаем контейнер-сетку для карточек
        this.parent.insertAdjacentHTML('beforeend', `<div id="main-page" class="d-flex flex-wrap justify-content-center"></div>`);
        const pageRoot = document.getElementById('main-page');

        data.forEach((item) => {
            const productCard = new DesignCardComponent(pageRoot);
            // Передаем данные и обработчик клика
            productCard.render(item, this.clickCard.bind(this));
        });
    }

    clickCard(id) {
        // Переход на страницу предмета
        const productPage = new DesignItemPage(this.parent, id);
        productPage.render();
    }
}
