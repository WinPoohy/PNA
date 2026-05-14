import { DesignListPage } from "./pages/design-list/index.js";
import { ProjectUtils } from "./utils/project-helpers.js";


const approvedTags = ["a", "b", "c", "ab", "bc", "abc"];
const projectStr = "abc";

const prefixCount = ProjectUtils.countMatchingPrefixes(approvedTags, projectStr);

console.log("=== (Задание 2.10) ===");
console.log("Проверяемая строка кода проекта:", projectStr);
console.log("База разрешенных префиксов МГТУ:", approvedTags);
console.log("Результат проверки: Найдено " + prefixCount + " префиксов.");
console.log("==================================================");

const root = document.getElementById('root');
const app = new DesignListPage(root);
app.render();
