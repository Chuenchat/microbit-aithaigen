function read_water_level (water_level_pin: number) {
    return Environment.ReadWaterLevel(water_level_pin)
}
function read_analog (pin: number) {
    return pins.analogReadPin(pin)
}
function write_analog (pin: number, value: number) {
    pins.analogWritePin(pin, value)
return 1
}
function read_light_intensity (light_intensity_pin: number) {
    return Environment.ReadLightIntensity(light_intensity_pin)
}
input.onButtonPressed(Button.A, function () {
    serial.writeString("responseA")
    if (enable_listen_button_ab) {
        responseA = "" + commandButtonAB + "::a1"
        serial.writeString(responseA)
    }
})
function move_servo (pin: number, angle: number) {
    pins.servoWritePin(pin, angle)
return 1
}
function read_digital (pin: number) {
    return pins.digitalReadPin(pin)
}
function set_analog_period (pin: number, period: number) {
    pins.analogSetPeriod(pin, period)
return 1
}
function read_sonarbit_distance (pin: number, distance_unit: number) {
    return Environment.sonarbit_distance(distance_unit, pin) / 2
}
function play_music (music_id: number) {
    music._playDefaultBackground(music.builtInPlayableMelody(music_id), music.PlaybackMode.InBackground)
    return 1
}
function read_soil_humidity (soil_moisture_pin: number) {
    return Environment.ReadSoilHumidity(soil_moisture_pin)
}
function read_noise (noise_pin: number) {
    return Environment.ReadNoise(noise_pin)
}
function read_dust (v_led: number, vo: number) {
    return Environment.ReadDust(v_led, vo)
}
function read_pir (pin: number) {
    if (Environment.PIR(pin)) {
        return 1
    } else {
        return 0
    }
}
input.onButtonPressed(Button.B, function () {
    serial.writeString("responseB")
    if (enable_listen_button_ab) {
        responseB = "" + commandButtonAB + "::b1"
        serial.writeString(responseB)
    }
})
function listen_button_ab (state: number) {
    if (state === 1) {
        enable_listen_button_ab = true;
        return 'ready'
    } else if (state === 0) {
        enable_listen_button_ab = false;
        return 'off'
    } else {
        return state
    }
}
function listen_accelerometer () {
	
}
serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
    // exit if not ready
    if (!(readyForNextCommand)) {
        return;
    }
    message = serial.readUntil(serial.delimiters(Delimiters.NewLine))
    function_name = "exception"
    function_id = "exception"
    // set to false immediately after starting processing
    readyForNextCommand = false
    try {
        let parts = message.split(":");
        if (parts.length < 2) throw "Invalid data format";

        function_name = parts[0];
        function_id = parts[1];
        let args = parts.slice(2);

        let func = functions[function_name];
        if (!func) throw "Function not found";

        let parsed_args: any[] = [];
        for (let arg of args) {
            if (pins_map[arg] !== undefined) {
                parsed_args.push(pins_map[arg]);
            } else {
                let parsedInt = parseInt(arg);
                if (!isNaN(parsedInt)) {
                    parsed_args.push(parsedInt);
                } else {
                    parsed_args.push(arg);
                }
            }
        }

        let result;
        switch (parsed_args.length) {
            case 0:
                result = func();
                break;
            case 1:
                result = func(parsed_args[0]);
                break;
            case 2:
                result = func(parsed_args[0], parsed_args[1]);
                break;
            case 3:
                result = func(parsed_args[0], parsed_args[1], parsed_args[2]);
                break;
            default:
                result = -1; // handle case when number of arguments exceed expectations
                break;
        }

        let response3 = function_name + ":" + function_id + ":" + result + "\n";
        serial.writeString(response3);
    } catch (e) {
        let response22 = function_name + ":" + function_id + ":-1\n";
        serial.writeString(response22);
    } finally {
        readyForNextCommand = true; // set to true once processing is done
        basic.pause(50); // 50ms delay to provide buffer
    }
})
function play_sound (sound_id: number) {
    music.play(music.builtinPlayableSoundEffect(soundExpressionsMap[sound_id]), music.PlaybackMode.InBackground)
    return 1
}
function write_led_matrix () {
	
}
function write_digital (pin: number, value: number) {
    pins.digitalWritePin(pin, value)
return 1
}
function read_BME280 (state: number) {
    if (state == 0) {
        return Environment.octopus_BME280(Environment.BME280_state.BME280_temperature_C)
    }
    if (state == 1) {
        return Environment.octopus_BME280(Environment.BME280_state.BME280_humidity)
    }
    if (state == 2) {
        return Environment.octopus_BME280(Environment.BME280_state.BME280_pressure)
    }
    if (state == 3) {
        return Environment.octopus_BME280(Environment.BME280_state.BME280_altitude)
    }
    return 0
}
let responseB = ""
let responseA = ""
let enable_listen_button_ab = false
let commandButtonAB = "t"
let readyForNextCommand = false
let message = ""
let function_name = ""
let function_id = ""
let response4 = ""
let response23 = ""
serial.setTxBufferSize(32)
serial.setRxBufferSize(96)
function add_text (text: string | number) {
    OLED.clear()
    OLED.writeStringNewLine(convertToText(text))
    return 1
}
const soundExpressionsMap: { [key: number]: SoundExpression } = {
    1: soundExpression.giggle,
    2: soundExpression.happy,
    3: soundExpression.hello,
    4: soundExpression.mysterious,
    5: soundExpression.sad,
    6: soundExpression.slide,
    7: soundExpression.soaring,
    8: soundExpression.spring,
    9: soundExpression.twinkle
}
const functions: { [key: string]: Function } = {
    'a': add_text,
    'd': read_BME280,
    'e': read_dust,
    'f': read_light_intensity,
    'g': read_noise,
    'h': read_pir,
    'i': read_soil_humidity,
    'j': read_water_level,
    'k': read_sonarbit_distance,
    'l': move_servo,
    'm': read_digital,
    'n': read_analog,
    'o': write_digital,
    'p': write_analog,
    'q': set_analog_period,
    'r': play_sound,
    's': play_music,
    't': listen_button_ab,
    'u': listen_accelerometer,
    'v': write_led_matrix,
}
const pins_map: { [key: string]: number} = {
    'p0': 100,
    'p1': 101,
    'p2': 102,
    'p3': 103,
    'p4': 104,
    'p5': 105,
    'p6': 106,
    'p7': 107,
    'p8': 108,
    'p9': 109,
    'p10': 110,
    'p11': 111,
    'p12': 112,
    'p13': 113,
    'p14': 114,
    'p15': 115,
    'p16': 116,
    'p19': 119,
    'p20': 120 
}
led.enable(false)
pins.setAudioPinEnabled(false)
serial.setBaudRate(BaudRate.BaudRate115200)
OLED.init(128, 64)
OLED.clear()
readyForNextCommand = true