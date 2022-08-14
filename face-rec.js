const video=document.querySelector('[data-video]');


Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('models'),
    faceapi.nets.faceExpressionNet.loadFromUri('models')
]).then(startVideo)

async function startVideo(){
    let stream=null;

    try {
        stream=await navigator.mediaDevices.getUserMedia({audio:false,video:true})
        video.srcObject=stream
    } catch (error) {
        alert(error)
    }
    
}

video.addEventListener('play',()=>{
    const canvas=faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)

    const dimension={width:video.width,height:video.height}
    faceapi.matchDimensions(canvas,dimension)

    setInterval(async ()=>{
        const detecions = await faceapi.detectAllFaces(video,new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const resizedDetections=faceapi.resizeResults(detecions,dimension)

        canvas.getContext("2d").clearRect(0,0,canvas.width,canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        
    },100)
})

// async function detectingFace(){
//     const detecions = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()
     
// }
