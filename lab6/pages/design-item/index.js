import { ProjectUtils } from "../../utils/project-helpers.js";
import { DesignListPage } from "../design-list/index.js";
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const approvedTags = ["a", "b", "c", "ab", "bc", "abc"];
const projectStr = "abc";

const prefixCount = ProjectUtils.countMatchingPrefixes(approvedTags, projectStr);
const root = document.getElementById('root');


window.runPrefixes = (wordsString, str) => {
    // Превращаем строку слов в массив
    const wordsArray = wordsString.split(',').map(item => item.trim());
    const count = ProjectUtils.countMatchingPrefixes(wordsArray, str);

    console.log("%c [Нормоконтроль 2.10] ", "background: #0066da; color: white;");
    console.log("Входной массив (words):", wordsArray);
    console.log("Строка для поиска (str):", str);
    console.log("Найдено совпадений:", count);
    return "Проверка завершена.";
};


window.runRLE = (code) => {
    const result = ProjectUtils.rleEncode(code);
    console.log("%c [Сжатие RLE] ", "background: #28a745; color: white;", "Результат:", result);
    return "Кодирование завершено.";
};

console.log("%c ИНСТРУКЦИЯ ПО ПРОВЕРКЕ ДЗ (Консоль) ", "background: #ffffff; color: #gold; padding: 5px;");
console.log("Чтобы проверить RLE (3.6), введи: %crunRLE('AAAAAABBB')", "color: #000000; font-weight: bold;");
console.log("Чтобы проверить префиксы (2.10), введи: %crunPrefixes('a,b,abc', 'abc')", "color: #000000; font-weight: bold;");
console.log("-----------------------------------------");

export class DesignItemPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    async getStockData() {
        try {
            const response = await fetch(`/stocks/${this.id}`);
            return await response.json();
        } catch (error) {
            console.error("Ошибка получения данных карточки:", error);
        }
    }

    verifyProjectSpecs() {
        const standardSpecs = { type: "Дизайн", platform: "Бауманка" };
        const currentProjectSpecs = { type: "Дизайн", platform: "Бауманка" };
        const isVerified = ProjectUtils.isEqualConfig(standardSpecs, currentProjectSpecs);
        return isVerified ? "✅ ТЗ соответствует стандартам МГТУ" : "❌ Ошибка в параметрах ТЗ";
    }

    // Делаем метод render АСИНХРОННЫМ
    async render() {
        this.parent.innerHTML = '';

        // 1. Получаем свежие данные с бэкенда
        const stockData = await this.getStockData();

        this.parent.innerHTML = `
            <button id="back-btn" class="btn btn-outline-secondary mb-3">Назад</button>
            <div class="row">
                <div class="col-md-6">
                    <h2 id="project-title">${stockData.title} (Проект №${this.id})</h2>
                    <div class="alert alert-info">${this.verifyProjectSpecs()}</div>

                    <!-- Тут картинка из базы данных -->
                    <img src="${stockData.src}" class="img-fluid rounded mb-3" style="max-height: 200px">

                    <div id="three-container" style="width: 100%; height: 400px; border: 1px solid #ddd; background: #eee;"></div>
                </div>
                <div class="col-md-6">
                    <h4>Информация о проекте:</h4>
                    <p class="lead">${stockData.info}</p>
                    <hr>
                    <h4>Результаты работы функций (1.7, 1.9)</h4>
                    <ul id="copy-list" class="list-group"></ul>
                </div>
            </div>
        `;

        // 1.9 (Копии чертежа)
        const copies = ProjectUtils.fillProjectCopies(3, `Чертеж детали: ${stockData.title}`);
        const list = document.getElementById('copy-list');
        copies.forEach(text => {
            list.insertAdjacentHTML('beforeend', `<li class="list-group-item small">${text}</li>`);
        });

        this.init3D();

        document.getElementById('back-btn').onclick = () => {
            const listPage = new DesignListPage(this.parent);
            listPage.render();
        };
    }

    init3D() {
        const container = document.getElementById('three-container');
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf4f7f9);

        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(5, 5, 5); // Позиция камеры, чтобы увидеть модель целиком

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // СВЕТ: Модели .glb требуют хорошего освещения
        const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Мягкий общий свет
        scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 2);
        sunLight.position.set(5, 10, 7);
        scene.add(sunLight);

        // --- ЗАГРУЗКА ТВОЕЙ МОДЕЛИ ---
        const loader = new GLTFLoader();

        // Указываем путь к файлу.
        // Важно: путь считается от файла design.html (который в корне), поэтому пишем assets/...
        loader.load('/assets/tablehall.glb', (gltf) => {
            const model = gltf.scene;

            // Масштабируем модель, если она слишком большая или маленькая
            model.scale.set(1, 1, 1);

            // Центрируем модель
            scene.add(model);

            console.log("Модель tablehall загружена успешно!");
        },
        (xhr) => {
            // Можно выводить процент загрузки в консоль
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            console.error('Ошибка загрузки модели:', error);
        });

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();
    }

}
