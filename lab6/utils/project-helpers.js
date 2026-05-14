export class ProjectUtils {
    /**
     * Задание 1.9
     * @param {number} count - размер массива
     * @param {string} projectTitle - название проекта
     */
    static fillProjectCopies(count, projectTitle) {
        let copies = [];
        let i = 0;
        do {
            if (count === 0) break;
            copies.push(`${projectTitle} (Экземпляр №${i + 1})`);
            i++;
        } while (i < count);

        return copies;
    }

    /**
     * Задание 1.7
     */
    static isEqualConfig(configA, configB) {
        const keysA = Object.keys(configA);
        const keysB = Object.keys(configB);

        if (keysA.length !== keysB.length) return false;

        for (let key of keysA) {
            if (configA[key] !== configB[key]) return false;
        }
        return true;
    }
        /**
     * @param {string[]} designTags - массив утвержденных префиксов
     * @param {string} fullProjectCode - полный идентификатор проекта
     * @returns {number} - количество совпадений
     */
        static countMatchingPrefixes(words, str) {
            let count = 0;
            for (let word of words) {
                if (str.startsWith(word)) {
                    count++;
                }
            }
            return count;
        }

    static rleEncode(serialCode) {
        if (serialCode.length === 0) return "";
        let result = "";
        let count = 1;
        for (let i = 1; i <= serialCode.length; i++) {
            if (i < serialCode.length && serialCode[i] === serialCode[i - 1]) {
                count++;
            } else {
                result += serialCode[i - 1] + count;
                count = 1;
            }
        }
        return result;
    }
}
