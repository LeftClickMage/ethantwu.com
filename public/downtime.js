function downtime(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}