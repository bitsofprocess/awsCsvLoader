module.exports.getAllowedProperties = async (game_code) => {

    let column_names = [];

    switch (game_code) {
    case "CAPTIONS":
        column_names = ["id", "url"];
        break;
    case "CT":
        column_names = [
        "id",
        "answers",
        "category",
        "correct_answer",
        "prompt",
        "url",
        ];
        break;
    case "FLUS":
        column_names = ["id", "points", "question", "special"];
        break;
    case "LT":
        column_names = [
            "id", 
            "answers", 
            "correct_answer", 
            "question", 
            "edition"
        ];
        break;
    case "NOW":
        column_names = ["id", "word"];
        break;
    case "PLAYDECK":
        column_names = [
        "id",
        "deck_name",
        "deck_type",
        "game_code",
        "rating",
        "safe_for_work",
        "search_term",
        "text",
        "url",
        ];
        break;
    case "PROMPTDECK":
        column_names = [
        "id",
        "deck_name",
        "deck_type",
        "game_code",
        "rating",
        "safe_for_work",
        "text",
        "url",
        ];
        break;
    case "TOT":
        column_names = ["id", "category", "word"];
        break;
    default:
        console.log('Requested game code not present.')
    };

    return column_names;
};

