
    document.querySelector('button3').addEventListener('click', async () => {
        // Prompt user to select an Arduino Uno device.
        const port = await navigator.serial.requestPort({ filters });
        const { usbProductId, usbVendorId } = port.getInfo();  
        await port.open({baudRate: 115200 });

    });   
                 
    // Filter on devices with the Arduino Uno USB Vendor/Product IDs.
    const filters = [
         { usbVendorId: 0x2341, usbProductId: 0x0043 },
         { usbVendorId: 0x2341, usbProductId: 0x0001 }
    ];
        
       
    async function connectSerial() {



        
        //Writer
        const textEncoder = new TextEncoderStream();
        const writableStreamClosed = textEncoder.readable.pipeTo(port.writable);
        const writer = textEncoder.writable.getWriter();
        writer.releaseLock(); //Allow the serial port to be closed later.
        //calling the reader function
        ReadPort();
        //if error happend while running the ocde then check the readtoport function outer while loop (x_x)
    }
    async function ReadPort() {
        //using textDecoder to convert UTF8 into string
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        //to be sure there are no fatal error we used a While loop 
        while (port.readable) {

            const reader = port.readable.getReader();

            try {
                //listen to data coming from serial device (nested while loop)
                while (true) {
                    const { value,done } = await reader.read();
                    if (done) {
                        reader.releaseLock();
                        break;
                    }
                    //here we might check whether user said right left or whatever in STT
                    if (value) {
                        console.log(value)
                    }
                }
            } catch (error) {
                //TODO: Handle non-fatal read Errors
                console.log(" Error occured while Reading.... (x_x) ")
            }
        }
    }


    //function for catching the word such as right or left

    async function record() { 
        var recognition = new webkitSpeechRecognition();
        recognition.onresult = function (event) {

            var a = document.getElementById('speechToText').value = event.results[0][0].transcript;
            if (a == "right" ||a=="يمين") {
                console.log(a)
                sendToSerial();

            } else if (a == "left" || a=="شمال" ||a=="يسار") {
                console.log(a)
                sendToSerialB();

            }

        }
        recognition.start();

    }
    async function sendToSerial() {
        dataToSend = 'Right'
        dataToSend = dataToSend + "\r\n"; // \r means to move curser to begining of the line- \n means newline character

        await writer.write(dataToSend);
    }
    async function sendToSerialB() {
        dataToSend = 'Left'
        dataToSend = dataToSend + "\r\n";

        await writer.write(dataToSend);
        writer.close();
        await writableStreamClosed;
    }
