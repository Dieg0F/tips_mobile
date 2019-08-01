export class StarRateHelper {

    starsRate(value: number): Array<String> {
        var array = new Array<String>()
        var style = ""

        for (let i = 1; i <= 5; i++) {
            if (i <= value) {
                array.push('star')
            } else {
                array.push('star-outline')
            }
        }

        array.push(style)

        return array
    }

    starsRateColor(value: number): String {
        var style = ""

        if (value == 0) {
            style = "grey"
        } else if (value > 0 && value < 2) {
            style = "bronze"
        } else if (value >= 2 && value < 4) {
            style = "silver"
        } else if (value >= 4) {
            style = "gold"
        }

        return style;
    }
}