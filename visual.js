/* 
March 15t, 2022 - Madrid Spain
@version 1.0
@mincrypt Dr. Alfonso Muñoz
@muruenya Dr. Manuel Urueña
GNU Lesser General Public License v3.0
*/

const COLORS = [ 'red', 'green', 'blue' ];

var imageLoaded = false;
var selectedColors = [];
var selectedColorsOffset = [];
var selectedBits = [];
var selectedBitMask = 0x00;

updateExtractButton();

const debug = false;


function loadImageFile(input) {
    //const input = document.getElementById("inputImageFile");
    const file = input.files[0];
    const filename = file.name;
    const mimeType = file.type;

    console.log(file)

    document.title = "Visual steganalisys of '" + filename + "'"
    
    const rgbImg = document.getElementById("rgbImg");
    rgbImg.onload = function() {
	const imgW = rgbImg.naturalWidth;
	const imgH = rgbImg.naturalHeight;

        drawColors(rgbImg, imgW, imgH);
	
	for (let i = 7; i >= 0; i--) {
	    drawLSB(rgbImg, imgW, imgH, i);
	}

	imageLoaded = true;
	updateExtractButton();
    }
    rgbImg.src = URL.createObjectURL(file);
}


function drawColors(img, width, height)
{
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, width, height);
    const imgPixels = imgData.data;

    const redData = ctx.createImageData(width, height);
    const redPixels = redData.data;

    const greenData = ctx.createImageData(width, height);
    const greenPixels = greenData.data;

    const blueData = ctx.createImageData(width, height);    
    const bluePixels = blueData.data;

    //console.log(imgPixels.length, width * height * 4);

    for (let i = 0; i < imgPixels.length; i += 4) {
	red_i   = imgPixels[i];
	green_i = imgPixels[i + 1];
	blue_i  = imgPixels[i + 2];
	alpha_i = imgPixels[i + 3];
	
	redPixels[i]   = red_i;
	redPixels[i+1] = red_i;
	redPixels[i+2] = red_i;
	redPixels[i+3] = 255;

    	greenPixels[i]   = green_i;
	greenPixels[i+1] = green_i;
	greenPixels[i+2] = green_i;
	greenPixels[i+3] = 255;

    	bluePixels[i]   = blue_i;
	bluePixels[i+1] = blue_i;
	bluePixels[i+2] = blue_i;
	bluePixels[i+3] = 255;
    }
    
    ctx.putImageData(redData, 0, 0);
    const redImg = document.getElementById("redImg");
    redImg.src = canvas.toDataURL('image/png');

    ctx.putImageData(greenData, 0, 0);
    const greenImg = document.getElementById("greenImg");
    greenImg.src = canvas.toDataURL('image/png');

    ctx.putImageData(blueData, 0, 0);
    const blueImg = document.getElementById("blueImg");
    blueImg.src = canvas.toDataURL('image/png');
}


function drawLSB(img, width, height, bit)
{
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const rgbData = ctx.getImageData(0, 0, width, height);
    const rgbPixels = rgbData.data;

    const redData = ctx.createImageData(width, height);
    const redPixels = redData.data;

    const greenData = ctx.createImageData(width, height);
    const greenPixels = greenData.data;

    const blueData = ctx.createImageData(width, height);    
    const bluePixels = blueData.data;

    mask = 0x01 << bit;
    //console.log(mask);

    for (var i = 0; i < rgbPixels.length; i += 4) {
	red_i   = ((rgbPixels[i]     & mask) == 0x00)? 0 : 255;
	green_i = ((rgbPixels[i + 1] & mask) == 0x00)? 0 : 255;
	blue_i  = ((rgbPixels[i + 2] & mask) == 0x00)? 0 : 255;
	alpha_i = ((rgbPixels[i + 3] & mask) == 0x00)? 0 : 255;
	
	rgbPixels[i]   = red_i;
	rgbPixels[i+1] = green_i;
	rgbPixels[i+2] = blue_i;
	rgbPixels[i+3] = 255;

	redPixels[i]   = red_i;
	redPixels[i+1] = red_i;
	redPixels[i+2] = red_i;
	redPixels[i+3] = 255;

    	greenPixels[i]   = green_i;
	greenPixels[i+1] = green_i;
	greenPixels[i+2] = green_i;
	greenPixels[i+3] = 255;

    	bluePixels[i]   = blue_i;
	bluePixels[i+1] = blue_i;
	bluePixels[i+2] = blue_i;
	bluePixels[i+3] = 255;
    }
    
    ctx.putImageData(rgbData, 0, 0);
    const rgbImg = document.getElementById("rgb" + bit + "Img");
    rgbImg.src = canvas.toDataURL('image/png');

    ctx.putImageData(redData, 0, 0);
    const redImg = document.getElementById("red" + bit + "Img");
    redImg.src = canvas.toDataURL('image/png');

    ctx.putImageData(greenData, 0, 0);
    const greenImg = document.getElementById("green" + bit + "Img");
    greenImg.src = canvas.toDataURL('image/png');

    ctx.putImageData(blueData, 0, 0);
    const blueImg = document.getElementById("blue" + bit + "Img");
    blueImg.src = canvas.toDataURL('image/png');
}


function onColorCheckboxClick(cb)
{
    //console.log(cb);

    var cb_id = cb.id;
    var cb_checked = cb.checked;

    var rgbCB1 = document.getElementById("rgbCheckbox1");
    var redCB1 = document.getElementById("redCheckbox1");
    var greenCB1 = document.getElementById("greenCheckbox1");
    var blueCB1 = document.getElementById("blueCheckbox1");

    var rgbCB2 = document.getElementById("rgbCheckbox2");
    var redCB2 = document.getElementById("redCheckbox2");
    var greenCB2 = document.getElementById("greenCheckbox2");
    var blueCB2 = document.getElementById("blueCheckbox2");

    if (cb_id === "rgbCheckbox1") {
	rgbCB2.checked = cb_checked;

	redCB1.checked = cb_checked;
	redCB2.checked = cb_checked;
	greenCB1.checked = cb_checked;
	greenCB2.checked = cb_checked;
	blueCB1.checked = cb_checked;
	blueCB2.checked = cb_checked;
    } else if (cb_id === "rgbCheckbox2") {
	rgbCB1.checked = cb_checked;
	
	redCB1.checked = cb_checked;
	redCB2.checked = cb_checked;
	greenCB1.checked = cb_checked;
	greenCB2.checked = cb_checked;
	blueCB1.checked = cb_checked;
	blueCB2.checked = cb_checked;
    } else if (cb_id === "redCheckbox1") {
	redCB2.checked = cb_checked;	
	rgbCB1.checked = false;
	rgbCB2.checked = false;
    } else if (cb_id === "redCheckbox2") {
	redCB1.checked = cb_checked;	
	rgbCB1.checked = false;
	rgbCB2.checked = false;
    } else if (cb_id === "greenCheckbox1") {
	greenCB2.checked = cb_checked;
	rgbCB1.checked = false;
	rgbCB2.checked = false;
    } else if (cb_id === "greenCheckbox2") {
	greenCB1.checked = cb_checked;
	rgbCB1.checked = false;
	rgbCB2.checked = false;
    } else if (cb_id === "blueCheckbox1") {
	blueCB2.checked = cb_checked;
	rgbCB1.checked = false;
	rgbCB2.checked = false;
    } else if (cb_id === "blueCheckbox2") {
	blueCB1.checked = cb_checked;
	rgbCB1.checked = false;
	rgbCB2.checked = false;
    }

    selectedColors = Array();
    selectedColorsOffset = Array();

    var anyColorSelected = false;
    var colorOffset = 0;
    for (var color of COLORS) {
	var colorCB = document.getElementById(color + "Checkbox1");
	if (colorCB.checked) {
	    anyColorSelected = true;
	    selectedColors.push(color.charAt(0).toUpperCase());
	    selectedColorsOffset.push(colorOffset);
	}
	colorOffset++;
    }
    console.log("selectedColors:", selectedColors, selectedColorsOffset, anyColorSelected);

    var colorOrderSelect = document.getElementById("colorOrderSelect");
    if (selectedColors.length > 0) {
	var colorsPermutation = permute(selectedColors, 0);
	console.log("colorsPermutation:", colorsPermutation);

	// Clear all options but first one
	for (var i = colorOrderSelect.options.length - 1; i > 0; i--) {
	    colorOrderSelect.options.remove(i);
	}	
	for (var perm of colorsPermutation) {
	    var option = document.createElement("option");
	    option.text = perm;
	    option.value = perm;
	    colorOrderSelect.options.add(option);
	}

	if (selectedColors.length === 1) {
	    colorOrderSelect.selectedIndex = 1;
	} else {
	    colorOrderSelect.selectedIndex = 0;
	}	
	colorOrderSelect.disabled = false;
    } else {
	colorOrderSelect.disabled = true;
    }
    
    updateExtractButton();
}


function onBitCheckboxClick(cb)
{
    //console.log(cb);

    var cb_id = cb.id;
    var cb_checked = cb.checked;

    if (cb_id === "allCheckbox") {
	var bit7CB = document.getElementById("bit7Checkbox");
	var bit6CB = document.getElementById("bit6Checkbox");
	var bit5CB = document.getElementById("bit5Checkbox");
	var bit4CB = document.getElementById("bit4Checkbox");
	var bit3CB = document.getElementById("bit3Checkbox");
	var bit2CB = document.getElementById("bit2Checkbox");
	var bit1CB = document.getElementById("bit1Checkbox");
	var bit0CB = document.getElementById("bit0Checkbox");

	bit7CB.checked = cb_checked;
	bit6CB.checked = cb_checked;
	bit5CB.checked = cb_checked;
	bit4CB.checked = cb_checked;
	bit3CB.checked = cb_checked;
	bit2CB.checked = cb_checked;
	bit1CB.checked = cb_checked;
	bit0CB.checked = cb_checked;
    } else {
	var allCB = document.getElementById("allCheckbox");
	allCB.checked = false;
    }
    
    selectedBits = Array();
    selectedBitMask = 0x00;
    var bitValue = 0x01;
    for (var i = 0; i < 8; i++) {
	var bitCB = document.getElementById("bit" + i + "Checkbox");
	if (bitCB.checked) {
	    selectedBits.unshift(i);
	    selectedBitMask = selectedBitMask | bitValue;
	}
	bitValue = bitValue << 1;
    }
    console.log("selectedBits:", selectedBits, "0b" + selectedBitMask.toString(2),
		selectedBitMask);

    updateExtractButton();
}


function updateExtractButton()
{
    const anyColorSelected = (selectedColors.length > 0);
    const anyBitSelected = (selectedBits.length > 0);
    
    const colorOrderSelect = document.getElementById("colorOrderSelect");
    const colorOrderIdx = colorOrderSelect.selectedIndex;
    const colorOrderSelected = (colorOrderIdx != 0);
    
    const anythingToExtract = imageLoaded && anyColorSelected && anyBitSelected
	  && colorOrderSelected;
    
    extractButton = document.getElementById("extractButton");
    extractButton.disabled = !anythingToExtract;
}


function permute(array)
{
    let ret = [];
    
    for (let i = 0; i < array.length; i++) {
	let rest = permute(array.slice(0, i).concat(array.slice(i + 1)));

	if(rest.length === 0) {
	    ret.push([array[i]])
	} else {
	    for(let j = 0; j < rest.length; j++) {
		ret.push([array[i]].concat(rest[j]).join(""))
	    }
	}
    }
    
    return ret;
}


function extractLSB()
{    
    const img = document.getElementById("rgbImg");
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    var canvas = document.createElement('canvas');
    canvas.width = imgW;
    canvas.height = imgH;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var imgData = ctx.getImageData(0, 0, imgW, imgH);    
    var imgPixels = imgData.data;

    var colorOrderSelect = document.getElementById("colorOrderSelect");
    var colorOrderIdx = colorOrderSelect.selectedIndex;
    var colorOrder = colorOrderSelect.options[colorOrderIdx].text;
    console.log("colorOrder:", colorOrder);

    var orderedColors = [];
    var orderedColorsOffset = [];
    for (var i = 0; i < colorOrder.length; i++) {
	var colorChar = colorOrder.charAt(i);
	if ((colorChar == 'R') && selectedColors.includes('R')) {
	    orderedColors.push('red');
	    orderedColorsOffset.push(0);
	} else if ((colorChar == 'G')  && selectedColors.includes('G')) {
	    orderedColors.push('green');
	    orderedColorsOffset.push(1);
	} else if ((colorChar == 'B')  && selectedColors.includes('B')) {
	    orderedColors.push('blue');
	    orderedColorsOffset.push(2);
	}
    }
    console.log("orderedColors:", orderedColors);
    console.log("orderedColorsOffset:", orderedColorsOffset);
    
    const mask = selectedBitMask;
    const bitsPerPixel = selectedBits.length * selectedColors.length;
    const byteBufferLen = (imgW * imgH * bitsPerPixel) / 8;
    var byteBuffer = new Uint8Array(Math.ceil(byteBufferLen));
    var byteBufferIdx = 0;

    console.log("byteBufferLen:", byteBufferLen, Math.ceil(byteBufferLen));
    
    var bitBuffer = 0x00;
    var bitBufferLen = 0;
    for (var i = 0; i < imgPixels.length; i += 4) {
	
	for (var colorOffset of orderedColorsOffset) {
	    colorValue = imgPixels[i + colorOffset];

	    if (debug) {
		console.log("byteBuffer:", byteBuffer.slice(0, byteBufferIdx),
			    byteBufferIdx + "/" + byteBufferLen);
		console.log("bitBuffer:", bitBuffer, "0b" + bitBuffer.toString(2),
			    bitBufferLen);
		console.log("colorValue[" + i + "+" + colorOffset + "]:", colorValue,
			    "0b" + colorValue.toString(2))
	    }
	    
	    for (var bitOffset of selectedBits) {
		var bitValue = (colorValue >> bitOffset) & 0x01;

		if (debug) {
		    console.log("bitValue(" + bitOffset +  "):", bitValue);
		}
		
		bitBuffer = (bitBuffer << 1) | bitValue;
		bitBufferLen += 1;
		
		if (bitBufferLen === 8) {
		    byteBuffer[byteBufferIdx] = bitBuffer;
		    byteBufferIdx++;
		    bitBuffer = 0x00;
		    bitBufferLen = 0;
		}		
	    }
	}
    }

    // Add remaining bits to byteBuffer
    if (bitBufferLen > 0) {
	console.log("byteBuffer:", byteBuffer.slice(0, byteBufferIdx),
		    byteBufferIdx + "/" + byteBufferLen);
	console.log("bitBuffer:", "0b" + bitBuffer.toString(2), bitBufferLen);
	
	remainingBitsLen = 8 - bitBufferLen;
	bitBuffer << remainingBitsLen;
	byteBuffer[byteBufferIdx] = bitBuffer;
	byteBufferIdx++;
	bitBuffer = 0x00;
	bitBufferLen = 0;
    }

    console.log("byteBuffer:", byteBuffer.slice(0, byteBufferIdx),
		byteBufferIdx + "/" + byteBufferLen);    

    var pattern = "";
    for (var color of orderedColors) {
	pattern += '_' + color.charAt(0).toUpperCase();	
	for (var bit of selectedBits) {
	    pattern += bit;
	}
    }    
    var input = document.getElementById("inputImageFile");
    var file = input.files[0];
    var filename = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
    filename = filename + pattern + ".dat"

    var a = document.createElement("a");
    var blob = new Blob([byteBuffer], {type: "application/octet-stream"});
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
}


// Based on https://www.w3schools.com/howto/howto_css_modal_images.asp

// Get the full image modal
var modal = document.getElementById("fullImgModal");

// Get the <span> element that closes the modal
var closeModal = document.getElementsByClassName("closeModal")[0];

// When the user clicks on <span> (x), close the modal
closeModal.onclick = function() {
    modal.style.display = "none";
} 

var modalImg = document.getElementById("fullImg");
var captionText = document.getElementById("fullImgCaption");

function showFullImgModal(img) {
    // Get the image and insert it inside the modal - use its "alt" text as a caption
    modal.style.display = "block";
    modalImg.src = img.src;
    captionText.innerHTML = img.alt + " [" + img.naturalWidth + "x" + img.naturalHeight + "]";    
}

// var thumbnails = document.getElementsByClassName("thumbnail")
// for (var i = 0; i < thumbnails.length; i += 1) {
//     var thumbnail = thumbnails[i];
//     thumbnail.onclick = showFullImgModal(thumbnail);
// }

