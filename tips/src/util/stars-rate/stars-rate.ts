export class StarRateHelper {

    /**
     * @description Build a array of string with all stars rate icons.
     * @param value User rate value.
     */
    public starsRate(value: number): string[] {
        const array = new Array<string>();
        const style = '';

        for (let i = 1; i <= 5; i++) {
            if (i <= value) {
                array.push('star');
            } else {
                array.push('star-outline');
            }
        }

        array.push(style);

        return array;
    }

    /**
     * @description Build a string with a specific color by user rate.
     * @param value User rate value.
     */
    public starsRateColor(value: number): string {
        let style = '';

        if (value === 0) {
            style = 'grey';
        } else if (value > 0 && value < 2) {
            style = 'bronze';
        } else if (value >= 2 && value < 4) {
            style = 'silver';
        } else if (value >= 4) {
            style = 'gold';
        }

        return style;
    }
}
