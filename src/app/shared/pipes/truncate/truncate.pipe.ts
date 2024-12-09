import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate',
    standalone: true
})
export class TruncatePipe implements PipeTransform {
    /**
     * truncates a string at a given limit with options for complete words and showing ellipsis
     *
     * @param value
     * @param [limit=25]
     * @param [completeWords=false]
     * @param [ellipsis='...']
     */
    transform(
        value: string | null | undefined,
        limit: number = 25,
        completeWords: boolean = false,
        wordDelimiter: string = ' ',
        showCount: boolean = false,
        ellipsis: string = '...'
    ): string | null | undefined {
        if (!limit || !value || value?.length <= limit) {
            return value;
        }
        if (completeWords) {
            limit = value.substring(0, limit).lastIndexOf(wordDelimiter);
            if (showCount) {
                ellipsis = limit > 0 ? ', .. +' : '';
                ellipsis += value
                    .substring(limit + 1)
                    .split(wordDelimiter).length;
            }
        }
        let finalWord = value?.toString();
        return finalWord.substring(0, limit) + (finalWord.length>limit ? ellipsis:'');
    }
}
