import roomZipper from "./components/pdf/roomZipper";

addEventListener("message", (event) => {

    const msg = JSON.parse(event.data);
    const ret = roomZipper(msg).then((blobs) => {
        console.log(blobs);
        postMessage(blobs);
    })
});
