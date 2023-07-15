export default class ColorHelper {
    static colorText(text: string, color: Color): string {
        return colors[color] + text + colors.reset;
    }

    static blue(text: string): string {
        return ColorHelper.colorText(text, 'blue');
    }

    static cyan(text: string): string {
        return ColorHelper.colorText(text, 'cyan');
    }
}

type Color = 'cyan' | 'blue' | 'red' | 'reset'

const colors: { [key in Color]: string } = {
    reset: "\x1b[0m",
    red: "\x1b[31m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m"
}