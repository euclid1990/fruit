import {Pipe, PipeTransform} from '@angular/core';

/**
 * Print Object in View
 * Example:
 * <div [innerHTML]="obj | prettyprint"></div>
 */
@Pipe({ name: 'prettyprint' })
export class PrettyPrintPipe implements PipeTransform {
    transform(value: Object) : string {
        return JSON.stringify(value, this.censor(value), 2)
            .replace(/ /g, '&nbsp;')
            .replace(/\n/g, '<br/>');
    }
    censor(censor) {
        var i = 0;
        return function(key, value) {
            if (i !== 0 && typeof (censor) === 'object' && typeof (value) == 'object' && censor == value) {
                return '[Circular]';
            }
            // Seems to be a harded maximum of 100 serialized objects
            if (i >= 100) {
                return '[Unknown]';
            }
            // So we know we aren't using the original object anymore
            ++i;
            return value;
        }
    }
}