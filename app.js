document.addEventListener('DOMContentLoaded', () => {
    // 1. COnfiguración inicial
    const languageSelector = document.getElementById('language-selector');
    const defaultLang = 'en';  // Idioma por defecto (fallback)
    const suppoortedLangs = ['en', 'es', 'pt', 'hi', 'sw'];  // Idiomas soportados

    // Diccionario de enlaces a los cursos por idioma
    const courseUrls = {
        'es': 'https://seed.iica.int/course/view.php?id=155',
        'en': 'https://seed.iica.int/enrol/index.php?id=153',
        'pt': 'https://seed.iica.int/enrol/index.php?id=156',
        'hi': 'https://seed.iica.int/enrol/index.php?id=157',
        'sw': 'https://seed.iica.int/enrol/index.php?id=158',
    }

    // 2. Función para determinar el idioma del navegador
    function getInitialLanguage() {
        // Revisar si el usuario ya había elegido un idioma previamente
        const savedLang = localStorage.getItem('selectedLang');
        if (savedLang && suppoortedLangs.includes(savedLang)) {
            return savedLang;
        }

        // Detectar el idioma del navegador del usuario
        const browserLang = navigator.language.slice(0, 2); // Obtener solo el código de idioma (ej. "en" de "en-US")
        if (suppoortedLangs.includes(browserLang)) {
            return browserLang;
        }

        // Si no coincide nada, se carga inglés por defecto
        return defaultLang;
    }

    // 3. Función principal que carga el JSON y actualiza la pantalla
    async function loadLanguage(lang) {
        try {
            // Petición para traer el archivo JSON
            const response = await fetch(`./lang/${lang}.json`);

            // Si hay un error en la petición, lanzar una excepción
            if (!response.ok) throw new Error(`Error al cargar el archivo de idioma: ${lang}.json`);

            // Convertir la respuesta en un objeto JavaScript
            const translations = await response.json();

            // Reemplazo de textos
            // Recorrer cada llave del JSON y buscar el ID equivalente en el HTML para actualizar su contenido
            for (const key in translations) {
                const element = document.getElementById(key);
                if (element) {
                    element.textContent = translations[key];
                }
            }

            // Actualización de enlaces dinámicos
            // Asegurarse que el botón del Hero lleve al curso en el idioma correcto
            const courseCta = document.getElementById('hero-cta');
            if (courseCta && courseUrls[lang]) {
                courseCta.href = courseUrls[lang];
            }

            // Sincronizar el menú desplegable visualmente con el idioma cargado
            languageSelector.value = lang;

            // Guardar la preferencia del idioma seleccionado para futuras visitas
            localStorage.setItem('selectedLang', lang);

            // Actualizar la etiqueta <html> para SEO y accesibilidad
            document.documentElement.lang = lang;
        
        } catch (error) {
            console.error("Error en el sistema de idiomas:", error);
            // Si algo falla, cargar el idioma por defecto para asegurar que la página siga siendo funcional
            if (lang !== defaultLang) {
                loadLanguage(defaultLang);
            }
        }
    }
    // 4. Inicialización al abrir la página
    const currentLang = getInitialLanguage();
    loadLanguage(currentLang);

    // 5. Detectar cuando el usuario cambie el idioma en el menú desplegable
    languageSelector.addEventListener('change', (event) => {
        const selectedLang = event.target.value;
        loadLanguage(selectedLang);
    });
});