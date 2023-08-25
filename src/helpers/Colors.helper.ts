export default class ColorHelper {

    // This allows for cleaner logging, without color combinations
    static log(text: string, color: Color) {
        console.log(colors[color] + text + colors.reset);
    }

    static colorText(text: string, color: Color): string {
        return colors[color] + text + colors.reset;
    }

    static red(text: string): string {
        return ColorHelper.colorText(text, 'red');
    }

    static green(text: string): string {
        return ColorHelper.colorText(text, 'green');
    }

    static blue(text: string): string {
        return ColorHelper.colorText(text, 'blue');
    }

    static cyan(text: string): string {
        return ColorHelper.colorText(text, 'cyan');
    }
}

type Color = 
    | 'reset'
    | 'red'
    | 'green'
    | 'yellow'
    | 'blue'
    | 'magenta'
    | 'cyan'
    | 'white'

const colors: { [key in Color]: string } = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m"
}