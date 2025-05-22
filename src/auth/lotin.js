const translitMap = {
    "ch": "ч", "sh": "ш", "yo": "ё", "yu": "ю", "ya": "я", "ye": "е", "o'": "ў", "g'": "ғ",
    "ts": "ц", "a": "а", "b": "б", "d": "д", "e": "е", "f": "ф", "g": "г", "h": "ҳ",
    "i": "и", "j": "ж", "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "q": "қ",
    "r": "р", "s": "с", "t": "т", "u": "у", "v": "в", "x": "х", "y": "й", "z": "з", "'": "ъ",
    
    "Ch": "Ч", "Sh": "Ш", "Yo": "Ё", "Yu": "Ю", "Ya": "Я", "Ye": "Е", "O'": "Ў", "G'": "Ғ",
    "Ts": "Ц", "A": "А", "B": "Б", "D": "Д", "E": "Э", "F": "Ф", "G": "Г", "H": "Ҳ",
    "I": "И", "J": "Ж", "K": "К", "L": "Л", "M": "М", "N": "Н", "O": "О", "P": "П",
    "Q": "Қ", "R": "Р", "S": "С", "T": "Т", "U": "У", "V": "В", "X": "Х", "Y": "Й", "Z": "З"
};

// Kirildan lotinga teskari map
const reverseTranslitMap = Object.entries(translitMap).reduce((acc, [lat, cyr]) => {
    if (!acc[cyr]) {
        acc[cyr] = lat;
    }
    return acc;
}, {});

// Translatsiya funksiyasi
function transliterateToLatin(text) {
    const sortedKeys = Object.keys(reverseTranslitMap).sort((a, b) => b.length - a.length);
    let result = '';
    for (let i = 0; i < text.length;) {
        let matched = false;
        for (let key of sortedKeys) {
            if (text.startsWith(key, i)) {
                result += reverseTranslitMap[key];
                i += key.length;
                matched = true;
                break;
            }
        }
        if (!matched) {
            result += text[i];
            i++;
        }
    }
    return result;
}

// Eksport
export default transliterateToLatin;
