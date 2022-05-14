import zipper from "./components/pdf/zipper";

addEventListener("message", (event) => {

    const msg = JSON.parse(event.data);
    zipper(msg).then((blobs) => {
        postMessage(JSON.stringify({
            type: "zip",
            data: blobs,
        }));

    })


});
