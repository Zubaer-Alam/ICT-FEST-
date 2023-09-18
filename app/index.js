const app = require("./app");
require("dotenv").config();

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`App is running @http://localhost:${PORT}`);
});