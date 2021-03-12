module.exports = {
    format_date: date => {
        // same logic as before...
    },
    format_plural: (word, amount) => {
        if (amount !== 1) {
            return `${word}s`;
        }

        return word;
    }
}