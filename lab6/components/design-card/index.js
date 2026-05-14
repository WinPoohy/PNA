export class DesignCardComponent {
    constructor(parent) { this.parent = parent; }

    getHTML(data) {
        return `
            <div class="card clickable-card m-2" id="card-${data.id}" style="width: 18rem; cursor: pointer; transition: 0.3s;">
                <img src="${data.src}" class="card-img-top" style="height: 180px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${data.title}</h5>
                    <!-- Кнопка по заданию (Вариант 5 - Информер) -->
                    <button type="button" class="btn btn-info btn-sm"
                            id="popover-${data.id}"
                            data-bs-toggle="popover"
                            data-bs-trigger="focus"
                            title="Помощь"
                            data-bs-content="${data.popoverText}">
                        ?
                    </button>
                    <small class="text-muted ms-2">Кликните для деталей</small>
                </div>
            </div>`;
    }

    render(data, listener) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));

        const card = document.getElementById(`card-${data.id}`);
        const popoverBtn = document.getElementById(`popover-${data.id}`);

        card.addEventListener('click', (e) => {
            if (e.target === popoverBtn) return;
            listener(data.id);
        });

        // информер
        new bootstrap.Popover(popoverBtn);
    }
}
