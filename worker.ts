import zipper from "./components/pdf/zipper";

addEventListener("message", (event) => {

    const msg = JSON.parse(event.data);
    const ret = zipper(msg).then((blobs) => {
        console.log(blobs);
        postMessage(blobs);

    })



});
