import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import Jimp from "jimp";

(async () => {

    // Init the Express application
    const app = express();

    // Set the network port
    const port = process.env.PORT || 8082;

    // Use the body parser middleware for post requests
    app.use(bodyParser.json());

    app.get("/filteredimage", async (req: Request, res: Response) => {

        const url = req.query.image_url;

        if (!url) {
            return res.status(400).send("url is required");
        }

        try {
            await Jimp.read(url);
        } catch(e) {
            res.status(422).send("invalid url provided");
        }

        const image_path = await filterImageFromURL(url);
        res.status(200).sendFile(image_path, () : void => {
            deleteLocalFiles([image_path]);
        });
    });
    /**************************************************************************** */

    //! END @TODO1

    // Root Endpoint
    // Displays a simple message to the user
    app.get("/", async (req, res) => {
        res.send("try GET /filteredimage?image_url={{}}")
    });


    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
})();
