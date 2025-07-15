const translitMap = {
    // Maxsus harf juftliklari (2 harfli kombinatsiyalar)
    "sh": "ш", "Sh": "Ш", "SH": "Ш",
    "ch": "ч", "Ch": "Ч", "CH": "Ч",
    "yo'": "ё", "Yo'": "Ё", "YO'": "Ё","yo'": "ё", "Yoʻ": "Ё", "YOʻ": "Ё",
    "yu": "ю", "Yu": "Ю", "YU": "Ю",
    "ya": "я", "Ya": "Я", "YA": "Я",
    "ye": "е", "Ye": "Е", "YE": "Е",
    "o'": "ў", "oʻ": "ў", "Oʻ": "Ў",
    "g'": "ғ", "G'": "Ғ",

    // Bir harfli kichik harflar
    "a": "а", "b": "б", "d": "д", /* "e": "e", <-- BU YERNI O‘CHIRAMIZ */ 
    "f": "ф", "g": "г", "h": "ҳ",
    "i": "и", "j": "ж", "k": "к", "l": "л", "m": "м", "n": "н", "o": "о",
    "p": "п", "q": "қ", "r": "р", "s": "с", "t": "т", "u": "у", "v": "в",
    "x": "х", "y": "й", "z": "з", "'": "ъ","ʻ": "ъ",

    // Bir harfli katta harflar
    // "E": "E", <-- BU YERNI HAM O‘CHIRAMIZ
    "A": "А", "B": "Б", "D": "Д", "F": "Ф", "G": "Г", "H": "Ҳ",
    "I": "И", "J": "Ж", "K": "К", "L": "Л", "M": "М", "N": "Н", "O": "О",
    "P": "П", "Q": "Қ", "R": "Р", "S": "С", "T": "Т", "U": "У", "V": "В",
    "X": "Х", "Y": "Й", "Z": "З" ,'O‘': 'Ў' ,"O'":"Ў"
};

// Teskari map yaratish (krildan lotinga)
const reverseTranslitMap = {};
for (const [latin, cyrillic] of Object.entries(translitMap)) {
    reverseTranslitMap[cyrillic] = latin;
}

// Maxsus holatlar uchun qo'shimcha mappinglar
const specialMappings = {
    // Krildan lotinga
    "э": "e", "Э": "E"
};

// Teskari maxsus mappinglar
const reverseSpecialMappings = {
    // Lotindan krilga (so'z boshida)
    "e": "э", "E": "Э"
};

// Matnning qaysi tilda ekanligini aniqlash
const detectScript = (text) => {
    const cyrillicRegex = /[а-яё]/i;
    const latinRegex = /[a-z]/i;
    
    const cyrillicCount = (text.match(cyrillicRegex) || []).length;
    const latinCount = (text.match(latinRegex) || []).length;
    
    if (cyrillicCount > latinCount) {
        return 'cyrillic';
    } else if (latinCount > cyrillicCount) {
        return 'latin';
    } else {
        return 'mixed'; // Aralash yoki aniqlab bo'lmasa
    }
};

// Lotindan krilga transliteratsiya
const latinToCyrillic = (text) => {
    let translated = text;
    
    // So'z boshidagi "e" → "э", "E" → "Э"
    translated = translated.replace(/\b[e]/g, "э").replace(/\b[E]/g, "Э");
    
    // Harf juftliklari (ikki harfli kombinatsiyalar)
    const twoLetterKeys = Object.keys(translitMap).filter(key => key.length === 2);
    const oneLetterKeys = Object.keys(translitMap).filter(key => key.length === 1);
    
    for (const key of twoLetterKeys) {
        const regex = new RegExp(key, "g");
        translated = translated?.replace(regex, translitMap[key]);
    }
    
    for (const key of oneLetterKeys) {
        const regex = new RegExp(key, "g");
        translated = translated?.replace(regex, translitMap[key]);
    }
    
    return translated;
};

// Krildan lotinga transliteratsiya
const cyrillicToLatin = (text) => {
    let translated = text;
    
    // Maxsus harflar (э → e, Э → E)
    for (const [cyrillic, latin] of Object.entries(specialMappings)) {
        const regex = new RegExp(cyrillic, "g");
        translated = translated.replace(regex, latin);
    }
    
    // Ikki harfli kombinatsiyalarni avval almashtiramiz
    const twoLetterKeys = Object.keys(reverseTranslitMap).filter(key => key.length === 2);
    const oneLetterKeys = Object.keys(reverseTranslitMap).filter(key => key.length === 1);
    
    for (const key of twoLetterKeys) {
        const regex = new RegExp(key, "g");
        translated = translated.replace(regex, reverseTranslitMap[key]);
    }
    
    for (const key of oneLetterKeys) {
        const regex = new RegExp(key, "g");
        translated = translated.replace(regex, reverseTranslitMap[key]);
    }
    
    return translated;
};

// Asosiy transliteratsiya funksiyasi
const translateText = (text) => {
    if (!text || typeof text !== 'string') {
        return text;
    }
    
    // localStorage dan til sozlamasini olish
    const language = localStorage.getItem('til');
    
    if (language === 'datakril') {
        // Har doim kril harfda qaytarish
        return latinToCyrillic(text);
    } else if (language === 'datalotin') {
        // Har doim lotin harfda qaytarish
        return cyrillicToLatin(text);
    } else {
        // Agar localStorage da til sozlamasi yo'q bo'lsa, avtomatik aniqlash
        const script = detectScript(text);
        
        if (script === 'cyrillic') {
            return cyrillicToLatin(text);
        } else if (script === 'latin') {
            return latinToCyrillic(text);
        } else {
            // Aralash matn uchun, lotindan krilga o'tkazamiz (default)
            return latinToCyrillic(text);
        }
    }
};

export default translateText;