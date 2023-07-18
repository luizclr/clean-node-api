import "dotenv/config";

import app from "~/main/config/app";

const PORT = process.env.PORT || 8080;

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log(`app running on port ${PORT}...`));
