import {Pipe, PipeTransform} from '@angular/core';
/**
 * Usage:
 *   {{some_text | truncate:true:100:'...'}}
 * Options:
 *   wordwise (boolean) - if true, cut only by words bounds,
 *   max (integer) - max length of the text, cut to this number of chars,
 *   tail (string, default: '…') - add this string to the input string if the string was cut.
 */
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
    transform(value: string, wordwise: boolean, max: number, tail: string): string {
        if (!value) return '';

        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                // Also remove . and , so its gives a cleaner result
                if (value.charAt(lastspace - 1) == '.' || value.charAt(lastspace - 1) == ',') {
                    lastspace = lastspace - 1;
                }
                value = value.substr(0, lastspace);
            }
        }
        return value + (tail || '…');
    }
}