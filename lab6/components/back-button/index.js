export class BackButtonComponent {
    constructor(parent) { this.parent = parent; }

    render(listener) {
        this.parent.insertAdjacentHTML('beforeend', `<button id="back-btn" class="btn btn-secondary mb-3">← Назад к списку</button>`);
        document.getElementById("back-btn").addEventListener("click", listener);
    }
}
