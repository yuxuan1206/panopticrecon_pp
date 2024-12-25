// 添加一个新的函数来初始化两个拖拽条
function initDrag(videoMerge, videoId) {
    var bcr = videoMerge.getBoundingClientRect();
    var position1 = 0.33; // 第一个条的位置
    var position2 = 0.66; // 第二个条的位置

    function trackLocation1(e) {
        position1 = Math.max(0, Math.min(1, (e.pageX - bcr.x) / bcr.width));
    }
    function trackLocation2(e) {
        position2 = Math.max(0, Math.min(1, (e.pageX - bcr.x) / bcr.width));
    }

    function trackLocationTouch1(e) {
        position1 = Math.max(0, Math.min(1, (e.touches[0].pageX - bcr.x) / bcr.width));
    }
    function trackLocationTouch2(e) {
        position2 = Math.max(0, Math.min(1, (e.touches[0].pageX - bcr.x) / bcr.width));
    }

    videoMerge.addEventListener("mousemove", trackLocation1, false);
    videoMerge.addEventListener("touchmove", trackLocationTouch1, false);
    videoMerge.addEventListener("mousemove", trackLocation2, false);
    videoMerge.addEventListener("touchmove", trackLocationTouch2, false);

    return { position1, position2 };
}

// 修改 playVids 函数以支持两个拖拽条
function playVids(videoId) {
    var videoMerge = document.getElementById(videoId + "Merge");
    var vid = document.getElementById(videoId);

    var { position1, position2 } = initDrag(videoMerge, videoId); // 初始化拖拽条

    var vidWidth = vid.videoWidth/3;
    var vidHeight = vid.videoHeight;

    var mergeContext = videoMerge.getContext("2d");

    if (vid.readyState > 3) {
        vid.play();

        function drawLoop() {
            mergeContext.clearRect(0, 0, videoMerge.width, videoMerge.height); // 清除画布

            // 绘制三个部分
            mergeContext.drawImage(vid, 0, 0, vidWidth, vidHeight, 0, 0, vidWidth, vidHeight);
            mergeContext.drawImage(vid, vidWidth, 0, vidWidth, vidHeight, position1 * vidWidth, 0, vidWidth, vidHeight);
            mergeContext.drawImage(vid, vidWidth*2, 0, vidWidth, vidHeight, position2 * vidWidth, 0, vidWidth, vidHeight);

            // 绘制两个拖拽条
            drawBar(position1, vidWidth, vidHeight);
            drawBar(position2, vidWidth, vidHeight);

            requestAnimationFrame(drawLoop);
        }
        requestAnimationFrame(drawLoop);
    }
}

// 添加一个函数来绘制拖拽条
function drawBar(position, vidWidth, vidHeight) {
    var arrowLength = 0.09 * vidHeight;
    var arrowheadWidth = 0.025 * vidHeight;
    var arrowheadLength = 0.04 * vidHeight;
    var arrowPosY = vidHeight / 10;
    var arrowWidth = 0.007 * vidHeight;
    var currX = position * vidWidth;

    var mergeContext = document.getElementById("teaserMerge").getContext("2d");

    // Draw circle
    mergeContext.beginPath();
    mergeContext.arc(currX, arrowPosY, arrowLength*0.7, 0, Math.PI * 2, false);
    mergeContext.fillStyle = "#FFD79340";
    mergeContext.fill();

    // Draw border
    mergeContext.beginPath();
    mergeContext.moveTo(currX, 0);
    mergeContext.lineTo(currX, vidHeight);
    mergeContext.closePath();
    mergeContext.strokeStyle = "#AAAAAA";
    mergeContext.lineWidth = 4;
    mergeContext.stroke();

    // Draw arrow
    mergeContext.beginPath();
    mergeContext.moveTo(currX, arrowPosY - arrowWidth/2);

    // Move right until meeting arrow head
    mergeContext.lineTo(currX + arrowLength/2 - arrowheadLength/2, arrowPosY - arrowWidth/2);

    // Draw right arrow head
    mergeContext.lineTo(currX + arrowLength/2 - arrowheadLength/2, arrowPosY - arrowheadWidth/2);
    mergeContext.lineTo(currX + arrowLength/2, arrowPosY);
    mergeContext.lineTo(currX + arrowLength/2 - arrowheadLength/2, arrowPosY + arrowheadWidth/2);
    mergeContext.lineTo(currX + arrowLength/2 - arrowheadLength/2, arrowPosY + arrowWidth/2);

    // Go back to the left until meeting left arrow head
    mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY + arrowWidth/2);

    // Draw left arrow head
    mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY + arrowheadWidth/2);
    mergeContext.lineTo(currX - arrowLength/2, arrowPosY);
    mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY  - arrowheadWidth/2);
    mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY);

    mergeContext.lineTo(currX - arrowLength/2 + arrowheadLength/2, arrowPosY - arrowWidth/2);
    mergeContext.lineTo(currX, arrowPosY - arrowWidth/2);

    mergeContext.closePath();
    mergeContext.fillStyle = "#AAAAAA";
    mergeContext.fill();
}

// 修改 resizeAndPlay 函数以支持两个拖拽条
function resizeAndPlay(element) {
    var cv = document.getElementById(element.id + "Merge");
    cv.width = element.videoWidth/3; // 修改宽度为1/3
    cv.height = element.videoHeight;
    element.play();
    element.style.height = "0px";  // Hide video without stopping it

    playVids(element.id);
}