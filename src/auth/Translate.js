const translitMap = {
    "ch": "ч", "sh": "ш","Sh": "Ш", "yo": "ё", "yu": "ю", "ya": "я", "ye": "е", "o'": "ў", "g'": "ғ",
    "a": "а", "b": "б", "d": "д", "e": "e", "f": "ф", "g": "г", "h": "ҳ", "i": "и", "j": "ж",
    "k": "к", "l": "л", "m": "м", "n": "н", "o": "о", "p": "п", "q": "қ", "r": "р", "s": "с",
    "t": "т", "u": "у", "v": "в", "x": "х", "y": "й", "z": "з", "'": "ъ",
    "CH": "Ч","Ch": "Ч", "SH": "Ш", "YO": "Ё", "YU": "Ю", "YA": "Я", "YE": "Е", "O'": "Ў", "G'": "Ғ",
    "A": "А", "B": "Б", "D": "Д", "E": "Э", "F": "Ф", "G": "Г", "H": "Ҳ", "I": "И", "J": "Ж",
    "K": "К", "L": "Л", "M": "М", "N": "Н", "O": "О", "P": "П", "Q": "Қ", "R": "Р", "S": "С",
    "T": "Т", "U": "У", "V": "В", "X": "Х", "Y": "Й", "Z": "З"
};

const translateText = (text) => {
    let translated = text; 
    const twoLetterKeys = Object.keys(translitMap).filter(key => key.length === 2);
    const oneLetterKeys = Object.keys(translitMap).filter(key => key.length === 1);
    for (const key of twoLetterKeys) {
        const regex = new RegExp(key, "g");
        translated = translated.replace(regex, translitMap[key]);
    }
    for (const key of oneLetterKeys) {
        const regex = new RegExp(key, "g");
        translated = translated.replace(regex, translitMap[key]);
    }

    return translated;
};

export default translateText;