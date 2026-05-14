import { DesignListPage } from "./pages/design-list/index.js";

const root = document.getElementById('root');
const app = new DesignListPage(root);

// Запуск приложения
app.render();
