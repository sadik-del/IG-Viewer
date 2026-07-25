function decodeInstagramText(text) {

    if (!text) return "";

    try {

        return new TextDecoder("utf-8").decode(
            new Uint8Array([...text].map(c => c.charCodeAt(0)))
        );

    } catch (e) {

        try {
            return decodeURIComponent(escape(text));
        } catch {

            return text;

        }

    }

}

function formatTime(timestamp) {

    const date = new Date(timestamp);

    return date.toLocaleTimeString([], {

        hour: "numeric",

        minute: "2-digit"

    });

}

function formatDate(timestamp) {

    const date = new Date(timestamp);

    return date.toLocaleDateString([], {

        day: "numeric",

        month: "long",

        year: "numeric"

    });

}